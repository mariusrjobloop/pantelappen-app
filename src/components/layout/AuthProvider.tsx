import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { AuthContext, type AuthState, type SignInResult } from '../../lib/auth/AuthContext'
import { authText } from '../../lib/content/auth'
import { getSupabase, supabase } from '../../lib/supabase'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  // undefined = ikke sjekket ennå, null = ikke innlogget
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // Viktig: ikke kall andre Supabase-metoder inne i denne callbacken (kan låse seg).
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id ?? null

  const adminQuery = useQuery({
    queryKey: ['is_admin', userId],
    enabled: userId !== null,
    // Ikke husk svaret for alltid: blir brukeren lagt til i admins etter innlogging,
    // skal appen fange det opp når fanen får fokus igjen eller ved «Sjekk på nytt».
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await getSupabase().rpc('is_admin')
      if (error) throw new Error(error.message)
      return data === true
    },
  })

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (!error) return { ok: true }
    if (error.code === 'invalid_credentials') return { ok: false, error: authText.invalidCredentials }
    if (error.code === 'over_request_rate_limit') return { ok: false, error: authText.rateLimited }
    if (error.code === 'email_not_confirmed') return { ok: false, error: authText.emailNotConfirmed }
    return { ok: false, error: authText.genericError }
  }, [])

  const recheckAdmin = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['is_admin'] })
  }, [queryClient])

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut()
    // Hent data på nytt uten admin-rettigheter
    queryClient.removeQueries({ queryKey: ['is_admin'] })
    await queryClient.invalidateQueries()
  }, [queryClient])

  const value = useMemo<AuthState>(
    () => ({
      status: session === undefined ? 'loading' : session ? 'signedIn' : 'signedOut',
      user: session?.user ?? null,
      // Feiler sjekken (f.eks. mangler is_admin() i databasen), behandles brukeren som ikke-admin
      // i stedet for å vise «Sjekker …» for alltid. Feilen vises på Konto-siden.
      isAdmin: session ? (adminQuery.isError ? false : (adminQuery.data ?? null)) : false,
      adminCheckError: adminQuery.error?.message ?? null,
      isCheckingAdmin: adminQuery.isFetching,
      signIn,
      signOut,
      recheckAdmin,
    }),
    [session, adminQuery.data, adminQuery.isError, adminQuery.error, adminQuery.isFetching, signIn, signOut, recheckAdmin],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
