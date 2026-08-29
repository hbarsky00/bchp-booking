import { bad, guard, json } from '../lib/db.mts'
import { query, transaction } from '../lib/tx.mts'

const KEY = /^[A-Za-z0-9_-]{8,64}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const SELECT = `
  select b.id, b.reference, b.status, b.check_in as "checkIn", b.check_out as "checkOut",
         b.guests, b.guest_name as "guestName", b.guest_email as "guestEmail",
         b.guest_phone as "guestPhone", b.notes, b.payment_method as "paymentMethod",
         b.nightly_rate::float8 as "nightlyRate", b.total::float8 as total,
         b.created_at as "createdAt",
         (b.check_out - b.check_in) as nights,
         u.id as "unitId", u.name as "unitName", u.image as "unitImage",
         u.floor as "unitFloor", u.amenities
  from bookings b join units u on u.id = b.unit_id`

/** Human-facing reference. Random rather than sequential so it leaks no volume. */
const makeReference = () =>
  'BST-' + new Date().getFullYear() + '-' +
  Math.floor(Math.random() * 36 ** 5).toString(36).toUpperCase().padStart(5, '0')

async function handler(req: Request) {
  const url = new URL(req.url)
  if (req.method === 'GET') {
    const reference = url.searchParams.get('reference')
    if (reference) {
      const rows = await query(`${SELECT} where b.reference = $1`, [reference])
      return rows.length ? json(rows[0]) : bad('No booking with that reference', 404)
    }
    const guestKey = url.searchParams.get('guestKey') ?? ''
    if (!KEY.test(guestKey)) return bad('A valid guestKey is required')
    const rows = await query(`${SELECT} where b.guest_key = $1 order by b.created_at desc`, [guestKey])
    return json(rows)
  }

  if (req.method === 'POST') {
    const b: any = await req.json().catch(() => ({}))
    const guestKey = String(b.guestKey ?? '')
    const unitId = Number(b.unitId)
    const checkIn = String(b.checkIn ?? '')
    const checkOut = String(b.checkOut ?? '')
    const guests = Number(b.guests ?? 1)

    if (!KEY.test(guestKey)) return bad('A valid guestKey is required')
    if (!Number.isInteger(unitId)) return bad('unitId must be an integer')
    if (!DATE.test(checkIn) || !DATE.test(checkOut)) return bad('Dates must be YYYY-MM-DD')
    if (checkOut <= checkIn) return bad('Check-out must be after check-in')
    if (!String(b.guestName ?? '').trim()) return bad('A guest name is required')
    if (!EMAIL.test(String(b.guestEmail ?? ''))) return bad('A valid email address is required')
    if (!Number.isInteger(guests) || guests < 1) return bad('guests must be a positive integer')

    try {
      const booking = await transaction(async (q) => {
        // Lock the unit row first: every booking for this unit now serialises here, so
        // two guests cannot both pass the availability check for the same dates.
        const unit = await q('select * from units where id = $1 for update', [unitId])
        if (!unit.rows.length) throw Object.assign(new Error('No such unit'), { status: 404 })
        const u = unit.rows[0]
        if (!u.active) throw Object.assign(new Error('That unit is not bookable'), { status: 409 })
        if (guests > u.max_guests) {
          throw Object.assign(new Error(`That unit sleeps ${u.max_guests}`), { status: 409 })
        }

        const clash = await q(
          `select reference from bookings
           where unit_id = $1 and status <> 'cancelled'
             and check_in < $3::date and check_out > $2::date
           limit 1`,
          [unitId, checkIn, checkOut],
        )
        if (clash.rows.length) {
          throw Object.assign(new Error('Those dates are no longer available'), { status: 409 })
        }

        const nights = Math.round(
          (Date.parse(checkOut + 'T00:00:00Z') - Date.parse(checkIn + 'T00:00:00Z')) / 86_400_000,
        )
        const total = (Number(u.price) * nights).toFixed(2)

        const inserted = await q(
          `insert into bookings
             (reference, unit_id, guest_key, guest_name, guest_email, guest_phone, notes,
              check_in, check_out, guests, status, payment_method, nightly_rate, total)
           values ($1,$2,$3,$4,$5,$6,$7,$8::date,$9::date,$10,$11,$12,$13,$14)
           returning reference`,
          [
            makeReference(), unitId, guestKey,
            String(b.guestName).trim(), String(b.guestEmail).trim(), String(b.guestPhone ?? '').trim(),
            String(b.notes ?? '').slice(0, 500),
            checkIn, checkOut, guests,
            b.status === 'paid' ? 'paid' : 'reserved',
            String(b.paymentMethod ?? 'bsv'),
            u.price, total,
          ],
        )
        return inserted.rows[0].reference as string
      })

      const rows = await query(`${SELECT} where b.reference = $1`, [booking])
      return json(rows[0], 201)
    } catch (err) {
      const e = err as Error & { status?: number }
      if (e.status) return bad(e.message, e.status)
      throw err
    }
  }

  if (req.method === 'PATCH') {
    const b: any = await req.json().catch(() => ({}))
    const reference = String(b.reference ?? '')
    const guestKey = String(b.guestKey ?? '')
    if (!reference || !KEY.test(guestKey)) return bad('reference and a valid guestKey are required')

    const allowed = ['cancelled', 'paid']
    if (!allowed.includes(b.status)) return bad(`status must be one of ${allowed.join(', ')}`)

    // Scope by guest_key as well: a reference alone must not let anyone cancel a stay.
    const rows = await query(
      `update bookings set status = $1, updated_at = now()
       where reference = $2 and guest_key = $3
       returning reference`,
      [b.status, reference, guestKey],
    )
    if (!rows.length) return bad('No booking with that reference', 404)

    const full = await query(`${SELECT} where b.reference = $1`, [reference])
    return json(full[0])
  }

  return bad('Method not allowed', 405)
}

export default guard(handler)

export const config = { path: '/api/bookings' }
