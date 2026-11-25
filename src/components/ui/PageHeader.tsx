type PageHeaderProps = {
  title: string
  /** Liten tekst over tittelen, f.eks. «Klassekassa». */
  eyebrow?: string
  intro?: string
}

export function PageHeader({ title, eyebrow, intro }: PageHeaderProps) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="font-semibold text-ink-muted">{eyebrow}</p>}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
      {intro && <p className="mt-3 max-w-prose text-ink-muted">{intro}</p>}
    </header>
  )
}
