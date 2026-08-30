import { bad, guard, json } from '../lib/db.mts'
import { query } from '../lib/tx.mts'
import { requireAdmin } from '../lib/auth.mts'

/**
 * Admin data: every booking, including guest names, emails and phone numbers.
 *
 * Gated on the signed-in administrator's session cookie. This used to accept a shared
 * secret in a request header, which meant the credential had to live somewhere
 * JavaScript could read it — and anything that could read it could replay it. It still
 * fails closed: no valid session, no data.
 */
async function handler(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  if (req.method === 'GET') {
    const bookings = await query(`
      select b.id, b.reference, b.status, b.check_in as "checkIn", b.check_out as "checkOut",
             b.guests, b.guest_name as "guestName", b.guest_email as "guestEmail",
             b.guest_phone as "guestPhone", b.total::float8 as total,
             b.payment_method as "paymentMethod", b.created_at as "createdAt",
             (b.check_out - b.check_in) as nights,
             u.id as "unitId", u.name as "unitName", u.floor as "unitFloor", u.image as "unitImage"
      from bookings b join units u on u.id = b.unit_id
      order by b.created_at desc
      limit 200`)

    const [stats] = await query(`
      select count(*)::int                                                as "totalBookings",
             count(*) filter (where status = 'reserved')::int             as "pending",
             count(*) filter (where status = 'paid')::int                 as "paid",
             count(*) filter (where status = 'cancelled')::int            as "cancelled",
             coalesce(sum(total) filter (where status <> 'cancelled'), 0)::float8 as "revenue"
      from bookings`)

    const units = await query(`
      select u.id, u.name, u.floor, u.active, u.min_nights as "minNights",
             u.price::float8 as price,
             count(b.id) filter (where b.status <> 'cancelled')::int as "liveBookings"
      from units u left join bookings b on b.unit_id = u.id
      group by u.id order by u.id`)

    return json({ bookings, stats, units })
  }

  if (req.method === 'PATCH') {
    const body: any = await req.json().catch(() => ({}))

    // Room settings. Minimum stay was a constant of 3 for every room; whoever owns the
    // rooms decides which of them are worth withholding from a weekend.
    if (body.unitId !== undefined) {
      const unitId = Number(body.unitId)
      const minNights = Number(body.minNights)
      if (!Number.isInteger(unitId)) return bad('unitId must be an integer')
      if (!Number.isInteger(minNights) || minNights < 1 || minNights > 30) {
        return bad('Minimum stay must be a whole number of nights from 1 to 30')
      }
      const rows = await query(
        'update units set min_nights = $1::int where id = $2::int returning id, name, min_nights as "minNights"',
        [minNights, unitId],
      )
      if (!rows.length) return bad('No unit with that id', 404)
      return json(rows[0])
    }

    const reference = String(body.reference ?? '')
    const status = String(body.status ?? '')
    if (!reference) return bad('reference is required')
    if (!['reserved', 'paid', 'cancelled', 'checked_out'].includes(status)) {
      return bad('status must be reserved, paid, cancelled or checked_out')
    }

    const rows = await query(
      `update bookings set status = $1, updated_at = now() where reference = $2 returning reference, status`,
      [status, reference],
    )
    if (!rows.length) return bad('No booking with that reference', 404)
    return json(rows[0])
  }

  return bad('Method not allowed', 405)
}

export default guard(handler)

export const config = { path: '/api/admin' }
