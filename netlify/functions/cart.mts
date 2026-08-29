import { bad, guard, json, sqlClient } from '../lib/db.mts'

/** Cart ids are minted by the browser, so never trust the shape of one. */
const VALID_ID = /^[A-Za-z0-9_-]{8,64}$/

type Sql = ReturnType<typeof sqlClient>

async function readCart(sql: Sql, cartId: string) {
  const items = (await sql`
    select p.id           as "productId",
           p.name, p.description, p.image, p.category,
           p.price::float8 as price,
           p.stock,
           ci.quantity
    from cart_items ci
    join products p on p.id = ci.product_id
    where ci.cart_id = ${cartId}
    order by ci.added_at`) as any[]

  return {
    cartId,
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: Number(items.reduce((n, i) => n + i.price * i.quantity, 0).toFixed(2)),
  }
}

async function handler(req: Request) {
  const url = new URL(req.url)
  const sql = sqlClient()

  const body: any =
    req.method === 'GET' || req.method === 'DELETE' ? {} : await req.json().catch(() => ({}))

  const cartId: string = body.cartId ?? url.searchParams.get('cartId') ?? ''
  if (!VALID_ID.test(cartId)) return bad('A valid cartId is required')

  if (req.method === 'GET') return json(await readCart(sql, cartId))

  if (req.method === 'POST') {
    const productId = Number(body.productId)
    // `delta` lets one endpoint serve both "add one" and "remove one".
    const delta = Number.isFinite(Number(body.delta)) ? Number(body.delta) : 1
    if (!Number.isInteger(productId)) return bad('productId must be an integer')
    if (!Number.isInteger(delta) || delta === 0) return bad('delta must be a non-zero integer')

    const found = (await sql`select id, stock from products where id = ${productId}`) as any[]
    if (!found.length) return bad('No such product', 404)
    const stock: number = found[0].stock

    await sql`insert into carts (id) values (${cartId}) on conflict (id) do nothing`

    if (delta > 0) {
      // Clamp to stock so a fast clicker cannot order more than exists.
      await sql`
        insert into cart_items (cart_id, product_id, quantity)
        values (${cartId}, ${productId}, ${Math.min(delta, stock)})
        on conflict (cart_id, product_id)
        do update set quantity = least(cart_items.quantity + ${delta}, ${stock})`
    } else {
      await sql`
        update cart_items set quantity = quantity + ${delta}
        where cart_id = ${cartId} and product_id = ${productId}`
      // Quantity zero means the line is gone, not a line showing "0".
      await sql`delete from cart_items where cart_id = ${cartId} and quantity <= 0`
    }

    await sql`update carts set updated_at = now() where id = ${cartId}`
    return json(await readCart(sql, cartId))
  }

  if (req.method === 'DELETE') {
    const productId = url.searchParams.get('productId')
    if (productId) {
      await sql`delete from cart_items where cart_id = ${cartId} and product_id = ${Number(productId)}`
    } else {
      await sql`delete from cart_items where cart_id = ${cartId}`
    }
    return json(await readCart(sql, cartId))
  }

  return bad('Method not allowed', 405)
}

export default guard(handler)

export const config = { path: '/api/cart' }
