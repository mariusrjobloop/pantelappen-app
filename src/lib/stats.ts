import { daysBetween } from './format'
import type { Expense, PantEntry } from '../types/models'

/** Erfaringstall: én full søppelsekk med flasker og bokser gir rundt 300 kr. */
export const BAG_VALUE_ORE = 30_000

/** Etter så mange dager uten panting viser oversikten en påminnelse. */
export const PANT_REMINDER_DAYS = 14

type HasAmount = { amount_ore: number }

export function sumOre(items: readonly HasAmount[]): number {
  return items.reduce((sum, item) => sum + item.amount_ore, 0)
}

export type DashboardSummary = {
  totalPantOre: number
  totalSpentOre: number
  balanceOre: number
  pantCount: number
  /** null når ingenting er pantet ennå */
  lastPantDate: string | null
  daysSinceLastPant: number | null
  estimatedBags: number
}

/**
 * Regner ut tallene på oversikten. Forventer bare aktive rader
 * (deleted_at er null). Det sørger hookene for.
 */
export function computeSummary(
  pant: readonly PantEntry[],
  expenses: readonly Expense[],
  todayIso: string,
): DashboardSummary {
  const totalPantOre = sumOre(pant)
  const totalSpentOre = sumOre(expenses)

  const lastPantDate = pant.reduce<string | null>(
    (latest, entry) => (latest === null || entry.pant_date > latest ? entry.pant_date : latest),
    null,
  )

  return {
    totalPantOre,
    totalSpentOre,
    balanceOre: totalPantOre - totalSpentOre,
    pantCount: pant.length,
    lastPantDate,
    daysSinceLastPant: lastPantDate === null ? null : daysBetween(lastPantDate, todayIso),
    estimatedBags: totalPantOre / BAG_VALUE_ORE,
  }
}

export type Transaction = {
  id: string
  kind: 'pant' | 'expense'
  date: string
  amountOre: number
  /** Notat for pant, beskrivelse for utgift. */
  text: string | null
  createdAt: string
}

export function pantToTransaction(p: PantEntry): Transaction {
  return {
    id: p.id,
    kind: 'pant',
    date: p.pant_date,
    amountOre: p.amount_ore,
    text: p.note,
    createdAt: p.created_at,
  }
}

export function expenseToTransaction(e: Expense): Transaction {
  return {
    id: e.id,
    kind: 'expense',
    date: e.spent_date,
    amountOre: e.amount_ore,
    text: e.description,
    createdAt: e.created_at,
  }
}

/** Nyeste dato først; samme dato sorteres etter når raden ble registrert. */
export function sortNewestFirst(rows: Transaction[]): Transaction[] {
  return [...rows].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
}

/** Pant og utgifter flettet sammen som en kontoutskrift, nyeste først. */
export function recentTransactions(
  pant: readonly PantEntry[],
  expenses: readonly Expense[],
  limit: number,
): Transaction[] {
  return sortNewestFirst([...pant.map(pantToTransaction), ...expenses.map(expenseToTransaction)]).slice(0, limit)
}

/** Unike måneder ('YYYY-MM') som finnes i radene, nyeste først. */
export function listMonths(rows: readonly { date: string }[]): string[] {
  return [...new Set(rows.map((r) => r.date.slice(0, 7)))].sort().reverse()
}

/** Rader i en gitt måned ('YYYY-MM'), eller alle hvis month er null. */
export function filterByMonth<T extends { date: string }>(rows: readonly T[], month: string | null): T[] {
  return month === null ? [...rows] : rows.filter((r) => r.date.startsWith(`${month}-`))
}
