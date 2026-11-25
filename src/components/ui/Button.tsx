import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ikon foran teksten. Er pynt; teksten er knappens navn. */
  icon?: LucideIcon
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {Icon && <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.25} />}
      {children}
    </button>
  )
}
