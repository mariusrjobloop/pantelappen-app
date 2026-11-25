import { describe, expect, it } from 'vitest'
import {
  computeSummary,
  filterByMonth,
  listMonths,
  pantToTransaction,
  recentTransactions,
  sumOre,
} from './stats'
import type { Expense, PantEntry } from '../types/models'

const base = { updated_at: '', deleted_at: null }

function pant(id: string, amount_ore: number, pant_date: string, created_at = `${pant_date}T12:00:00Z`): PantEntry {
  return { ...base, id, amount_ore, pant_date, note: null, created_at }
}

function expense(id: string, amount_ore: number, spent_date: string, description = 'Pizza'): Expense {
  return { ...base, id, amount_ore, spent_date, description, created_at: `${spent_date}T12:00:00Z` }
}

const TODAY = '2026-11-24'

describe('sumOre', () => {
  it('summerer beløp og gir 0 for tom liste', () => {
    expect(sumOre([])).toBe(0)
    expect(sumOre([pant('a', 15000, TODAY), pant('b', 32050, TODAY)])).toBe(47050)
  })
})

describe('computeSummary', () => {
  it('håndterer tom database uten NaN', () => {
    expect(computeSummary([], [], TODAY)).toEqual({
      totalPantOre: 0,
      totalSpentOre: 0,
      balanceOre: 0,
      pantCount: 0,
      lastPantDate: null,
      daysSinceLastPant: null,
      estimatedBags: 0,
    })
  })

  it('regner saldo som pant minus utgifter', () => {
    const s = computeSummary(
      [pant('a', 300000, '2026-11-01'), pant('b', 14000, '2026-11-12')],
      [expense('x', 80000, '2026-11-08')],
      TODAY,
    )
    expect(s.totalPantOre).toBe(314000)
    expect(s.totalSpentOre).toBe(80000)
    expect(s.balanceOre).toBe(234000)
    expect(s.pantCount).toBe(2)
  })

  it('kan gi negativ saldo', () => {
    const s = computeSummary([pant('a', 10000, TODAY)], [expense('x', 25000, TODAY)], TODAY)
    expect(s.balanceOre).toBe(-15000)
  })

  it('finner siste pantedato uavhengig av rekkefølge', () => {
    const s = computeSummary(
      [pant('a', 100, '2026-11-12'), pant('b', 100, '2026-10-01'), pant('c', 100, '2026-11-03')],
      [],
      TODAY,
    )
    expect(s.lastPantDate).toBe('2026-11-12')
    expect(s.daysSinceLastPant).toBe(12)
  })

  it('gir 0 dager når det er pantet i dag', () => {
    expect(computeSummary([pant('a', 100, TODAY)], [], TODAY).daysSinceLastPant).toBe(0)
  })

  it('estimerer sekker med 300 kr per sekk', () => {
    expect(computeSummary([pant('a', 314000, TODAY)], [], TODAY).estimatedBags).toBeCloseTo(10.467, 3)
  })
})

describe('recentTransactions', () => {
  it('fletter pant og utgifter, nyeste dato først', () => {
    const list = recentTransactions(
      [pant('p1', 100, '2026-11-01'), pant('p2', 100, '2026-11-12')],
      [expense('e1', 100, '2026-11-08')],
      5,
    )
    expect(list.map((t) => [t.id, t.kind])).toEqual([
      ['p2', 'pant'],
      ['e1', 'expense'],
      ['p1', 'pant'],
    ])
  })

  it('sorterer samme dato etter når de ble registrert', () => {
    const list = recentTransactions(
      [pant('tidlig', 100, TODAY, '2026-11-24T08:00:00Z'), pant('sen', 100, TODAY, '2026-11-24T15:00:00Z')],
      [],
      5,
    )
    expect(list.map((t) => t.id)).toEqual(['sen', 'tidlig'])
  })

  it('begrenser antallet', () => {
    const many = Array.from({ length: 8 }, (_, i) => pant(`p${i}`, 100, `2026-11-0${i + 1}`))
    expect(recentTransactions(many, [], 5)).toHaveLength(5)
  })

  it('bruker beskrivelse for utgift og notat for pant', () => {
    const [t] = recentTransactions([], [expense('e', 100, TODAY, 'Pizzafredag')], 5)
    expect(t.text).toBe('Pizzafredag')
  })
})

describe('måneder', () => {
  const rows = [
    pant('a', 100, '2026-11-12'),
    pant('b', 100, '2026-11-01'),
    pant('c', 100, '2026-10-31'),
    pant('d', 100, '2025-12-15'),
  ].map(pantToTransaction)

  it('listMonths gir unike måneder, nyeste først', () => {
    expect(listMonths(rows)).toEqual(['2026-11', '2026-10', '2025-12'])
    expect(listMonths([])).toEqual([])
  })

  it('filterByMonth gir bare rader i måneden', () => {
    expect(filterByMonth(rows, '2026-11').map((r) => r.id)).toEqual(['a', 'b'])
    expect(filterByMonth(rows, '2026-10').map((r) => r.id)).toEqual(['c'])
    expect(filterByMonth(rows, '2026-09')).toEqual([])
  })

  it('filterByMonth med null gir alle rader', () => {
    expect(filterByMonth(rows, null)).toHaveLength(4)
  })
})
