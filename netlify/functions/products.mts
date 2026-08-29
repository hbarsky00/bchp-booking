import { guard, json, sqlClient } from '../lib/db.mts'

/** The shop catalogue. Prices come back as numbers so the client never parses money. */
async function handler() {
  const sql = sqlClient()
  const rows = await sql`
    select id, name, description, image, price::float8 as price, stock, category
    from products
    order by id`
  return json(rows)
}

export default guard(handler)

export const config = { path: '/api/products' }
