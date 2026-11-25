import { useQuery } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { Expense } from '../types/models'

export const expensesQueryKey = ['expenses'] as const

/** Alle aktive utgifter, nyeste først. */
export function useExpenses() {
  return useQuery({
    queryKey: expensesQueryKey,
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await getSupabase()
        .from('expenses')
        .select('*')
        .is('deleted_at', null)
        .order('spent_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
  })
}
