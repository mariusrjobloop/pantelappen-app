import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tallene endres sjelden; hent på nytt etter 30 s eller når fanen får fokus igjen.
      staleTime: 30_000,
      // Ett nytt forsøk holder. Er Supabase satt på pause, hjelper ikke flere.
      retry: 1,
    },
  },
})
