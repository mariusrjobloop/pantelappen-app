import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabase } from '../lib/supabase'
import { registerText } from '../lib/content/forms'
import { expensesQueryKey } from './useExpenses'
import { pantEntriesQueryKey } from './usePantEntries'
import type { ExpenseInsert, PantEntryInsert } from '../types/models'

/** Gjør en databasefeil om til en melding et menneske forstår. */
export function toUserMessage(error: { code?: string }): string {
  // 42501 = insufficient_privilege: RLS sa nei (brukeren er ikke i admins)
  if (error.code === '42501') return registerText.noPermission
  return registerText.genericError
}

export function useCreatePant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (entry: PantEntryInsert) => {
      const { data, error } = await getSupabase().from('pant_entries').insert(entry).select().single()
      if (error) throw new Error(toUserMessage(error))
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pantEntriesQueryKey }),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (expense: ExpenseInsert) => {
      const { data, error } = await getSupabase().from('expenses').insert(expense).select().single()
      if (error) throw new Error(toUserMessage(error))
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: expensesQueryKey }),
  })
}
