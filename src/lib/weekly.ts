/**
 * Ukestatistikk: summerer pant per ISO-uke (mandag–søndag) og vurderer hver
 * uke mot snittet. Alle datoer er 'YYYY-MM-DD', og vi regner i kalenderdager.
 */
import { parseIsoDate, toIsoDate } from './format'
import type { PantEntry } from '../types/models'

export const WEEKS_SHOWN = 12

export function addDays(iso: string, days: number): string {
  const d = parseIsoDate(iso)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

/** Mandagen i uka datoen tilhører. */
export function weekStart(iso: string): string {
  const day = parseIsoDate(iso).getDay() // 0 = søndag
  const sinceMonday = (day + 6) % 7
  return addDays(iso, -sinceMonday)
}

/** ISO-ukenummer (uke 1 er uka med årets første torsdag). */
export function isoWeekNumber(iso: string): number {
  const thursday = parseIsoDate(addDays(weekStart(iso), 3))
  const jan1 = new Date(thursday.getFullYear(), 0, 1)
  const dayOfYear = Math.round((thursday.getTime() - jan1.getTime()) / 86_400_000)
  return Math.floor(dayOfYear / 7) + 1
}

export type WeekStatus = 'good' | 'below' | 'current'

export type WeekBucket = {
  /** Mandag */
  start: string
  /** Søndag */
  end: string
  weekNumber: number
  totalOre: number
  count: number
  /** Uka vi er i nå. Den er ikke ferdig, så den teller ikke med i snittet. */
  isCurrent: boolean
}

/** Pant summert per uke for de siste `weeks` ukene, eldste først. Siste uke er inneværende uke. */
export function weeklyTotals(
  pant: readonly PantEntry[],
  todayIso: string,
  weeks: number = WEEKS_SHOWN,
): WeekBucket[] {
  const currentStart = weekStart(todayIso)
  const buckets: WeekBucket[] = Array.from({ length: weeks }, (_, i) => {
    const start = addDays(currentStart, -7 * (weeks - 1 - i))
    return {
      start,
      end: addDays(start, 6),
      weekNumber: isoWeekNumber(start),
      totalOre: 0,
      count: 0,
      isCurrent: start === currentStart,
    }
  })

  const byStart = new Map(buckets.map((b) => [b.start, b]))
  for (const entry of pant) {
    const bucket = byStart.get(weekStart(entry.pant_date))
    if (bucket) {
      bucket.totalOre += entry.amount_ore
      bucket.count += 1
    }
  }
  return buckets
}

export type WeeklyStats = {
  /** Snitt per hele uke (inneværende uke er ikke med). 0 hvis ingen hele uker. */
  averageOre: number
  completeWeeks: number
  goodWeeks: number
  hasAnyPant: boolean
}

export function weeklyStats(buckets: readonly WeekBucket[]): WeeklyStats {
  const complete = buckets.filter((b) => !b.isCurrent)
  const total = complete.reduce((sum, b) => sum + b.totalOre, 0)
  // Rundet til hele kroner: «257 kr» er lettere å lese enn «256,36 kr»
  const averageOre = complete.length > 0 ? Math.round(total / complete.length / 100) * 100 : 0
  return {
    averageOre,
    completeWeeks: complete.length,
    goodWeeks: complete.filter((b) => classifyWeek(b, averageOre) === 'good').length,
    hasAnyPant: buckets.some((b) => b.totalOre > 0),
  }
}

/**
 * «Bra uke» = minst like mye som snittet (og mer enn 0).
 * Inneværende uke får 'current' til den har nådd snittet, så den ikke
 * stemples som dårlig midt i uka.
 */
export function classifyWeek(bucket: WeekBucket, averageOre: number): WeekStatus {
  const good = bucket.totalOre > 0 && bucket.totalOre >= averageOre
  if (good) return 'good'
  return bucket.isCurrent ? 'current' : 'below'
}

/** Pene verdier for y-aksen: 0 og opptil `maxTicks` jevne steg (1, 2, 2,5 eller 5 × 10ⁿ kroner). */
export function niceTicksOre(maxOre: number, maxTicks = 4): number[] {
  if (maxOre <= 0) return [0]
  const rawStepKr = maxOre / 100 / maxTicks
  const magnitude = 10 ** Math.floor(Math.log10(rawStepKr))
  const stepKr = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStepKr)!
  const ticks: number[] = []
  for (let v = 0; v < maxOre + stepKr * 100; v += stepKr * 100) {
    ticks.push(Math.round(v))
    if (v >= maxOre) break
  }
  return ticks
}
