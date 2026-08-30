import { bad, guard, json } from '../lib/db.mts'
import { query, transaction } from '../lib/tx.mts'

const KEY = /^[A-Za-z0-9_-]{8,64}$/

const makeReference = () =>
  'ORD-' + new Date().getFullYear() + '-' +
  Math.floor(Math.random() * 36 ** 5).toString(36).toUpperCase().padStart(5, '0')

const SELECT = `
  select o.id, o.reference, o.status, o.subtotal::float8 as subtotal, o.note,
         o.created_at as "createdAt", o.booking_reference as "bookingReference",
         b.unit_name as "unitName",
         coalesce(items.items, '[]'::json) as items
  from orders o
  left join lateral (
    select json_agg(json_build_object(
             'productId', oi.product_id, 'name', oi.name,
             'unitPrice', oi.unit_price::float8, 'quantity', oi.quantity,
             'image', p.image
           ) order by oi.id) as items
    from order_items oi join products p on p.id = oi.product_id
    where oi.order_id = o.id
  ) items on true
  left join lateral (
    select u.name as unit_name from bookings bk
    join units u on u.id = bk.unit_id
    where bk.reference = o.booking_reference
  ) b on true`

async function handler(req: Request) {
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const reference = url.searchParams.get('reference')
    if (reference) {
      const rows = await query(`${SELECT} where o.reference = $1`, [reference])
      return rows.length ? json(rows[0]) : bad('No order with that reference', 404)
    }
    const guestKey = url.searchParams.get('guestKey') ?? ''
    if (!KEY.test(guestKey)) return bad('A valid guestKey is required')
    return json(await query(`${SELECT} where o.guest_key = $1 order by o.created_at desc`, [guestKey]))
  }

  if (req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}))
    const guestKey = String(body.guestKey ?? '')
    const cartId = String(body.cartId ?? '')
    if (!KEY.test(guestKey)) return bad('A valid guestKey is required')
    if (!KEY.test(cartId)) return bad('A valid cartId is required')

    try {
      const reference = await transaction(async (q) => {
        // Lock the cart's lines so a double-submit cannot place the order twice.
        const lines = await q(
          `select ci.product_id, ci.quantity, p.name, p.price, p.stock
           from cart_items ci join products p on p.id = ci.product_id
           where ci.cart_id = $1
           order by ci.product_id
           for update of ci, p`,
          [cartId],
        )
        if (!lines.rows.length) throw Object.assign(new Error('Your cart is empty'), { status: 409 })

        const short = lines.rows.find((l: any) => l.quantity > l.stock)
        if (short) {
          throw Object.assign(
            new Error(`Only ${short.stock} × ${short.name} left`), { status: 409 },
          )
        }

        // Deliver to the guest's current stay when they have one; otherwise no room.
        const stay = await q(
          `select reference from bookings
           where guest_key = $1 and status in ('paid','reserved')
           order by check_in limit 1`,
          [guestKey],
        )
        const bookingReference = stay.rows[0]?.reference ?? null

        const subtotal = lines.rows
          .reduce((n: number, l: any) => n + Number(l.price) * l.quantity, 0)
          .toFixed(2)

        const order = await q(
          `insert into orders (reference, guest_key, booking_reference, subtotal, note)
           values ($1,$2,$3,$4,$5) returning id, reference`,
          [makeReference(), guestKey, bookingReference, subtotal, String(body.note ?? '').slice(0, 300)],
        )
        const orderId = order.rows[0].id

        for (const l of lines.rows) {
          await q(
            `insert into order_items (order_id, product_id, name, unit_price, quantity)
             values ($1,$2,$3,$4,$5)`,
            [orderId, l.product_id, l.name, l.price, l.quantity],
          )
          // Ordered stock leaves the shelf.
          await q('update products set stock = stock - $1 where id = $2', [l.quantity, l.product_id])
        }

        // The cart has become an order; emptying it here prevents a duplicate submit.
        await q('delete from cart_items where cart_id = $1', [cartId])

        return order.rows[0].reference as string
      })

      const rows = await query(`${SELECT} where o.reference = $1`, [reference])
      return json(rows[0], 201)
    } catch (err) {
      const e = err as Error & { status?: number }
      if (e.status) return bad(e.message, e.status)
      throw err
    }
  }

  return bad('Method not allowed', 405)
}

export default guard(handler)

export const config = { path: '/api/orders' }
