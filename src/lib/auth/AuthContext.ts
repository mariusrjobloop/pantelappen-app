import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export type SignInResult = { ok: true } | { ok: false; error: string }

export type AuthState = {
  /** 'loading' mens vi sjekker om det finnes en lagret innlogging. */
  status: 'loading' | 'signedOut' | 'signedIn'
  user: User | null
  /** true bare når brukeren står i admins-tabellen. null mens det sjekkes. */
  isAdmin: boolean | null
  /** Teknisk feilmelding hvis admin-sjekken mot databasen feilet. */
  adminCheckError: string | null
  isCheckingAdmin: boolean
  signIn: (email: string, password: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  /** Spør databasen på nytt om brukeren er admin. */
  recheckAdmin: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
