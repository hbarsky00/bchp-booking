import { bad, guard, json } from '../lib/db.mts'
import { query } from '../lib/tx.mts'
import { requireAdmin } from '../lib/auth.mts'

/**
 * Season management.
 *
 * Rates were seeded by a migration, which meant changing what a week costs took a code
 * change and a deploy. Seasons are business data, not schema.
 *
 * Every method is behind the admin session: a season is a price, and a price anyone can
 * edit is not a price.
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/

interface Body { id?: unknown; name?: unknown; startsOn?: unknown; endsOn?: unknown; multiplier?: unknown; priority?: unknown }

/** Returns an error message, or the cleaned row. */
function validate(b: Body): string | { name: string; startsOn: string; endsOn: string; multiplier: number; priority: number } {
  const name = String(b.name ?? '').trim()
  const startsOn = String(b.startsOn ?? '')
  const endsOn = String(b.endsOn ?? '')
  const multiplier = Number(b.multiplier)
  const priority = Number(b.priority ?? 10)

  if (!name) return 'Give the season a name'
  if (name.length > 60) return 'Keep the name under 60 characters'
  if (!DATE.test(startsOn) || !DATE.test(endsOn)) return 'Dates must be YYYY-MM-DD'
  if (endsOn < startsOn) return 'The end date cannot be before the start date'
  if (!Number.isFinite(multiplier) || multiplier <= 0 || multiplier > 10) {
    return 'The multiplier must be between 0 and 10'
  }
  if (!Number.isInteger(priority) || priority < 0 || priority > 1000) {
    return 'Priority must be a whole number from 0 to 1000'
  }
  return { name, startsOn, endsOn, multiplier, priority }
}

const SELECT = `select id, name, to_char(starts_on,'YYYY-MM-DD') as "startsOn",
                       to_char(ends_on,'YYYY-MM-DD') as "endsOn",
                       multiplier::float8 as multiplier, priority
                  from rate_seasons order by starts_on, priority desc`

async function handler(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  if (req.method === 'GET') return json(await query(SELECT))

  if (req.method === 'POST') {
    const parsed = validate(await req.json().catch(() => ({})))
    if (typeof parsed === 'string') return bad(parsed)
    const [row] = await query(
      `insert into rate_seasons (name, starts_on, ends_on, multiplier, priority)
       values ($1, $2::date, $3::date, $4, $5::int)
       returning id`,
      [parsed.name, parsed.startsOn, parsed.endsOn, parsed.multiplier, parsed.priority],
    )
    return json({ id: row.id, seasons: await query(SELECT) }, 201)
  }

  if (req.method === 'PATCH') {
    const body: Body = await req.json().catch(() => ({}))
    const id = Number(body.id)
    if (!Number.isInteger(id)) return bad('id must be an integer')
    const parsed = validate(body)
    if (typeof parsed === 'string') return bad(parsed)

    const rows = await query(
      `update rate_seasons
          set name = $1, starts_on = $2::date, ends_on = $3::date,
              multiplier = $4, priority = $5::int
        where id = $6::int
        returning id`,
      [parsed.name, parsed.startsOn, parsed.endsOn, parsed.multiplier, parsed.priority, id],
    )
    if (!rows.length) return bad('No season with that id', 404)
    return json({ seasons: await query(SELECT) })
  }

  if (req.method === 'DELETE') {
    const id = Number(new URL(req.url).searchParams.get('id'))
    if (!Number.isInteger(id)) return bad('id must be an integer')
    const rows = await query('delete from rate_seasons where id = $1::int returning id', [id])
    if (!rows.length) return bad('No season with that id', 404)
    // Stays already booked keep their price: booking_nights holds each night's rate, so
    // deleting a season changes what future guests pay and nothing else.
    return json({ seasons: await query(SELECT) })
  }

  return bad('Method not allowed', 405)
}

export default guard(handler)

export const config = { path: '/api/seasons' }
