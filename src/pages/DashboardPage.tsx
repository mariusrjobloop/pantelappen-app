import { PageHeader } from '../components/ui/PageHeader'
import { DataStatus } from '../components/layout/DataStatus'
import { BalanceCard } from '../components/sections/dashboard/BalanceCard'
import { LastPantCard } from '../components/sections/dashboard/LastPantCard'
import { TotalsCard } from '../components/sections/dashboard/TotalsCard'
import { TransactionList } from '../components/sections/dashboard/TransactionList'
import { WeeklyChart } from '../components/sections/dashboard/WeeklyChart'
import { useExpenses } from '../hooks/useExpenses'
import { usePantEntries } from '../hooks/usePantEntries'
import { dashboardContent } from '../lib/content/pages'
import { toIsoDate } from '../lib/format'
import { computeSummary, recentTransactions } from '../lib/stats'

const RECENT_LIMIT = 5

export function DashboardPage() {
  const pant = usePantEntries()
  const expenses = useExpenses()

  return (
    <>
      <PageHeader eyebrow={dashboardContent.eyebrow} title={dashboardContent.title} intro={dashboardContent.intro} />
      <DataStatus queries={[pant, expenses]} />
      {pant.data && expenses.data && <DashboardCards pant={pant.data} expenses={expenses.data} />}
    </>
  )
}

type DashboardCardsProps = {
  pant: NonNullable<ReturnType<typeof usePantEntries>['data']>
  expenses: NonNullable<ReturnType<typeof useExpenses>['data']>
}

function DashboardCards({ pant, expenses }: DashboardCardsProps) {
  const todayIso = toIsoDate(new Date())
  const summary = computeSummary(pant, expenses, todayIso)
  const transactions = recentTransactions(pant, expenses, RECENT_LIMIT)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BalanceCard summary={summary} />
      <div className="grid gap-6">
        <LastPantCard summary={summary} />
        <TotalsCard summary={summary} />
      </div>
      <div className="md:col-span-2">
        <WeeklyChart pant={pant} todayIso={todayIso} />
      </div>
      <div className="md:col-span-2">
        <TransactionList transactions={transactions} todayIso={todayIso} />
      </div>
    </div>
  )
}
