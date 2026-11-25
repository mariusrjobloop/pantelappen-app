import { Pencil, Trash2 } from 'lucide-react'
import { ledgerText } from '../../../lib/content/ledger'
import { formatDateShort, formatKroner, toIsoDate } from '../../../lib/format'
import type { Transaction } from '../../../lib/stats'

type LedgerTableProps = {
  rows: Transaction[]
  caption: string
  textColumn: string
  showActions: boolean
  /** Full beskrivelse av raden, brukt i knappenes tilgjengelige navn. */
  describe: (row: Transaction) => string
  onEdit: (row: Transaction) => void
  onDelete: (row: Transaction) => void
}

type RowActionsProps = Pick<LedgerTableProps, 'describe' | 'onEdit' | 'onDelete'> & {
  row: Transaction
  /** Fyll hele bredden (mobilkort) i stedet for å ligge til høyre (tabell). */
  fill?: boolean
}

const actionClass =
  'inline-flex min-h-tap items-center justify-center gap-1.5 rounded-full border-2 px-4 font-semibold transition-colors hover:bg-surface-muted'

function RowActions({ row, describe, onEdit, onDelete, fill = false }: RowActionsProps) {
  const width = fill ? 'flex-1' : ''
  return (
    <div className={`flex gap-2 ${fill ? '' : 'flex-wrap justify-end'}`}>
      <button type="button" onClick={() => onEdit(row)} className={`${actionClass} ${width} border-border`}>
        <Pencil aria-hidden="true" className="size-4" strokeWidth={2.5} />
        {ledgerText.edit}
        <span className="sr-only">: {describe(row)}</span>
      </button>
      <button type="button" onClick={() => onDelete(row)} className={`${actionClass} ${width} border-negative text-negative`}>
        <Trash2 aria-hidden="true" className="size-4" strokeWidth={2.5} />
        {ledgerText.delete}
        <span className="sr-only">: {describe(row)}</span>
      </button>
    </div>
  )
}

/**
 * Viser radene som kort på mobil og som tabell fra «sm» og opp.
 * Bare én av dem er synlig (display:none skjuler den andre også for skjermlesere).
 */
export function LedgerTable({ rows, caption, textColumn, showActions, describe, onEdit, onDelete }: LedgerTableProps) {
  const todayIso = toIsoDate(new Date())

  return (
    <>
      {/* Mobil: ett kort per rad */}
      <ul aria-label={caption} className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-3xl border-2 border-border/40 bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">
                  <time dateTime={row.date}>{formatDateShort(row.date, todayIso)}</time>
                </p>
                <p className="break-words text-ink-muted">{row.text ?? '–'}</p>
              </div>
              <p className="font-display text-2xl font-extrabold whitespace-nowrap">{formatKroner(row.amountOre)}</p>
            </div>
            {showActions && (
              <div className="mt-3">
                <RowActions row={row} describe={describe} onEdit={onEdit} onDelete={onDelete} fill />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Nettbrett og PC: tabell */}
      <div className="hidden overflow-x-auto rounded-tile border-2 border-border/40 bg-surface sm:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b-2 border-surface-muted text-ink-muted">
              <th scope="col" className="px-5 py-4 font-semibold">
                {ledgerText.columns.date}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold">
                {textColumn}
              </th>
              <th scope="col" className="px-5 py-4 text-right font-semibold">
                {ledgerText.columns.amount}
              </th>
              {showActions && (
                <th scope="col" className="px-5 py-4 text-right font-semibold">
                  <span className="sr-only">{ledgerText.columns.actions}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b-2 border-surface-muted last:border-b-0">
                <td className="px-5 py-3 whitespace-nowrap tabular-nums">
                  <time dateTime={row.date}>{formatDateShort(row.date, todayIso)}</time>
                </td>
                <td className="px-5 py-3">{row.text ?? <span className="text-ink-muted">–</span>}</td>
                <td className="px-5 py-3 text-right text-lg font-bold whitespace-nowrap tabular-nums">
                  {formatKroner(row.amountOre)}
                </td>
                {showActions && (
                  <td className="px-5 py-2">
                    <RowActions row={row} describe={describe} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
