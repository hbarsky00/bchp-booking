import { bad, guard, json } from '../lib/db.mts'
import { query } from '../lib/tx.mts'

/**
 * Admin data: every booking, including guest names, emails and phone numbers.
 *
 * There is no user auth in this app, so this endpoint is gated on a shared secret in
 * ADMIN_TOKEN. It **fails closed** — if the variable is not set the endpoint refuses
 * outright rather than serving everyone's personal details to the open internet.
 */
function authorise(req: Request): Response | null {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return bad('Admin access is not configured on this deploy', 503)

  const supplied = req.headers.get('x-admin-token') ?? ''
  // Constant-time-ish: compare full length so a wrong token cannot be probed by timing.
  const ok =
    supplied.length === expected.length &&
    supplied.split('').reduce((acc, ch, i) => acc | (ch.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0
  return ok ? null : bad('Not authorised', 401)
}

async function handler(req: Request) {
  const denied = authorise(req)
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
      select u.id, u.name, u.floor, u.active,
             count(b.id) filter (where b.status <> 'cancelled')::int as "liveBookings"
      from units u left join bookings b on b.unit_id = u.id
      group by u.id order by u.id`)

    return json({ bookings, stats, units })
  }

  if (req.method === 'PATCH') {
    const body: any = await req.json().catch(() => ({}))
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
