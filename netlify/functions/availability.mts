import { bad, guard, json } from '../lib/db.mts'
import { query } from '../lib/tx.mts'
import { asDate, eachNight, quote, seasonFor, type Season } from '../lib/pricing.mts'

const DATE = /^\d{4}-\d{2}-\d{2}$/
const MIN_NIGHTS = 3
const MAX_WINDOW_DAYS = 400

/**
 * What a calendar needs to draw itself: which nights are taken, and what each free night
 * costs. Both in one call, because a calendar that shows availability without prices sends
 * the guest hunting for the cost of the dates they just picked.
 *
 * `?checkIn&checkOut` additionally returns a priced quote for that range.
 */
async function handler(req: Request) {
  const url = new URL(req.url)
  const unitId = Number(url.searchParams.get('unitId'))
  if (!Number.isInteger(unitId) || unitId < 1) return bad('unitId must be a positive integer')

  const today = new Date().toISOString().slice(0, 10)
  const from = url.searchParams.get('from') ?? today
  const to = url.searchParams.get('to') ?? new Date(Date.now() + 365 * 86_400_000).toISOString().slice(0, 10)
  if (!DATE.test(from) || !DATE.test(to)) return bad('from and to must be YYYY-MM-DD')
  if (to <= from) return bad('to must be after from')
  if (eachNight(from, to).length > MAX_WINDOW_DAYS) return bad(`Ask for at most ${MAX_WINDOW_DAYS} days at a time`)

  const [unit] = await query<{ id: number; name: string; price: string; max_guests: number; active: boolean }>(
    'select id, name, price, max_guests, active from units where id = $1', [unitId],
  )
  if (!unit) return bad('No such unit', 404)

  const seasons = await query<Season>(
    `select name, starts_on, ends_on, multiplier, priority from rate_seasons
      where starts_on <= $2::date and ends_on >= $1::date`,
    [from, to],
  )

  // Every night held by a live booking. Half-open, so the check-out day is free again.
  const booked = await query<{ night: string }>(
    `select to_char(
              generate_series(b.check_in, b.check_out - interval '1 day', interval '1 day'),
              'YYYY-MM-DD'
            ) as night
       from bookings b
      where b.unit_id = $1
        and b.status <> 'cancelled'
        and b.check_out > $2::date
        and b.check_in  < $3::date`,
    [unitId, from, to],
  )
  const takenSet = new Set(booked.map(r => asDate(r.night)))

  const base = Number(unit.price)
  const days = eachNight(from, to).map(date => {
    const s = seasonFor(date, seasons)
    return {
      date,
      // A past night is not bookable either; the calendar greys both the same way but the
      // reason differs, so it is reported rather than conflated with a booking.
      past: date < today,
      booked: takenSet.has(date),
      rate: Math.round(base * (s ? Number(s.multiplier) : 1) * 100) / 100,
      season: s?.name ?? null,
    }
  })

  const checkIn = url.searchParams.get('checkIn') ?? ''
  const checkOut = url.searchParams.get('checkOut') ?? ''
  let selection = null
  if (DATE.test(checkIn) && DATE.test(checkOut) && checkOut > checkIn) {
    const clash = eachNight(checkIn, checkOut).find(d => takenSet.has(d))
    selection = clash
      ? { ok: false as const, reason: `${clash} is already booked` }
      : { ok: true as const, ...quote(base, checkIn, checkOut, seasons) }
  }

  return json({
    unitId, unitName: unit.name, basePrice: base, minNights: MIN_NIGHTS,
    from, to, days, selection,
  })
}

export default guard(handler)

export const config = { path: '/api/availability' }
