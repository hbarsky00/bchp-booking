import { useCallback, useEffect, useState } from 'react'

export interface Unit {
  id: number
  name: string
  description: string
  image: string
  floor: string
  beds: number
  maxGuests: number
  rating: number
  price: number
  amenities: string[]
  available: boolean
  /** Present only when the search carried dates: the real rate for those nights. */
  nightlyRate?: number
  stayTotal?: number
  nights?: number
  seasonal?: boolean
}

export interface Booking {
  id: number
  reference: string
  status: 'reserved' | 'paid' | 'checked_out' | 'cancelled'
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  guestName: string
  guestEmail?: string
  guestPhone?: string
  notes?: string
  paymentMethod?: string
  nightlyRate?: number
  total: number
  createdAt?: string
  unitId: number
  unitName: string
  unitImage: string
  unitFloor: string
  amenities?: string[]
}

const KEY = 'bitstay.guestKey'

/** Bookings are tied to this browser until there is real auth. Same idea as the cart. */
export function guestKey(): string {
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(KEY, id)
    return id
  } catch {
    return ((window as any).__bitstayGuest ??= crypto.randomUUID().replace(/-/g, ''))
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as any).error ?? `Request failed (${res.status})`)
  return data as T
}

/** ISO date (YYYY-MM-DD) rendered for people, without timezone drift. */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric', ...opts,
  })
}

export const nightsBetween = (a: string, b: string) =>
  !a || !b ? 0 : Math.max(0, Math.round((Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / 86_400_000))

export function useUnits(checkIn?: string, checkOut?: string, guests?: string | number) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (checkIn && checkOut) { params.set('checkIn', checkIn); params.set('checkOut', checkOut) }
    if (guests) params.set('guests', String(guests))
    setLoading(true)
    req<Unit[]>(`/api/units?${params}`)
      .then(u => { if (!cancelled) { setUnits(u); setError(null) } })
      .catch(e => { if (!cancelled) setError((e as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [checkIn, checkOut, guests])

  return { units, loading, error }
}

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      setBookings(await req<Booking[]>(`/api/bookings?guestKey=${guestKey()}`))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const cancel = useCallback(async (reference: string) => {
    await req<Booking>('/api/bookings', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reference, guestKey: guestKey(), status: 'cancelled' }),
    })
    await refresh()
  }, [refresh])

  return { bookings, loading, error, refresh, cancel }
}

export function useBooking(reference?: string) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(Boolean(reference))
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!reference) { setLoading(false); return }
    try {
      setError(null)
      setBooking(await req<Booking>(`/api/bookings?reference=${encodeURIComponent(reference)}`))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [reference])

  useEffect(() => { void refresh() }, [refresh])
  return { booking, loading, error, refresh }
}

export function createBooking(input: {
  unitId: number; checkIn: string; checkOut: string; guests: number
  guestName: string; guestEmail: string; guestPhone?: string; notes?: string
  paymentMethod?: string; status?: 'reserved' | 'paid'
}) {
  return req<Booking>('/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ guestKey: guestKey(), ...input }),
  })
}

/* ---------------------------------------------------------------- checkout draft --- */

export interface Draft {
  unitId: number
  unitName: string
  unitImage: string
  unitFloor: string
  /** The unit's base rate. Kept for display only — never multiply by nights with it. */
  price: number
  /**
   * The server's price for these exact dates, and the per-season lines behind it. Seasonal
   * rates mean `price × nights` is wrong for any stay that crosses a season boundary, so
   * the quote is carried through checkout rather than recomputed at each step.
   */
  stayTotal: number
  averageRate: number
  rateLines: { season: string; nights: number; rate: number; subtotal: number }[]
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  notes: string
}

const DRAFT = 'bitstay.draft'

/**
 * The in-progress booking. Kept in sessionStorage rather than router state because the
 * flow detours through the Shop between entering guest details and paying — router
 * state does not survive that, and losing a half-filled booking is unforgivable.
 */
export function saveDraft(d: Draft) {
  try { sessionStorage.setItem(DRAFT, JSON.stringify(d)) } catch { /* storage blocked */ }
}

export function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch { return null }
}

export function clearDraft() {
  try { sessionStorage.removeItem(DRAFT) } catch { /* storage blocked */ }
}
