import type { InputHTMLAttributes, Ref } from 'react'
import { CircleAlert } from 'lucide-react'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string
  label: string
  hint?: string
  error?: string
  /** Tekst etter feltet, f.eks. «kr». */
  suffix?: string
  ref?: Ref<HTMLInputElement>
}

/**
 * Tekstfelt med synlig etikett, hjelpetekst og feilmelding.
 * Hjelpetekst og feil kobles til feltet med aria-describedby, så skjermlesere leser dem opp.
 */
export function TextField({ id, label, hint, error, suffix, className = '', ref, ...inputProps }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-2 font-semibold text-negative">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2.25} />
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`min-h-tap w-full rounded-2xl border-2 bg-surface px-4 py-2.5 text-ink ${error ? 'border-negative' : 'border-border'} ${className}`}
          {...inputProps}
        />
        {suffix && (
          <span aria-hidden="true" className="font-display text-xl font-bold">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
