import { useQuery } from '@tanstack/react-query'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { PantEntry } from '../types/models'

export const pantEntriesQueryKey = ['pant_entries'] as const

/** Alle aktive pantelapper, nyeste først. */
export function usePantEntries() {
  return useQuery({
    queryKey: pantEntriesQueryKey,
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<PantEntry[]> => {
      const { data, error } = await getSupabase()
        .from('pant_entries')
        .select('*')
        // Admin får også slettede rader fra databasen (for gjenoppretting), så filtrer alltid her.
        .is('deleted_at', null)
        .order('pant_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
  })
}
