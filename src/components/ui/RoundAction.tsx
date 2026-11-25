import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'

type RoundActionProps = {
  to: string
  icon: LucideIcon
  label: string
}

/** Rund handlingsknapp med ikon og synlig etikett under (som «Send / Motta» i bankapper). */
export function RoundAction({ to, icon: Icon, label }: RoundActionProps) {
  return (
    <Link to={to} className="group flex min-w-tap flex-col items-center gap-2 rounded-2xl p-1 font-semibold">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-on-brand text-brand-action-icon transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]"
      >
        <Icon className="size-7" strokeWidth={2.5} />
      </span>
      <span>{label}</span>
    </Link>
  )
}
