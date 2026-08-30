import { useCallback, useEffect, useState } from 'react'

/**
 * Admin session, client side.
 *
 * There is deliberately nothing to store here. The session is an HttpOnly cookie the
 * browser attaches on its own, so this module never sees a credential and no script can
 * read one. The previous version kept a shared admin token in sessionStorage — readable
 * by anything running on the page.
 */

export interface Session { signedIn: boolean; email?: string }

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    // Without this the cookie is not sent, and every admin call comes back 401.
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error((data as any).error ?? `Request failed (${res.status})`), { status: res.status })
  return data as T
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setSession(await call<Session>('/api/auth/me'))
    } catch {
      setSession({ signedIn: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const signIn = useCallback(async (email: string, password: string) => {
    const s = await call<Session>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setSession(s)
    return s
  }, [])

  const signOut = useCallback(async () => {
    await call('/api/auth/logout', { method: 'POST' })
    setSession({ signedIn: false })
  }, [])

  return { session, loading, refresh, signIn, signOut }
}

export const changePassword = (currentPassword: string, newPassword: string) =>
  call<{ ok: true }>('/api/auth/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

export const requestReset = (email: string) =>
  call<{ ok: true }>('/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) })

export const completeReset = (token: string, newPassword: string) =>
  call<{ ok: true }>('/api/auth/reset', { method: 'POST', body: JSON.stringify({ token, newPassword }) })

/** Mirrors the server rule, so the form can object before a round trip. */
export const passwordProblem = (p: string) =>
  p.length < 12 ? 'Use at least 12 characters' : null
