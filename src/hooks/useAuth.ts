import { use } from 'react'
import { AuthContext, type AuthState } from '../lib/auth/AuthContext'

export function useAuth(): AuthState {
  const auth = use(AuthContext)
  if (!auth) throw new Error('useAuth må brukes inne i <AuthProvider>.')
  return auth
}
