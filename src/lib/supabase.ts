import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** false når .env mangler, slik at appen kan vise en forklaring i stedet for å krasje. */
export const isSupabaseConfigured = Boolean(url && publishableKey)

/**
 * Supabase-klienten. Bruker bare den offentlige «publishable»-nøkkelen.
 * Hva som kan leses og skrives, styres av Row Level Security i supabase/schema.sql.
 * Legg ALDRI secret/service_role-nøkkelen i frontend.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url!, publishableKey!)
  : null

/** Henter klienten, eller kaster en forståelig feil hvis .env ikke er satt opp. */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase er ikke satt opp. Kopier .env.example til .env og fyll inn VITE_SUPABASE_URL og VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }
  return supabase
}
