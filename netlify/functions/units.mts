import { bad, guard, json, sqlClient } from '../lib/db.mts'

const DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * The stay catalogue. With ?checkIn & ?checkOut every unit carries `available` for that
 * range, so Search Results can grey out what is genuinely taken rather than guessing.
 */
async function handler(req: Request) {
  const url = new URL(req.url)
  const checkIn = url.searchParams.get('checkIn') ?? ''
  const checkOut = url.searchParams.get('checkOut') ?? ''
  const guests = Number(url.searchParams.get('guests') ?? 0)

  const ranged = DATE.test(checkIn) && DATE.test(checkOut)
  if ((checkIn || checkOut) && !ranged) return bad('checkIn and checkOut must both be YYYY-MM-DD')
  if (ranged && checkOut <= checkIn) return bad('checkOut must be after checkIn')

  const sql = sqlClient()

  // A unit is unavailable when a live booking overlaps the requested half-open range.
  const rows = ranged
    ? await sql`
        select u.id, u.name, u.description, u.image, u.floor, u.beds,
               u.max_guests as "maxGuests", u.rating::float8 as rating,
               u.price::float8 as price, u.amenities,
               (u.active and not exists (
                  select 1 from bookings b
                  where b.unit_id = u.id
                    and b.status <> 'cancelled'
                    and b.check_in < ${checkOut}::date
                    and b.check_out > ${checkIn}::date
               )) as available
        from units u
        where (${guests})::int = 0 or u.max_guests >= ${guests}::int
        order by u.id`
    : await sql`
        select u.id, u.name, u.description, u.image, u.floor, u.beds,
               u.max_guests as "maxGuests", u.rating::float8 as rating,
               u.price::float8 as price, u.amenities,
               u.active as available
        from units u
        where (${guests})::int = 0 or u.max_guests >= ${guests}::int
        order by u.id`

  return json(rows)
}

export default guard(handler)

export const config = { path: '/api/units' }
