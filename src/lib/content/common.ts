export const appContent = {
  name: 'Pantebanken',
  /** Ordmerket i toppen skrives med små bokstaver, som en logo. */
  wordmark: 'pantebanken',
  tagline: 'Klassens pantepenger',
  skipLink: 'Hopp til hovedinnhold',
  mainNavLabel: 'Hovedmeny',
  footer: 'Pantepenger brukes til sosiale aktiviteter og nødvendige innkjøp.',
} as const

/** Felles tekst for lasting/feil når data hentes fra databasen. */
export const dataStatusText = {
  loading: 'Henter tall …',
  error: {
    title: 'Klarte ikke å hente tallene',
    body: 'Sjekk nettforbindelsen. Hvis det ikke hjelper, kan databasen være satt på pause etter en periode uten bruk.',
    detailsLabel: 'Teknisk feilmelding',
    retry: 'Prøv igjen',
  },
  notConfigured: {
    title: 'Databasen er ikke koblet til',
    body: 'Kopier .env.example til .env, fyll inn Supabase-adressen og nøkkelen, og start utviklingsserveren på nytt.',
  },
} as const

type NavItem = {
  to: string
  label: string
  /** 'admin' = vises bare for admin. 'all' = alltid. */
  visibleFor: 'all' | 'admin'
}

export const navItems: readonly NavItem[] = [
  { to: '/', label: 'Oversikt', visibleFor: 'all' },
  { to: '/historikk', label: 'Historikk', visibleFor: 'all' },
  { to: '/utgifter', label: 'Utgifter', visibleFor: 'all' },
  { to: '/registrer', label: 'Registrer', visibleFor: 'admin' },
]

/** Siste menypunkt: endrer tekst etter om man er logget inn. */
export const accountNav = {
  to: '/logg-inn',
  signedOutLabel: 'Logg inn',
  signedInLabel: 'Konto',
} as const
