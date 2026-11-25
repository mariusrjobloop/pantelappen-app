import { formatKroner } from '../format'

/** Tekst som er felles for Historikk (pant) og Utgifter. */
export const ledgerText = {
  monthFilter: 'Vis måned',
  allMonths: 'Alle måneder',
  columns: { date: 'Dato', amount: 'Beløp', actions: 'Handlinger' },
  edit: 'Rediger',
  delete: 'Slett',
  close: 'Lukk',
  cancel: 'Avbryt',
  confirmDelete: 'Ja, slett',
  deleting: 'Sletter …',
  undo: 'Angre',
  restoring: 'Gjenoppretter …',
  saved: 'Endringen er lagret.',
  restored: 'Registreringen er gjenopprettet.',
  deleteBody:
    'Registreringen forsvinner fra oversikten og historikken. Den slettes ikke for godt, og kan gjenopprettes med «Angre».',
  errorTitle: 'Noe gikk galt',
} as const

export const pantLedgerText = {
  title: 'Historikk',
  intro: 'Alle registrerte pantelapper, nyeste først.',
  empty: 'Ingen pant registrert ennå.',
  emptyMonth: 'Ingen pant registrert denne måneden.',
  caption: 'Registrerte pantelapper',
  rowLabel: 'Pant',
  textColumn: 'Notat',
  sum: (ore: number, count: number) =>
    `Sum: ${formatKroner(ore)} fra ${count === 1 ? '1 pantelapp' : `${count} pantelapper`}`,
  editTitle: 'Rediger pant',
  deleteTitle: 'Slette pant?',
  deleted: (desc: string) => `Slettet: ${desc}.`,
} as const

export const expenseLedgerText = {
  title: 'Utgifter',
  intro: 'Hva pantepengene er brukt på, nyeste først.',
  empty: 'Ingen utgifter registrert ennå.',
  emptyMonth: 'Ingen utgifter registrert denne måneden.',
  caption: 'Registrerte utgifter',
  rowLabel: 'Utgift',
  textColumn: 'Beskrivelse',
  sum: (ore: number, count: number) =>
    `Sum: ${formatKroner(ore)} fordelt på ${count === 1 ? '1 utgift' : `${count} utgifter`}`,
  editTitle: 'Rediger utgift',
  deleteTitle: 'Slette utgift?',
  deleted: (desc: string) => `Slettet: ${desc}.`,
} as const

export type LedgerKindText = typeof pantLedgerText | typeof expenseLedgerText
