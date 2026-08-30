/**
 * Nightly pricing.
 *
 * A stay is priced night by night, not `rate × nights`. Once seasons exist, a booking that
 * crosses from December into January costs two different rates, and any single-rate model
 * quietly charges the wrong amount for it.
 *
 * Stays are half-open `[checkIn, checkOut)`: the night of check-out is not paid for, which
 * is also why one guest may arrive the day another leaves.
 */

export interface Season {
  name: string
  /** A `date` column arrives as a Date from node-postgres and a string from JSON. */
  starts_on: string | Date
  ends_on: string | Date
  multiplier: string | number
  priority: number
}
export interface Night { date: string; rate: number; season: string | null }

const DAY = 86_400_000
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10)
const at = (d: string) => Date.parse(d.slice(0, 10) + 'T00:00:00Z')

/** Every date from `from` (inclusive) to `to` (exclusive). */
export function eachNight(from: string, to: string): string[] {
  const out: string[] = []
  for (let t = at(from); t < at(to); t += DAY) out.push(iso(t))
  return out
}

export const nightsBetween = (from: string, to: string) =>
  Math.max(0, Math.round((at(to) - at(from)) / DAY))

/**
 * The season covering a date, or null for the base rate. Where ranges overlap the highest
 * priority wins, so a festive week can sit inside a broader high season.
 */
export const asDate = (v: string | Date): string =>
  typeof v === 'string' ? v.slice(0, 10) : v.toISOString().slice(0, 10)

export function seasonFor(date: string, seasons: Season[]): Season | null {
  let best: Season | null = null
  for (const s of seasons) {
    if (date < asDate(s.starts_on) || date > asDate(s.ends_on)) continue
    if (!best || s.priority > best.priority) best = s
  }
  return best
}

/** Rounds to whole cents. Floating point must never reach a stored total. */
const money = (n: number) => Math.round(n * 100) / 100

/** Per-night rates for a stay. */
export function priceNights(basePrice: number, checkIn: string, checkOut: string, seasons: Season[]): Night[] {
  return eachNight(checkIn, checkOut).map(date => {
    const s = seasonFor(date, seasons)
    return {
      date,
      rate: money(basePrice * (s ? Number(s.multiplier) : 1)),
      season: s?.name ?? null,
    }
  })
}

export interface Quote {
  nights: Night[]
  nightCount: number
  subtotal: number
  /** Average per night — what a "from $X" line should show, not the base rate. */
  averageRate: number
  /** One line per season in the stay, so the guest can see why the total is what it is. */
  breakdown: { season: string; nights: number; rate: number; subtotal: number }[]
}

export function quote(basePrice: number, checkIn: string, checkOut: string, seasons: Season[]): Quote {
  const nights = priceNights(basePrice, checkIn, checkOut, seasons)
  const subtotal = money(nights.reduce((n, x) => n + x.rate, 0))

  const groups = new Map<string, { season: string; nights: number; rate: number; subtotal: number }>()
  for (const n of nights) {
    const key = `${n.season ?? 'Standard'}@${n.rate}`
    const g = groups.get(key) ?? { season: n.season ?? 'Standard rate', nights: 0, rate: n.rate, subtotal: 0 }
    g.nights += 1
    g.subtotal = money(g.subtotal + n.rate)
    groups.set(key, g)
  }

  return {
    nights,
    nightCount: nights.length,
    subtotal,
    averageRate: nights.length ? money(subtotal / nights.length) : money(basePrice),
    breakdown: [...groups.values()],
  }
}

/* --------------------------------------------------------------------------
 * Self-check. `node --experimental-strip-types netlify/lib/pricing.mts`
 * ------------------------------------------------------------------------ */
if (process.argv[1]?.endsWith('pricing.mts')) {
  const assert = (label: string, cond: boolean) => {
    if (!cond) { console.error('FAIL:', label); process.exitCode = 1 } else console.log('ok  ', label)
  }

  const seasons: Season[] = [
    { name: 'Peak', starts_on: '2026-07-01', ends_on: '2026-08-31', multiplier: 2, priority: 10 },
    { name: 'Festive', starts_on: '2026-07-10', ends_on: '2026-07-12', multiplier: 3, priority: 20 },
  ]

  assert('half-open: 3 nights from the 1st to the 4th',
    eachNight('2026-06-01', '2026-06-04').length === 3)
  assert('check-out night is not charged',
    !eachNight('2026-06-01', '2026-06-04').includes('2026-06-04'))

  const base = quote(100, '2026-06-01', '2026-06-04', seasons)
  assert('outside every season, the base rate applies', base.subtotal === 300)

  const peak = quote(100, '2026-07-01', '2026-07-04', seasons)
  assert('inside a season, the multiplier applies', peak.subtotal === 600)

  const overlap = quote(100, '2026-07-10', '2026-07-13', seasons)
  assert('higher priority wins where seasons overlap', overlap.subtotal === 900)

  // The case a flat rate gets wrong: a stay that straddles a season boundary.
  const straddle = quote(100, '2026-06-29', '2026-07-03', seasons)
  assert('straddling stays mix rates (2 base + 2 peak = 600)', straddle.subtotal === 600)
  assert('straddling stays report both seasons', straddle.breakdown.length === 2)
  assert('average is not the base rate', straddle.averageRate === 150)

  assert('cents do not drift', quote(45.55, '2026-06-01', '2026-06-04', []).subtotal === 136.65)

  // The shape the database actually returns, which is not the shape JSON returns.
  const asDates: Season[] = [{
    name: 'Peak', starts_on: new Date('2026-07-01T00:00:00Z'),
    ends_on: new Date('2026-08-31T00:00:00Z'), multiplier: 2, priority: 10,
  }]
  assert('Date objects from Postgres price the same as ISO strings',
    quote(100, '2026-07-01', '2026-07-04', asDates).subtotal === 600)
  assert('an empty stay costs nothing', quote(100, '2026-06-01', '2026-06-01', seasons).subtotal === 0)

  console.log(process.exitCode ? '\nself-check FAILED' : '\nself-check passed')
}
