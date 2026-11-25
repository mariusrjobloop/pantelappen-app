/**
 * Formatering og tolking av beløp og datoer på norsk (nb-NO).
 *
 * Beløp: lagres som heltall i øre (15000 = 150 kr).
 * Datoer: lagres som 'YYYY-MM-DD' uten klokkeslett. Vi regner alltid med
 * kalenderdager, aldri timer, slik at sommertid og sene kvelder ikke gir
 * feil dag.
 */

const LOCALE = 'nb-NO'

const wholeKroner = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'NOK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const kronerWithOre = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'NOK',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 15000 → «150 kr», 234050 → «2 340,50 kr». Viser øre bare når de finnes. */
export function formatKroner(ore: number): string {
  const formatter = ore % 100 === 0 ? wholeKroner : kronerWithOre
  return formatter.format(ore / 100)
}

const oneDecimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 })

/** 10.47 → «10,5» */
export function formatDecimal(value: number): string {
  return oneDecimal.format(value)
}

/**
 * Tolker et beløp skrevet av en person og returnerer øre, eller null hvis
 * det ikke er et gyldig beløp.
 * Godtar «150», «150,5», «150.50», «1 500», «150 kr». Avviser negative tall,
 * mer enn to desimaler og tusenskilletegn med punktum («1.500,00»), siden
 * det er tvetydig.
 */
export function parseKronerToOre(input: string): number | null {
  const cleaned = input
    .trim()
    .replace(/kr\.?$/i, '')
    .replace(/\s/g, '')
    .replace(',', '.')

  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)
  if (!match) return null

  const kroner = Number(match[1])
  const ore = Number((match[2] ?? '').padEnd(2, '0'))
  const total = kroner * 100 + ore

  return Number.isSafeInteger(total) ? total : null
}

/** Øre → tekst til et redigerbart beløpsfelt: 32000 → «320», 32050 → «320,50». Motsatt av parseKronerToOre. */
export function oreToInput(ore: number): string {
  const kroner = Math.trunc(ore / 100)
  const rest = ore % 100
  return rest === 0 ? String(kroner) : `${kroner},${String(rest).padStart(2, '0')}`
}

/** Dagens dato som 'YYYY-MM-DD' i lokal tid. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 'YYYY-MM-DD' → Date ved midnatt lokal tid (ikke UTC, som `new Date(iso)` gir). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Antall kalenderdager fra `fromIso` til `toIso`. Påvirkes ikke av sommertid. */
export function daysBetween(fromIso: string, toIso: string): number {
  const toUtc = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / MS_PER_DAY)
}

const longDate = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** «torsdag 12. november 2026» */
export function formatDateLong(iso: string): string {
  return longDate.format(parseIsoDate(iso))
}

const monthYear = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' })

/** '2026-11' → «november 2026» */
export function formatMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  return monthYear.format(new Date(y, m - 1, 1))
}

const shortDate = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' })

/** «16.–22. nov.», «30. nov.–6. des.», «29. des. 2025–4. jan. 2026» */
export function formatDateRange(startIso: string, endIso: string): string {
  return shortDate.formatRange(parseIsoDate(startIso), parseIsoDate(endIso))
}
const shortDateWithYear = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** «12. nov.», eller «12. nov. 2025» hvis datoen er fra et annet år enn i dag. */
export function formatDateShort(iso: string, todayIso: string): string {
  const sameYear = iso.slice(0, 4) === todayIso.slice(0, 4)
  return (sameYear ? shortDate : shortDateWithYear).format(parseIsoDate(iso))
}
