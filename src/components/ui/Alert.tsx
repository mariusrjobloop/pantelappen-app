import type { ReactNode } from 'react'
import { CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'

type AlertTone = 'error' | 'success' | 'info'

const tones: Record<AlertTone, { icon: LucideIcon; border: string; iconColor: string }> = {
  error: { icon: TriangleAlert, border: 'border-negative', iconColor: 'text-negative' },
  success: { icon: CircleCheck, border: 'border-positive', iconColor: 'text-positive' },
  info: { icon: Info, border: 'border-border', iconColor: 'text-ink' },
}

type AlertProps = {
  title: string
  children?: ReactNode
  tone?: AlertTone
}

/**
 * Melding med ikon, farget kant og tekst (aldri bare farge).
 * Feil får role="alert" og leses opp med en gang. Suksess/info legges i en
 * role="status"-region av den som bruker komponenten, så de ikke avbryter.
 */
export function Alert({ title, children, tone = 'error' }: AlertProps) {
  const { icon: Icon, border, iconColor } = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={`rounded-2xl border-2 bg-surface p-5 ${border}`}>
      <p className="flex items-start gap-3 text-lg font-semibold">
        <Icon aria-hidden="true" className={`mt-0.5 size-6 shrink-0 ${iconColor}`} strokeWidth={2.25} />
        {title}
      </p>
      {children && <div className="mt-3 flex flex-col items-start gap-3 pl-9 text-ink">{children}</div>}
    </div>
  )
}
