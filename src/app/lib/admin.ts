import { useCallback, useEffect, useState } from 'react'
import type { Booking } from './bookings'

export interface AdminBooking extends Booking {
  guestEmail: string
  guestPhone: string
  paymentMethod: string
  createdAt: string
}

export interface AdminData {
  bookings: AdminBooking[]
  stats: { totalBookings: number; pending: number; paid: number; cancelled: number; revenue: number }
  units: { id: number; name: string; floor: string; active: boolean; liveBookings: number }[]
}

const TOKEN = 'bitstay.adminToken'

/**
 * The admin token is held in sessionStorage, not localStorage: it unlocks every guest's
 * contact details, so it should die with the tab rather than linger on the machine.
 */
export const getToken = () => { try { return sessionStorage.getItem(TOKEN) ?? '' } catch { return '' } }
export const setToken = (t: string) => { try { sessionStorage.setItem(TOKEN, t) } catch { /* blocked */ } }
export const clearToken = () => { try { sessionStorage.removeItem(TOKEN) } catch { /* blocked */ } }

async function adminFetch<T>(init?: RequestInit): Promise<T> {
  const res = await fetch('/api/admin', {
    ...init,
    headers: { ...(init?.headers ?? {}), 'x-admin-token': getToken() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error((data as any).error ?? `Request failed (${res.status})`), { status: res.status })
  return data as T
}

export function useAdmin() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsToken, setNeedsToken] = useState(!getToken())

  const refresh = useCallback(async () => {
    if (!getToken()) { setNeedsToken(true); setLoading(false); return }
    setLoading(true)
    try {
      setData(await adminFetch<AdminData>())
      setError(null)
      setNeedsToken(false)
    } catch (e) {
      const err = e as Error & { status?: number }
      if (err.status === 401) { clearToken(); setNeedsToken(true) }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const unlock = useCallback(async (token: string) => {
    setToken(token.trim())
    await refresh()
  }, [refresh])

  const setStatus = useCallback(async (reference: string, status: string) => {
    await adminFetch({
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reference, status }),
    })
    await refresh()
  }, [refresh])

  return { data, loading, error, needsToken, unlock, refresh, setStatus }
}
