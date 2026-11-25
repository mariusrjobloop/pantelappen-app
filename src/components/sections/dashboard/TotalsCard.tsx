import { Recycle } from 'lucide-react'
import { Card } from '../../ui/Card'
import { dashboardText } from '../../../lib/content/dashboard'
import { formatKroner } from '../../../lib/format'
import type { DashboardSummary } from '../../../lib/stats'

const text = dashboardText.totals

type TotalsCardProps = {
  summary: DashboardSummary
}

export function TotalsCard({ summary }: TotalsCardProps) {
  return (
    <Card heading={text.heading} tone="pink" icon={Recycle}>
      <p className="mt-4 font-display text-4xl font-extrabold">{formatKroner(summary.totalPantOre)}</p>
      {summary.pantCount > 0 && (
        <>
          <p className="mt-1 text-ink-muted">{text.count(summary.pantCount)}</p>
          <p className="mt-4">
            <span className="font-semibold">{text.bags(summary.estimatedBags)}</span>{' '}
            <span className="text-ink-muted">({text.bagsHint})</span>
          </p>
        </>
      )}
    </Card>
  )
}
