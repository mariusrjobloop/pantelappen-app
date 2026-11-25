import type { LucideIcon } from 'lucide-react'

type Option<T extends string> = {
  value: T
  label: string
  icon?: LucideIcon
}

type SegmentedControlProps<T extends string> = {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

/**
 * Valg mellom noen få alternativer, som knapper med aria-pressed.
 * Enklere og mer robust for skjermlesere enn et ARIA-fanepanel.
 */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-full bg-surface-muted p-1.5">
      {options.map(({ value: v, label: optionLabel, icon: Icon }) => {
        const selected = v === value
        return (
          <button
            key={v}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(v)}
            className={`inline-flex min-h-tap items-center gap-2 rounded-full px-6 font-semibold transition-colors ${
              selected ? 'bg-primary text-on-primary shadow-sm' : 'text-ink hover:bg-surface'
            }`}
          >
            {Icon && <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />}
            {optionLabel}
          </button>
        )
      })}
    </div>
  )
}
