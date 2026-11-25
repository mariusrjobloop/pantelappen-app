import { formatKroner } from '../format'
import type { WeekStatus } from '../weekly'

export const weeklyText = {
  heading: 'Pant per uke',
  subheading: (weeks: number) => `De siste ${weeks} ukene. Snittet regnes av hele uker.`,
  empty: (weeks: number) => `Ingen pant registrert de siste ${weeks} ukene.`,
  summary: (good: number, complete: number, averageOre: number) =>
    `${good} av ${complete} hele uker var på eller over snittet på ${formatKroner(averageOre)} per uke.`,

  legendGood: 'På eller over snittet (bra uke)',
  legendBelow: 'Under snittet',
  averageLabel: (ore: number) => `Snitt ${formatKroner(ore)}`,
  axisWeek: 'Uke',

  chartLabel: 'Stolpediagram over pant per uke. Bruk piltastene for å gå mellom ukene.',
  weekShort: (n: number) => `Uke ${n}`,
  status: {
    good: 'Bra uke',
    below: 'Under snittet',
    current: 'Pågår',
  } satisfies Record<WeekStatus, string>,
  currentWeekSuffix: '(denne uka)',
  describeWeek: (week: number, range: string, ore: number, status: string) =>
    `Uke ${week}, ${range}: ${formatKroner(ore)}. ${status}.`,

  tableToggle: 'Vis tallene som tabell',
  tableCaption: 'Pant per uke, eldste først',
  columns: { week: 'Uke', period: 'Periode', amount: 'Pant', status: 'Vurdering' },
} as const
