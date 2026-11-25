/**
 * Databasetyper for Supabase, skrevet for hånd etter supabase/schema.sql.
 * Formatet er det samme som `supabase gen types typescript` lager, så filen
 * kan erstattes av generert kode senere uten andre endringer.
 */

type Timestamps = {
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Database = {
  public: {
    Tables: {
      pant_entries: {
        Row: {
          id: string
          amount_ore: number
          pant_date: string
          note: string | null
        } & Timestamps
        Insert: {
          id?: string
          amount_ore: number
          pant_date?: string
          note?: string | null
        } & Partial<Timestamps>
        Update: {
          id?: string
          amount_ore?: number
          pant_date?: string
          note?: string | null
        } & Partial<Timestamps>
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          amount_ore: number
          spent_date: string
          description: string
        } & Timestamps
        Insert: {
          id?: string
          amount_ore: number
          spent_date?: string
          description: string
        } & Partial<Timestamps>
        Update: {
          id?: string
          amount_ore?: number
          spent_date?: string
          description?: string
        } & Partial<Timestamps>
        Relationships: []
      }
      admins: {
        Row: { user_id: string; created_at: string }
        Insert: { user_id: string; created_at?: string }
        Update: { user_id?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicTables = Database['public']['Tables']

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row']
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert']
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update']
