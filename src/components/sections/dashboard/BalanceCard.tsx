import { ArrowDownLeft, ArrowUpRight, History, Plus, ShoppingBag, TriangleAlert, Wallet } from 'lucide-react'
import { Card } from '../../ui/Card'
import { RoundAction } from '../../ui/RoundAction'
import { useAuth } from '../../../hooks/useAuth'
import { dashboardText } from '../../../lib/content/dashboard'
import { formatKroner } from '../../../lib/format'
import type { DashboardSummary } from '../../../lib/stats'

const text = dashboardText.balance

type BalanceCardProps = {
  summary: DashboardSummary
}

export function BalanceCard({ summary }: BalanceCardProps) {
  const { isAdmin } = useAuth()
  const isNegative = summary.balanceOre < 0

  return (
    <Card heading={text.heading} eyebrow={text.eyebrow} tone="brand" icon={Wallet} iconTone="surface">
      <p className="mt-4 font-display text-hero font-extrabold tracking-tight">
        {formatKroner(summary.balanceOre)}
      </p>

      {isNegative && (
        <p className="mt-3 flex items-center gap-2 font-semibold">
          <TriangleAlert aria-hidden="true" className="size-5" strokeWidth={2.5} />
          {text.negative}
        </p>
      )}

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        <div className="flex items-center gap-2">
          <dt className="flex items-center gap-2 text-on-brand-muted">
            <ArrowDownLeft aria-hidden="true" className="size-5 text-on-brand" strokeWidth={2.5} />
            {text.pantIn}
          </dt>
          <dd className="text-xl font-bold">{formatKroner(summary.totalPantOre)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="flex items-center gap-2 text-on-brand-muted">
            <ArrowUpRight aria-hidden="true" className="size-5 text-on-brand" strokeWidth={2.5} />
            {text.spent}
          </dt>
          <dd className="text-xl font-bold">{formatKroner(summary.totalSpentOre)}</dd>
        </div>
      </dl>

      <nav aria-label={text.actionsLabel} className="mt-6">
        <ul className="flex flex-wrap gap-6">
          {isAdmin === true ? (
            <>
              <li>
                <RoundAction to="/registrer" icon={Plus} label={text.actions.pant} />
              </li>
              <li>
                <RoundAction to="/registrer?type=utgift" icon={ShoppingBag} label={text.actions.expense} />
              </li>
              <li>
                <RoundAction to="/historikk" icon={History} label={text.actions.history} />
              </li>
            </>
          ) : (
            <>
              <li>
                <RoundAction to="/historikk" icon={History} label={text.actions.history} />
              </li>
              <li>
                <RoundAction to="/utgifter" icon={ShoppingBag} label={text.actions.expenses} />
              </li>
            </>
          )}
        </ul>
      </nav>
    </Card>
  )
}
