import { parseKronerToOre } from './format'
import { validationText as t } from './content/forms'
import type { ExpenseInsert, PantEntryInsert } from '../types/models'

/** Samme grenser som i supabase/schema.sql, så brukeren får feilen før databasen sier nei. */
export const MAX_AMOUNT_ORE = 10_000_000 // 100 000 kr
export const MAX_NOTE_LENGTH = 500
export const MAX_DESCRIPTION_LENGTH = 200
/** Fanger skrivefeil som «0202» i stedet for «2026». */
export const MIN_DATE = '2020-01-01'

export type FieldErrors<K extends string> = Partial<Record<K, string>>

export type ValidationResult<K extends string, T> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors<K> }

export function validateAmount(input: string): { ore: number } | { error: string } {
  if (input.trim() === '') return { error: t.amountRequired }
  const ore = parseKronerToOre(input)
  if (ore === null) return { error: t.amountInvalid }
  if (ore <= 0) return { error: t.amountZero }
  if (ore > MAX_AMOUNT_ORE) return { error: t.amountTooLarge(MAX_AMOUNT_ORE) }
  return { ore }
}

export function validateDate(input: string, todayIso: string): string | null {
  if (input === '') return t.dateRequired
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input) || Number.isNaN(Date.parse(input))) return t.dateInvalid
  if (input > todayIso) return t.dateInFuture
  if (input < MIN_DATE) return t.dateTooOld(MIN_DATE)
  return null
}

export type PantFormValues = { amount: string; date: string; note: string }
export type PantField = keyof PantFormValues

export function validatePantForm(
  values: PantFormValues,
  todayIso: string,
): ValidationResult<PantField, PantEntryInsert> {
  const errors: FieldErrors<PantField> = {}

  const amount = validateAmount(values.amount)
  if ('error' in amount) errors.amount = amount.error

  const dateError = validateDate(values.date, todayIso)
  if (dateError) errors.date = dateError

  const note = values.note.trim()
  if (note.length > MAX_NOTE_LENGTH) errors.note = t.noteTooLong(MAX_NOTE_LENGTH)

  if (Object.keys(errors).length > 0 || 'error' in amount) return { ok: false, errors }

  return {
    ok: true,
    data: { amount_ore: amount.ore, pant_date: values.date, note: note === '' ? null : note },
  }
}

export type ExpenseFormValues = { amount: string; date: string; description: string }
export type ExpenseField = keyof ExpenseFormValues

export function validateExpenseForm(
  values: ExpenseFormValues,
  todayIso: string,
): ValidationResult<ExpenseField, ExpenseInsert> {
  const errors: FieldErrors<ExpenseField> = {}

  const amount = validateAmount(values.amount)
  if ('error' in amount) errors.amount = amount.error

  const dateError = validateDate(values.date, todayIso)
  if (dateError) errors.date = dateError

  const description = values.description.trim()
  if (description === '') errors.description = t.descriptionRequired
  else if (description.length > MAX_DESCRIPTION_LENGTH)
    errors.description = t.descriptionTooLong(MAX_DESCRIPTION_LENGTH)

  if (Object.keys(errors).length > 0 || 'error' in amount) return { ok: false, errors }

  return {
    ok: true,
    data: { amount_ore: amount.ore, spent_date: values.date, description },
  }
}
