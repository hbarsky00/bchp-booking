import { getDatabase } from '@netlify/database'

/**
 * The SQL client Netlify hands us.
 *
 * Deliberately not Drizzle: its node-postgres adapter failed every query against the
 * pool `getDatabase()` returns under `netlify dev`, while this same connection's `sql`
 * tag worked first time. One fewer adapter between us and Postgres.
 *
 * `sql` is a tagged template that parameterises interpolated values — always write
 * sql`... where id = ${id}`, never string concatenation.
 */
export function sqlClient() {
  return getDatabase().sql
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

export const bad = (message: string, status = 400) => json({ error: message }, status)

/** Usable JSON on failure instead of a raw stack, with the driver error in the logs. */
export function guard(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await handler(req)
    } catch (err) {
      const e = err as Error & { cause?: Error }
      console.error('[api]', req.method, new URL(req.url).pathname, '->', e.message, '| cause:', e.cause?.message ?? '(none)')
      return json({ error: 'Something went wrong reaching the database' }, 500)
    }
  }
}
