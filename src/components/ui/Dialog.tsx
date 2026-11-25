import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  children: ReactNode
}

/**
 * Modal dialog basert på det innebygde <dialog>-elementet.
 * Nettleseren tar seg av fokusfelle, Esc for å lukke og å gjøre resten av siden inaktiv.
 */
export function Dialog({ open, onClose, title, closeLabel, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto max-h-[90dvh] overflow-y-auto overscroll-contain w-[min(40rem,calc(100vw-2rem))] rounded-tile border-2 border-border bg-surface p-6 text-ink backdrop:bg-black/60 sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-3xl font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-tap shrink-0 items-center justify-center rounded-full bg-surface-muted hover:bg-border/30"
        >
          <X aria-hidden="true" className="size-6" strokeWidth={2.25} />
          <span className="sr-only">{closeLabel}</span>
        </button>
      </div>
      {/* Innholdet monteres bare når dialogen er åpen, så skjemaet starter med ferske verdier */}
      {open && children}
    </dialog>
  )
}
