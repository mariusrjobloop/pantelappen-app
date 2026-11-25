import type { Tables, TablesInsert, TablesUpdate } from './database'

/** Én registrert pantelapp. Beløp i øre (15000 = 150 kr). */
export type PantEntry = Tables<'pant_entries'>
export type PantEntryInsert = TablesInsert<'pant_entries'>
export type PantEntryUpdate = TablesUpdate<'pant_entries'>

/** Én utgift betalt med pantepenger. Beløp i øre. */
export type Expense = Tables<'expenses'>
export type ExpenseInsert = TablesInsert<'expenses'>
export type ExpenseUpdate = TablesUpdate<'expenses'>
