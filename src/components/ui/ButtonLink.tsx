import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

type ButtonLinkProps = {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  /** Ikon etter teksten, f.eks. en pil. */
  trailingIcon?: LucideIcon
  className?: string
}

/** En lenke (navigerer) som ser ut som en knapp. */
export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  trailingIcon: TrailingIcon,
  className = '',
}: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, `w-fit ${className}`)}>
      {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.25} />}
      {children}
      {TrailingIcon && <TrailingIcon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.25} />}
    </Link>
  )
}
