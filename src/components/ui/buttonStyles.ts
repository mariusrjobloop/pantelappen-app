export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex min-h-tap items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border-2 border-border bg-surface text-ink hover:bg-surface-muted',
  danger: 'bg-negative text-on-negative hover:opacity-90',
  ghost: 'text-ink underline-offset-4 hover:bg-surface-muted hover:underline',
}

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 text-base',
  lg: 'px-7 py-3 text-lg',
}

/** Felles klasser for <Button> og <ButtonLink>, så knapper og lenker som ser like ut faktisk er like. */
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`
}
