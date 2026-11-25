import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, CircleCheck } from 'lucide-react'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { useCreateExpense } from '../../../hooks/useCreateEntry'
import { useUpdateExpense } from '../../../hooks/useUpdateEntry'
import { fieldText, registerText } from '../../../lib/content/forms'
import { oreToInput, toIsoDate } from '../../../lib/format'
import {
  validateExpenseForm,
  type ExpenseField,
  type ExpenseFormValues,
  type FieldErrors,
} from '../../../lib/validation'
import type { Expense } from '../../../types/models'

const FIELD_ORDER: ExpenseField[] = ['amount', 'description', 'date']

type ExpenseFormProps = {
  /** Satt = endre denne raden. Ikke satt = registrere ny. */
  entry?: Expense
  /** Kalles etter at en endring er lagret. */
  onSaved?: () => void
}

export function ExpenseForm({ entry, onSaved }: ExpenseFormProps) {
  const todayIso = toIsoDate(new Date())
  const idPrefix = entry ? 'edit-expense' : 'expense'
  const [values, setValues] = useState<ExpenseFormValues>(
    entry
      ? { amount: oreToInput(entry.amount_ore), date: entry.spent_date, description: entry.description }
      : { amount: '', date: todayIso, description: '' },
  )
  const [errors, setErrors] = useState<FieldErrors<ExpenseField>>({})
  const [savedMessage, setSavedMessage] = useState('')
  const refs = useRef<Partial<Record<ExpenseField, HTMLInputElement | null>>>({})
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const mutation = entry ? updateExpense : createExpense

  const update = (field: ExpenseField) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setSavedMessage('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validateExpenseForm(values, todayIso)

    if (!result.ok) {
      setErrors(result.errors)
      const first = FIELD_ORDER.find((f) => result.errors[f])
      if (first) refs.current[first]?.focus()
      return
    }

    setErrors({})

    if (entry) {
      updateExpense.mutate({ id: entry.id, changes: result.data }, { onSuccess: () => onSaved?.() })
      return
    }

    createExpense.mutate(result.data, {
      onSuccess: (row) => {
        setSavedMessage(registerText.savedExpense(row.amount_ore, row.description))
        setValues((v) => ({ ...v, amount: '', description: '' }))
        refs.current.amount?.focus()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-6">
      <TextField
        ref={(el) => {
          refs.current.amount = el
        }}
        id={`${idPrefix}-amount`}
        label={fieldText.amount.label}
        suffix={fieldText.amount.suffix}
        error={errors.amount}
        value={values.amount}
        onChange={update('amount')}
        inputMode="decimal"
        autoComplete="off"
        className="text-2xl font-semibold tabular-nums"
      />

      <TextField
        ref={(el) => {
          refs.current.description = el
        }}
        id={`${idPrefix}-description`}
        label={fieldText.description.label}
        hint={fieldText.description.hint}
        error={errors.description}
        value={values.description}
        onChange={update('description')}
        autoComplete="off"
      />

      <TextField
        ref={(el) => {
          refs.current.date = el
        }}
        id={`${idPrefix}-date`}
        type="date"
        label={fieldText.spentDate.label}
        error={errors.date}
        value={values.date}
        max={todayIso}
        onChange={update('date')}
      />

      {mutation.isError && (
        <Alert title={registerText.errorTitle}>
          <p>{mutation.error.message}</p>
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" icon={Check} disabled={mutation.isPending}>
          {mutation.isPending ? registerText.saving : entry ? registerText.saveChanges : registerText.saveExpense}
        </Button>
        <p role="status" className="flex items-center gap-2 font-semibold text-positive">
          {savedMessage && (
            <>
              <CircleCheck aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
              {savedMessage}
            </>
          )}
        </p>
      </div>
    </form>
  )
}
