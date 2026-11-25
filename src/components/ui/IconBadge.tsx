import type { LucideIcon } from 'lucide-react'

export type IconBadgeTone = 'green' | 'yellow' | 'pink' | 'surface' | 'muted'
type IconBadgeSize = 'sm' | 'md' | 'lg'

const tones: Record<IconBadgeTone, string> = {
  green: 'bg-chip-green text-on-chip',
  yellow: 'bg-chip-yellow text-on-chip',
  pink: 'bg-chip-pink text-on-chip',
  surface: 'bg-surface text-ink',
  muted: 'bg-surface-muted text-ink',
}

const sizes: Record<IconBadgeSize, { box: string; icon: string }> = {
  sm: { box: 'size-10 rounded-xl', icon: 'size-5' },
  md: { box: 'size-12 rounded-2xl', icon: 'size-6' },
  lg: { box: 'size-14 rounded-2xl', icon: 'size-7' },
}

type IconBadgeProps = {
  icon: LucideIcon
  tone?: IconBadgeTone
  size?: IconBadgeSize
  className?: string
}

/** Ikon i en avrundet, farget brikke. Alltid dekorativt: teksten ved siden av bærer betydningen. */
export function IconBadge({ icon: Icon, tone = 'green', size = 'md', className = '' }: IconBadgeProps) {
  const s = sizes[size]
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${s.box} ${tones[tone]} ${className}`}>
      <Icon className={s.icon} strokeWidth={2.25} />
    </span>
  )
}
