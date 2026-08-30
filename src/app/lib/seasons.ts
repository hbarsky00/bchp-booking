import { useCallback, useEffect, useState } from 'react'

export interface Season {
  id: number
  name: string
  startsOn: string
  endsOn: string
  multiplier: number
  priority: number
}

export type SeasonDraft = Omit<Season, 'id'> & { id?: number }

async function call<T>(init?: RequestInit, qs = ''): Promise<T> {
  const res = await fetch(`/api/seasons${qs}`, {
    ...init,
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error((data as any).error ?? `Request failed (${res.status})`), { status: res.status })
  return data as T
}

/** Seasons are admin data — the calendar gets its rates from /api/availability instead. */
export function useSeasons(enabled = true) {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled) return
    try {
      setSeasons(await call<Season[]>())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => { void refresh() }, [refresh])

  const save = useCallback(async (d: SeasonDraft) => {
    const { seasons: next } = await call<{ seasons: Season[] }>({
      method: d.id ? 'PATCH' : 'POST',
      body: JSON.stringify(d),
    })
    setSeasons(next)
  }, [])

  const remove = useCallback(async (id: number) => {
    const { seasons: next } = await call<{ seasons: Season[] }>({ method: 'DELETE' }, `?id=${id}`)
    setSeasons(next)
  }, [])

  return { seasons, loading, error, refresh, save, remove }
}

/** "+35%" / "−15%" reads faster than "1.35" when scanning a list of seasons. */
export const asPercent = (multiplier: number) => {
  const pct = Math.round((multiplier - 1) * 100)
  return pct === 0 ? 'base rate' : `${pct > 0 ? '+' : '−'}${Math.abs(pct)}%`
}
