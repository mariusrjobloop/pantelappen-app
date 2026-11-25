import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { IconBadge, type IconBadgeTone } from './IconBadge'

type EmptyStateProps = {
  icon: LucideIcon
  children: ReactNode
  tone?: IconBadgeTone
}

/** Vennlig melding når det ikke finnes data ennå. */
export function EmptyState({ icon, children, tone = 'muted' }: EmptyStateProps) {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 p-5">
      <IconBadge icon={icon} tone={tone} />
      <p className="text-ink-muted">{children}</p>
    </div>
  )
}
