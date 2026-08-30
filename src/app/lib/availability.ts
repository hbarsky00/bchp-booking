import { useCallback, useEffect, useState } from 'react'

export interface AvailabilityDay {
  date: string
  past: boolean
  booked: boolean
  rate: number
  season: string | null
}

export interface QuoteLine { season: string; nights: number; rate: number; subtotal: number }

export interface Quote {
  ok: true
  nightCount: number
  subtotal: number
  averageRate: number
  breakdown: QuoteLine[]
  nights: { date: string; rate: number; season: string | null }[]
}

export type Selection = Quote | { ok: false; reason: string } | null

export interface Availability {
  unitId: number
  unitName: string
  basePrice: number
  minNights: number
  from: string
  to: string
  days: AvailabilityDay[]
  selection: Selection
}

/**
 * Availability and per-night prices for one unit.
 *
 * The quote comes back from the same endpoint as the calendar because the server is the
 * only thing entitled to price a stay — the client showing one figure while the booking
 * writes another is exactly the bug this app already had once.
 */
export function useAvailability(unitId?: number, checkIn?: string, checkOut?: string) {
  const [data, setData] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!unitId) { setLoading(false); return }
    const params = new URLSearchParams({ unitId: String(unitId) })
    if (checkIn && checkOut && checkOut > checkIn) {
      params.set('checkIn', checkIn); params.set('checkOut', checkOut)
    }
    try {
      const res = await fetch(`/api/availability?${params}`)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((body as any).error ?? `Request failed (${res.status})`)
      setData(body as Availability)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [unitId, checkIn, checkOut])

  useEffect(() => { void load() }, [load])

  return { availability: data, loading, error, refresh: load }
}

/** Formats a season breakdown line the way the sidebar shows it. */
export const lineLabel = (l: QuoteLine) =>
  `$${l.rate.toFixed(2)} × ${l.nights} night${l.nights === 1 ? '' : 's'}`
