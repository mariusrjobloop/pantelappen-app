import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupabase } from '../lib/supabase'
import { toUserMessage } from './useCreateEntry'
import { expensesQueryKey } from './useExpenses'
import { pantEntriesQueryKey } from './usePantEntries'
import type { ExpenseUpdate, PantEntryUpdate } from '../types/models'

export type EntryKind = 'pant' | 'expense'

export function useUpdatePant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: PantEntryUpdate }) => {
      const { data, error } = await getSupabase()
        .from('pant_entries')
        .update(changes)
        .eq('id', id)
        .select()
        .single()
      if (error) throw new Error(toUserMessage(error))
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pantEntriesQueryKey }),
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: ExpenseUpdate }) => {
      const { data, error } = await getSupabase()
        .from('expenses')
        .update(changes)
        .eq('id', id)
        .select()
        .single()
      if (error) throw new Error(toUserMessage(error))
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: expensesQueryKey }),
  })
}

/**
 * Myk sletting: setter deleted_at i stedet for å fjerne raden.
 * Med deleted = false gjenopprettes raden («Angre»).
 */
export function useSetDeleted(kind: EntryKind) {
  const updatePant = useUpdatePant()
  const updateExpense = useUpdateExpense()
  const mutation = kind === 'pant' ? updatePant : updateExpense

  return {
    ...mutation,
    setDeleted: (id: string, deleted: boolean) =>
      mutation.mutateAsync({ id, changes: { deleted_at: deleted ? new Date().toISOString() : null } }),
  }
}
