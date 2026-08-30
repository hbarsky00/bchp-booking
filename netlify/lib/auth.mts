import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { query } from './tx.mts'
import { bad } from './db.mts'

const scrypt = promisify(scryptCb) as (
  password: string | Buffer, salt: string | Buffer, keylen: number, options: object,
) => Promise<Buffer>

/**
 * Admin authentication.
 *
 * What this replaces: a shared secret typed into a box on the Admin page and parked in
 * sessionStorage, where any injected script could read it and replay it. The session is
 * now an HttpOnly cookie that JavaScript cannot touch, signed so it cannot be forged, and
 * carrying an epoch so changing the password invalidates every cookie already issued.
 */

// scrypt at these parameters costs ~100ms per attempt, which is the point: it prices
// offline guessing out while staying invisible on a real sign-in.
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 }
const SESSION_TTL_SECONDS = 60 * 60 * 12
const MAX_ATTEMPTS = 8
const LOCKOUT_MINUTES = 15
export const SESSION_COOKIE = 'bitstay_admin'

export interface AdminRow {
  id: number
  email: string
  password_hash: string
  session_epoch: number
  failed_attempts: number
  locked_until: string | null
}

// ---------------------------------------------------------------- password hashing

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scrypt(password.normalize('NFKC'), salt, SCRYPT.keylen, SCRYPT)
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$')
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, saltB64, keyB64] = stored.split('$')
  if (scheme !== 'scrypt') return false
  const salt = Buffer.from(saltB64, 'base64')
  const expected = Buffer.from(keyB64, 'base64')
  const actual = await scrypt(password.normalize('NFKC'), salt, expected.length, {
    N: Number(n), r: Number(r), p: Number(p),
  })
  // Length is compared first because timingSafeEqual throws on a mismatch.
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

// ---------------------------------------------------------------- session cookie

function secret(): string {
  const s = process.env.SESSION_SECRET
  // Fail closed. A default secret here would mean anyone who reads this file on GitHub
  // can mint themselves an admin cookie.
  if (!s || s.length < 32) {
    throw Object.assign(new Error('SESSION_SECRET is missing or shorter than 32 characters'), { configError: true })
  }
  return s
}

const b64url = (b: Buffer) => b.toString('base64url')

export function signSession(adminId: number, epoch: number): string {
  const payload = b64url(Buffer.from(JSON.stringify({
    sub: adminId, epoch, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })))
  const sig = b64url(createHmac('sha256', secret()).update(payload).digest())
  return `${payload}.${sig}`
}

function readSession(token: string): { sub: number; epoch: number; exp: number } | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = createHmac('sha256', secret()).update(payload).digest()
  let given: Buffer
  try { given = Buffer.from(sig, 'base64url') } catch { return null }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return claims.exp > Math.floor(Date.now() / 1000) ? claims : null
  } catch {
    return null
  }
}

export function sessionCookie(value: string, maxAge = SESSION_TTL_SECONDS): string {
  // Secure is skipped on localhost only; browsers reject Secure cookies over plain http.
  const secure = process.env.NETLIFY_DEV === 'true' ? '' : '; Secure'
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

export const clearCookie = () => sessionCookie('', 0)

function cookieValue(req: Request, name: string): string {
  const header = req.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return rest.join('=')
  }
  return ''
}

// ---------------------------------------------------------------- the admin record

/**
 * The one administrator, seeded from the environment on first use.
 *
 * ADMIN_PASSWORD_HASH holds a hash, never a password — so the credential is not readable
 * from the deploy configuration, and nothing recoverable is committed to the repository.
 */
export async function loadAdmin(): Promise<AdminRow | null> {
  const [existing] = await query<AdminRow>('select * from admin_users limit 1')
  if (existing) return existing

  const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase()
  const hash = process.env.ADMIN_PASSWORD_HASH ?? ''
  if (!email || !hash.startsWith('scrypt$')) return null

  const [created] = await query<AdminRow>(
    `insert into admin_users (email, password_hash) values ($1, $2)
     on conflict do nothing
     returning *`,
    [email, hash],
  )
  if (created) return created
  const [raced] = await query<AdminRow>('select * from admin_users limit 1')
  return raced ?? null
}

/** Verifies the session cookie against the live record. Returns null when not signed in. */
export async function currentAdmin(req: Request): Promise<AdminRow | null> {
  const token = cookieValue(req, SESSION_COOKIE)
  if (!token) return null
  const claims = readSession(token)
  if (!claims) return null

  const [admin] = await query<AdminRow>('select * from admin_users where id = $1', [claims.sub])
  // The epoch check is what makes "change my password" sign out other devices.
  if (!admin || admin.session_epoch !== claims.epoch) return null
  return admin
}

/** Route guard. Returns a 401 Response to return as-is, or null when authorised. */
export async function requireAdmin(req: Request): Promise<Response | null> {
  try {
    return (await currentAdmin(req)) ? null : bad('Sign in to continue', 401)
  } catch (err) {
    if ((err as { configError?: boolean }).configError) {
      return bad('Admin sign-in is not configured on this deploy', 503)
    }
    throw err
  }
}

// ---------------------------------------------------------------- throttling

export function lockedFor(admin: AdminRow): number {
  if (!admin.locked_until) return 0
  return Math.max(0, Math.ceil((Date.parse(admin.locked_until) - Date.now()) / 1000))
}

export async function recordFailure(admin: AdminRow): Promise<void> {
  const next = admin.failed_attempts + 1
  // Every placeholder is cast explicitly: Postgres cannot infer a type for a parameter
  // that is both assigned to a column and compared against another parameter.
  await query(
    `update admin_users
        set failed_attempts = $1::int,
            locked_until = case
              when $1::int >= $2::int then now() + make_interval(mins => $3::int)
              else locked_until
            end,
            updated_at = now()
      where id = $4::int`,
    [next, MAX_ATTEMPTS, LOCKOUT_MINUTES, admin.id],
  )
}

export async function recordSuccess(admin: AdminRow): Promise<void> {
  await query(
    `update admin_users
        set failed_attempts = 0, locked_until = null, last_login_at = now(), updated_at = now()
      where id = $1`,
    [admin.id],
  )
}

/**
 * Password rules. Deliberately short: length is what defends a password, and rules that
 * demand a symbol mostly produce "Password1!".
 */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return 'Use at least 12 characters'
  if (password.length > 200) return 'That is longer than 200 characters'
  if (!/[^\s]/.test(password)) return 'That is only whitespace'
  return null
}
