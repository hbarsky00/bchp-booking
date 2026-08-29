import { getDatabase } from '@netlify/database'

/** One parameterised statement, no transaction. Use $1, $2 … placeholders. */
export async function query<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  const { pool } = getDatabase()
  const res = await (pool as any).query(text, params)
  return res.rows as T[]
}

type Client = { query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>; release: () => void }

/**
 * Runs `fn` inside a transaction, rolling back on any throw.
 *
 * Booking needs this rather than the plain `sql` tag: availability is checked and then
 * written, and those two steps must not be separable. The caller takes a row lock on the
 * unit first, so concurrent bookings for the same unit queue up instead of racing.
 */
export async function transaction<T>(fn: (q: Client['query']) => Promise<T>): Promise<T> {
  const { pool } = getDatabase()
  const client = (await (pool as any).connect()) as Client
  try {
    await client.query('BEGIN')
    const result = await fn((text, params) => client.query(text, params))
    await client.query('COMMIT')
    return result
  } catch (err) {
    try { await client.query('ROLLBACK') } catch { /* the connection is already gone */ }
    throw err
  } finally {
    client.release()
  }
}
