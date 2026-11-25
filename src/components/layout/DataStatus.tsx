import { LoaderCircle, RotateCcw } from 'lucide-react'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { dataStatusText as text } from '../../lib/content/common'
import { isSupabaseConfigured } from '../../lib/supabase'

type QueryLike = {
  error: Error | null
  isPending: boolean
  refetch: () => Promise<unknown>
}

type DataStatusProps = {
  queries: QueryLike[]
}

/**
 * Viser «ikke koblet til», feil med «Prøv igjen», eller lasting.
 * Returnerer null når alle spørringene har data, slik at siden kan vise innholdet.
 */
export function DataStatus({ queries }: DataStatusProps) {
  if (!isSupabaseConfigured) {
    return (
      <Alert title={text.notConfigured.title}>
        <p>{text.notConfigured.body}</p>
      </Alert>
    )
  }

  const error = queries.find((q) => q.error)?.error
  if (error) {
    const retry = () => queries.forEach((q) => void q.refetch())
    return (
      <Alert title={text.error.title}>
        <p>{text.error.body}</p>
        <details>
          <summary className="cursor-pointer">{text.error.detailsLabel}</summary>
          <code className="mt-2 block text-ink-muted">{error.message}</code>
        </details>
        <Button icon={RotateCcw} onClick={retry}>
          {text.error.retry}
        </Button>
      </Alert>
    )
  }

  if (queries.some((q) => q.isPending)) {
    return (
      <p role="status" className="flex items-center gap-2 text-ink-muted">
        {/* Spinner stopper automatisk ved «redusert bevegelse» (se index.css) */}
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
        {text.loading}
      </p>
    )
  }

  return null
}
