import { Hourglass, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'

export type PillStatus = 'good' | 'below' | 'current'

const styles: Record<PillStatus, { icon: LucideIcon; className: string }> = {
  good: { icon: TrendingUp, className: 'bg-chip-green text-on-chip' },
  below: { icon: TrendingDown, className: 'bg-surface-muted text-ink' },
  current: { icon: Hourglass, className: 'bg-chip-yellow text-on-chip' },
}

type StatusPillProps = {
  status: PillStatus
  label: string
  size?: 'sm' | 'md'
}

/** Status med ikon + tekst + farge, så den aldri formidles med farge alene. */
export function StatusPill({ status, label, size = 'md' }: StatusPillProps) {
  const { icon: Icon, className } = styles[status]
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-sm' : 'px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${sizeClass} ${className}`}>
      <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
      {label}
    </span>
  )
}
