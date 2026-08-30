import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { bad, guard, json } from '../lib/db.mts'
import { query } from '../lib/tx.mts'
import {
  clearCookie, currentAdmin, hashPassword, loadAdmin, lockedFor, passwordProblem,
  recordFailure, recordSuccess, sessionCookie, signSession, verifyPassword,
} from '../lib/auth.mts'

/**
 * Sign-in for the single administrator.
 *
 * Every failure answers with the same message and the same shape. Telling an attacker
 * "no account with that email" hands them a way to enumerate who exists, and telling them
 * "wrong password" confirms the address is right.
 */
const GENERIC = 'Email or password is incorrect'
const RESET_TTL_MINUTES = 30

const hashToken = (t: string) => createHash('sha256').update(t).digest('hex')

async function handler(req: Request) {
  const path = new URL(req.url).pathname.replace(/\/+$/, '')

  // ------------------------------------------------------------------ who am I
  if (path === '/api/auth/me' && req.method === 'GET') {
    const admin = await currentAdmin(req)
    return json(admin ? { signedIn: true, email: admin.email } : { signedIn: false })
  }

  // ------------------------------------------------------------------ sign in
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}))
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    if (!email || !password) return bad(GENERIC, 401)

    const admin = await loadAdmin()
    if (!admin) return bad('Admin sign-in is not configured on this deploy', 503)

    const wait = lockedFor(admin)
    if (wait > 0) {
      return bad(`Too many attempts. Try again in ${Math.ceil(wait / 60)} minute${wait > 60 ? 's' : ''}.`, 429)
    }

    // Both comparisons run whatever happens, so a wrong email and a wrong password take
    // the same time and neither can be told apart from the outside.
    const emailBuf = Buffer.from(email.padEnd(320).slice(0, 320))
    const knownBuf = Buffer.from(admin.email.padEnd(320).slice(0, 320))
    const emailOk = timingSafeEqual(emailBuf, knownBuf)
    const passwordOk = await verifyPassword(password, admin.password_hash)

    if (!emailOk || !passwordOk) {
      await recordFailure(admin)
      return bad(GENERIC, 401)
    }

    await recordSuccess(admin)
    return new Response(JSON.stringify({ signedIn: true, email: admin.email }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'set-cookie': sessionCookie(signSession(admin.id, admin.session_epoch)),
      },
    })
  }

  // ------------------------------------------------------------------ sign out
  if (path === '/api/auth/logout' && req.method === 'POST') {
    return new Response(JSON.stringify({ signedIn: false }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'set-cookie': clearCookie(),
      },
    })
  }

  // ------------------------------------------------------------------ change password
  if (path === '/api/auth/password' && req.method === 'POST') {
    const admin = await currentAdmin(req)
    if (!admin) return bad('Sign in to continue', 401)

    const body: any = await req.json().catch(() => ({}))
    const current = String(body.currentPassword ?? '')
    const next = String(body.newPassword ?? '')

    // Requiring the current password stops a borrowed session from locking the owner out.
    if (!(await verifyPassword(current, admin.password_hash))) {
      return bad('Your current password is not correct', 401)
    }
    const problem = passwordProblem(next)
    if (problem) return bad(problem)
    if (await verifyPassword(next, admin.password_hash)) return bad('That is already your password')

    await query(
      `update admin_users
          set password_hash = $1, session_epoch = session_epoch + 1, updated_at = now()
        where id = $2`,
      [await hashPassword(next), admin.id],
    )

    // The epoch just moved, so this device's cookie is stale too. Issue a fresh one rather
    // than signing the person out of the change they just made.
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'set-cookie': sessionCookie(signSession(admin.id, admin.session_epoch + 1)),
      },
    })
  }

  // ------------------------------------------------------------------ forgot password
  if (path === '/api/auth/forgot' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}))
    const email = String(body.email ?? '').trim().toLowerCase()
    const admin = await loadAdmin()

    // Always the same answer, whether or not that address is the administrator's.
    const sameAnswer = json({ ok: true })
    if (!admin || admin.email !== email) return sameAnswer

    const token = randomBytes(32).toString('base64url')
    await query(
      `insert into admin_password_resets (admin_id, token_hash, expires_at)
       values ($1::int, $2, now() + make_interval(mins => $3::int))`,
      [admin.id, hashToken(token), RESET_TTL_MINUTES],
    )

    const link = `${new URL(req.url).origin}/reset-password?token=${token}`
    const sent = await sendResetEmail(admin.email, link)
    if (!sent) {
      // No mail provider configured. The function log is readable only by whoever owns the
      // Netlify site — which, for a one-administrator app, is the person resetting.
      console.log(`[auth] password reset link (valid ${RESET_TTL_MINUTES}m): ${link}`)
    }
    return sameAnswer
  }

  // ------------------------------------------------------------------ complete reset
  if (path === '/api/auth/reset' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}))
    const token = String(body.token ?? '')
    const next = String(body.newPassword ?? '')
    if (!token) return bad('That reset link is not valid')

    const problem = passwordProblem(next)
    if (problem) return bad(problem)

    const [row] = await query<{ id: number; admin_id: number }>(
      `select id, admin_id from admin_password_resets
        where token_hash = $1 and used_at is null and expires_at > now()`,
      [hashToken(token)],
    )
    if (!row) return bad('That reset link has expired or has already been used', 410)

    await query('update admin_password_resets set used_at = now() where id = $1', [row.id])
    // Every other outstanding link dies with it — a reset should leave exactly one way in.
    await query(
      'update admin_password_resets set used_at = now() where admin_id = $1 and used_at is null',
      [row.admin_id],
    )
    await query(
      `update admin_users
          set password_hash = $1, session_epoch = session_epoch + 1,
              failed_attempts = 0, locked_until = null, updated_at = now()
        where id = $2`,
      [await hashPassword(next), row.admin_id],
    )
    return json({ ok: true })
  }

  return bad('Not found', 404)
}

/** Sends through Resend when a key is configured; says so honestly when it cannot. */
async function sendResetEmail(to: string, link: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESET_EMAIL_FROM
  if (!key || !from) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from, to,
        subject: 'Reset your BitStay admin password',
        text: `Use this link within ${RESET_TTL_MINUTES} minutes to set a new password:\n\n${link}\n\n`
            + 'If you did not ask for this, ignore it — your password has not changed.',
      }),
    })
    if (!res.ok) console.error('[auth] Resend rejected the reset email:', res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error('[auth] could not reach Resend:', (err as Error).message)
    return false
  }
}

export default guard(handler)

export const config = { path: '/api/auth/*' }
