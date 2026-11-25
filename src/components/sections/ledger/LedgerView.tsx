import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Recycle, ShoppingBag, Trash2, Undo2 } from 'lucide-react'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Dialog } from '../../ui/Dialog'
import { EmptyState } from '../../ui/EmptyState'
import { Select } from '../../ui/Select'
import { PantForm } from '../register/PantForm'
import { ExpenseForm } from '../register/ExpenseForm'
import { LedgerTable } from './LedgerTable'
import { useAuth } from '../../../hooks/useAuth'
import { useSetDeleted } from '../../../hooks/useUpdateEntry'
import { expenseLedgerText, ledgerText, pantLedgerText } from '../../../lib/content/ledger'
import { formatDateLong, formatKroner, formatMonth } from '../../../lib/format'
import {
  expenseToTransaction,
  filterByMonth,
  listMonths,
  pantToTransaction,
  type Transaction,
} from '../../../lib/stats'
import type { Expense, PantEntry } from '../../../types/models'

type LedgerViewProps = { kind: 'pant'; entries: PantEntry[] } | { kind: 'expense'; entries: Expense[] }

type StatusMessage = { text: string; undoId?: string; isError?: boolean }

const ALL = ''

export function LedgerView(props: LedgerViewProps) {
  const { kind } = props
  const text = kind === 'pant' ? pantLedgerText : expenseLedgerText
  const { isAdmin } = useAuth()
  const softDelete = useSetDeleted(kind)

  const [month, setMonth] = useState<string>(ALL)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const undoRef = useRef<HTMLButtonElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const rows: Transaction[] =
    props.kind === 'pant' ? props.entries.map(pantToTransaction) : props.entries.map(expenseToTransaction)

  const months = listMonths(rows)
  // Behold valgt måned i listen selv om siste rad i den nettopp ble slettet
  if (month !== ALL && !months.includes(month)) months.unshift(month)
  const visible = filterByMonth(rows, month === ALL ? null : month)
  const visibleSumOre = visible.reduce((sum, row) => sum + row.amountOre, 0)

  // Flytt fokus etter sletting/angre, ellers havner det på <body> når raden forsvinner
  useEffect(() => {
    if (!status) return
    if (status.undoId) undoRef.current?.focus()
    else statusRef.current?.focus()
  }, [status])

  const describe = (row: Transaction) =>
    `${formatKroner(row.amountOre)}, ${text.rowLabel.toLowerCase()} ${formatDateLong(row.date)}` +
    (row.text ? ` («${row.text}»)` : '')

  const confirmDelete = async () => {
    if (!deleting) return
    const row = deleting
    try {
      await softDelete.setDeleted(row.id, true)
      setDeleting(null)
      setStatus({ text: text.deleted(describe(row)), undoId: row.id })
    } catch (e) {
      setDeleting(null)
      setStatus({ text: (e as Error).message, isError: true })
    }
  }

  const undo = async (id: string) => {
    try {
      await softDelete.setDeleted(id, false)
      setStatus({ text: ledgerText.restored })
    } catch (e) {
      setStatus({ text: (e as Error).message, isError: true })
    }
  }

  const editingPant = props.kind === 'pant' ? props.entries.find((e) => e.id === editingId) : undefined
  const editingExpense = props.kind === 'expense' ? props.entries.find((e) => e.id === editingId) : undefined
  const onSaved = () => {
    setEditingId(null)
    setStatus({ text: ledgerText.saved })
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.length > 0 && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-60">
            <Select
              id={`${kind}-month`}
              label={ledgerText.monthFilter}
              icon={CalendarDays}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value={ALL}>{ledgerText.allMonths}</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonth(m)}
                </option>
              ))}
            </Select>
          </div>
          {visible.length > 0 && (
            <p className="rounded-full bg-tile-yellow px-5 py-2 font-display text-xl font-bold">
              {text.sum(visibleSumOre, visible.length)}
            </p>
          )}
        </div>
      )}

      {/* Statusmeldinger etter endring/sletting. Alltid i DOM, så skjermlesere fanger opp endringer. */}
      <div role="status" ref={statusRef} tabIndex={-1} className="focus:outline-none">
        {status &&
          (status.isError ? (
            <Alert title={ledgerText.errorTitle}>
              <p>{status.text}</p>
            </Alert>
          ) : (
            <Alert tone="success" title={status.text}>
              {status.undoId && (
                <Button
                  ref={undoRef}
                  variant="secondary"
                  icon={Undo2}
                  disabled={softDelete.isPending}
                  onClick={() => void undo(status.undoId!)}
                >
                  {softDelete.isPending ? ledgerText.restoring : ledgerText.undo}
                </Button>
              )}
            </Alert>
          ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={kind === 'pant' ? Recycle : ShoppingBag}>
          {rows.length === 0 ? text.empty : text.emptyMonth}
        </EmptyState>
      ) : (
        <LedgerTable
          rows={visible}
          caption={month === ALL ? text.caption : `${text.caption}, ${formatMonth(month)}`}
          textColumn={text.textColumn}
          showActions={isAdmin === true}
          describe={describe}
          onEdit={(row) => {
            setStatus(null)
            setEditingId(row.id)
          }}
          onDelete={(row) => {
            setStatus(null)
            setDeleting(row)
          }}
        />
      )}

      {isAdmin === true && (
        <>
          <Dialog
            open={editingId !== null}
            onClose={() => setEditingId(null)}
            title={text.editTitle}
            closeLabel={ledgerText.close}
          >
            {editingPant && <PantForm entry={editingPant} onSaved={onSaved} />}
            {editingExpense && <ExpenseForm entry={editingExpense} onSaved={onSaved} />}
          </Dialog>

          <Dialog
            open={deleting !== null}
            onClose={() => setDeleting(null)}
            title={text.deleteTitle}
            closeLabel={ledgerText.close}
          >
            {deleting && (
              <div className="flex flex-col gap-6">
                <p className="rounded-2xl bg-surface-muted p-4 text-xl font-semibold">{describe(deleting)}</p>
                <p>{ledgerText.deleteBody}</p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="danger"
                    icon={Trash2}
                    disabled={softDelete.isPending}
                    onClick={() => void confirmDelete()}
                  >
                    {softDelete.isPending ? ledgerText.deleting : ledgerText.confirmDelete}
                  </Button>
                  <Button variant="secondary" onClick={() => setDeleting(null)}>
                    {ledgerText.cancel}
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </>
      )}
    </div>
  )
}
