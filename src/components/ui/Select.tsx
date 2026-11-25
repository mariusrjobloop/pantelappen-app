import type { ComponentProps } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'

type SelectProps = Omit<ComponentProps<'select'>, 'id'> & {
  id: string
  label: string
  icon?: LucideIcon
}

/** Nedtrekksliste med synlig etikett. Bruker ekte <select>, så tastatur og skjermlesere fungerer som vanlig. */
export function Select({ id, label, icon: Icon, className = '', children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-muted" />
        )}
        <select
          id={id}
          className={`min-h-tap w-full appearance-none rounded-full border-2 border-border bg-surface py-2 pr-11 text-ink ${Icon ? 'pl-10' : 'pl-4'} ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink"
        />
      </div>
    </div>
  )
}
