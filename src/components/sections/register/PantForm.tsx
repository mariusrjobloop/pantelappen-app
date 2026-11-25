import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, CircleCheck } from 'lucide-react'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { useCreatePant } from '../../../hooks/useCreateEntry'
import { useUpdatePant } from '../../../hooks/useUpdateEntry'
import { fieldText, registerText } from '../../../lib/content/forms'
import { formatDateLong, oreToInput, toIsoDate } from '../../../lib/format'
import { validatePantForm, type FieldErrors, type PantField, type PantFormValues } from '../../../lib/validation'
import type { PantEntry } from '../../../types/models'

const FIELD_ORDER: PantField[] = ['amount', 'date', 'note']

type PantFormProps = {
  /** Satt = endre denne raden. Ikke satt = registrere ny. */
  entry?: PantEntry
  /** Kalles etter at en endring er lagret. */
  onSaved?: () => void
}

export function PantForm({ entry, onSaved }: PantFormProps) {
  const todayIso = toIsoDate(new Date())
  const idPrefix = entry ? 'edit-pant' : 'pant'
  const [values, setValues] = useState<PantFormValues>(
    entry
      ? { amount: oreToInput(entry.amount_ore), date: entry.pant_date, note: entry.note ?? '' }
      : { amount: '', date: todayIso, note: '' },
  )
  const [errors, setErrors] = useState<FieldErrors<PantField>>({})
  const [savedMessage, setSavedMessage] = useState('')
  const refs = useRef<Partial<Record<PantField, HTMLInputElement | null>>>({})
  const createPant = useCreatePant()
  const updatePant = useUpdatePant()
  const mutation = entry ? updatePant : createPant

  const update = (field: PantField) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setSavedMessage('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validatePantForm(values, todayIso)

    if (!result.ok) {
      setErrors(result.errors)
      const first = FIELD_ORDER.find((f) => result.errors[f])
      if (first) refs.current[first]?.focus()
      return
    }

    setErrors({})

    if (entry) {
      updatePant.mutate({ id: entry.id, changes: result.data }, { onSuccess: () => onSaved?.() })
      return
    }

    createPant.mutate(result.data, {
      onSuccess: (row) => {
        setSavedMessage(registerText.savedPant(row.amount_ore, formatDateLong(row.pant_date)))
        // Behold datoen, så det er raskt å registrere flere lapper fra samme dag
        setValues((v) => ({ ...v, amount: '', note: '' }))
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
        hint={fieldText.amount.hint}
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
          refs.current.date = el
        }}
        id={`${idPrefix}-date`}
        type="date"
        label={fieldText.pantDate.label}
        error={errors.date}
        value={values.date}
        max={todayIso}
        onChange={update('date')}
      />

      <TextField
        ref={(el) => {
          refs.current.note = el
        }}
        id={`${idPrefix}-note`}
        label={fieldText.note.label}
        hint={fieldText.note.hint}
        error={errors.note}
        value={values.note}
        onChange={update('note')}
        autoComplete="off"
      />

      {mutation.isError && (
        <Alert title={registerText.errorTitle}>
          <p>{mutation.error.message}</p>
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" icon={Check} disabled={mutation.isPending}>
          {mutation.isPending ? registerText.saving : entry ? registerText.saveChanges : registerText.savePant}
        </Button>
        {/* Alltid i DOM, så skjermlesere oppdager endringen */}
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
