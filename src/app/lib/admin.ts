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
  units: { id: number; name: string; floor: string; active: boolean; liveBookings: number; minNights: number; price: number }[]
}

/**
 * Admin data fetching.
 *
 * There is no credential in this file. Authorisation rides on the HttpOnly session cookie
 * the browser sends by itself — this used to hold a shared admin token in sessionStorage
 * and attach it by hand, which meant any script on the page could read and reuse it.
 */
async function adminFetch<T>(init?: RequestInit): Promise<T> {
  const res = await fetch('/api/admin', { ...init, credentials: 'same-origin' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw Object.assign(new Error((data as any).error ?? `Request failed (${res.status})`), { status: res.status })
  }
  return data as T
}

export function useAdmin() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  /** True once the server has told us this session is not signed in. */
  const [signedOut, setSignedOut] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setData(await adminFetch<AdminData>())
      setError(null)
      setSignedOut(false)
    } catch (e) {
      const err = e as Error & { status?: number }
      if (err.status === 401) setSignedOut(true)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const setStatus = useCallback(async (reference: string, status: string) => {
    await adminFetch({
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reference, status }),
    })
    await refresh()
  }, [refresh])

  const setMinNights = useCallback(async (unitId: number, minNights: number) => {
    await adminFetch({
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ unitId, minNights }),
    })
    await refresh()
  }, [refresh])

  return { data, loading, error, signedOut, refresh, setStatus, setMinNights }
}
