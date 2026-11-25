type SkipLinkProps = {
  targetId: string
  label: string
}

export function SkipLink({ targetId, label }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-md bg-primary px-4 py-3 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
    >
      {label}
    </a>
  )
}
