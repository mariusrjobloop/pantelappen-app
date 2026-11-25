import { formatKroner } from '../format'

export const fieldText = {
  amount: {
    label: 'Beløp',
    hint: 'I kroner, slik det står på pantelappen. Du kan bruke komma, f.eks. 320,50.',
    suffix: 'kr',
  },
  pantDate: {
    label: 'Dato pantet',
  },
  spentDate: {
    label: 'Dato brukt',
  },
  note: {
    label: 'Notat (valgfritt)',
    hint: 'F.eks. «to sekker» eller «pantet på Kiwi».',
  },
  description: {
    label: 'Hva ble pengene brukt på?',
    hint: 'F.eks. «pizza fredag» eller «søppelsekker».',
  },
} as const

export const validationText = {
  amountRequired: 'Skriv inn et beløp.',
  amountInvalid: 'Beløpet må være et tall, f.eks. 320 eller 320,50.',
  amountZero: 'Beløpet må være større enn 0 kr.',
  amountTooLarge: (maxOre: number) => `Beløpet kan ikke være mer enn ${formatKroner(maxOre)}.`,
  dateRequired: 'Velg en dato.',
  dateInvalid: 'Datoen er ugyldig.',
  dateInFuture: 'Datoen kan ikke være frem i tid.',
  dateTooOld: (minIso: string) => `Datoen kan ikke være før ${minIso}.`,
  noteTooLong: (max: number) => `Notatet kan være maks ${max} tegn.`,
  descriptionRequired: 'Skriv hva pengene ble brukt på.',
  descriptionTooLong: (max: number) => `Beskrivelsen kan være maks ${max} tegn.`,
} as const

export const registerText = {
  eyebrow: 'Ny bevegelse',
  title: 'Registrer',
  intro: 'Legg inn en ny pantelapp eller en utgift. Oversikten oppdateres med en gang.',
  tabsLabel: 'Hva vil du registrere?',
  pantTab: 'Pant',
  expenseTab: 'Utgift',
  pantHeading: 'Ny pantelapp',
  expenseHeading: 'Ny utgift',
  savePant: 'Lagre pant',
  saveExpense: 'Lagre utgift',
  saveChanges: 'Lagre endringer',
  saving: 'Lagrer …',
  savedPant: (ore: number, date: string) => `Lagret: ${formatKroner(ore)} i pant (${date}).`,
  savedExpense: (ore: number, desc: string) => `Lagret: ${formatKroner(ore)} brukt på «${desc}».`,
  errorTitle: 'Klarte ikke å lagre',
  noPermission:
    'Brukeren din har ikke skrivetilgang. Legg den til i admins-tabellen i Supabase (se README).',
  genericError: 'Noe gikk galt. Sjekk nettforbindelsen og prøv igjen.',
  needLogin: 'Du må være logget inn som admin for å registrere.',
  needLoginLink: 'Gå til innlogging',
} as const
