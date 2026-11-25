import { formatDecimal } from '../format'

export const dashboardText = {
  balance: {
    eyebrow: 'Klassekassa',
    heading: 'Saldo',
    pantIn: 'Pant inn',
    spent: 'Brukt',
    negative: 'Saldoen er negativ: det er brukt mer enn som er pantet.',
    actionsLabel: 'Snarveier',
    actions: {
      pant: 'Pant',
      expense: 'Utgift',
      history: 'Historikk',
      expenses: 'Utgifter',
    },
  },

  lastPant: {
    heading: 'Sist pantet',
    empty: 'Ingen pant registrert ennå.',
    reminder: 'Det er lenge siden sist. Kanskje på tide å pante?',
    daysSince: (days: number): string => {
      if (days <= 0) return 'I dag'
      if (days === 1) return 'I går'
      return `${days} dager siden`
    },
  },

  totals: {
    heading: 'Totalt pantet',
    bags: (bags: number) => `≈ ${formatDecimal(bags)} søppelsekker`,
    bagsHint: 'regnet med ca. 300 kr per sekk',
    count: (n: number) => (n === 1 ? 'fra 1 pantelapp' : `fra ${n} pantelapper`),
  },

  transactions: {
    heading: 'Siste bevegelser',
    empty: 'Ingen bevegelser ennå. Når pant eller utgifter registreres, dukker de opp her.',
    caption: 'De siste registrerte pantelappene og utgiftene, nyeste først',
    columns: { date: 'Dato', text: 'Beskrivelse', amount: 'Beløp' },
    pantLabel: 'Pant',
    expenseLabel: 'Utgift',
    seeAll: 'Se all historikk',
  },
} as const
