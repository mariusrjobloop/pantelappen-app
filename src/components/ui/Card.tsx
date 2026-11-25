import { useId, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { IconBadge, type IconBadgeTone } from './IconBadge'

export type CardTone = 'surface' | 'brand' | 'yellow' | 'pink'

const tones: Record<CardTone, string> = {
  surface: 'border-2 border-border/40 bg-surface text-ink',
  // brand-scope gir mørkegrønn fokusring på den grønne flaten (se index.css)
  brand: 'brand-scope bg-brand text-on-brand',
  yellow: 'bg-tile-yellow text-ink',
  pink: 'bg-tile-pink text-ink',
}

type CardProps = {
  heading: string
  children: ReactNode
  tone?: CardTone
  /** Ikon i en brikke foran overskriften. */
  icon?: LucideIcon
  iconTone?: IconBadgeTone
  /** Liten tekst over overskriften, f.eks. «Klassekassa». */
  eyebrow?: string
  className?: string
}

/** Et avsnitt (flis) med overskrift (h2), koblet til skjermlesere via aria-labelledby. */
export function Card({ heading, children, tone = 'surface', icon, iconTone, eyebrow, className = '' }: CardProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={`rounded-tile p-5 sm:p-7 ${tones[tone]} ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <IconBadge icon={icon} tone={iconTone ?? (tone === 'surface' ? 'green' : 'surface')} />}
        <div>
          {eyebrow && <p className="text-sm font-semibold tracking-wide uppercase opacity-80">{eyebrow}</p>}
          <h2 id={headingId} className="text-2xl font-bold">
            {heading}
          </h2>
        </div>
      </div>
      {children}
    </section>
  )
}
