import { PageHeader } from '../components/ui/PageHeader'
import { DataStatus } from '../components/layout/DataStatus'
import { LedgerView } from '../components/sections/ledger/LedgerView'
import { useExpenses } from '../hooks/useExpenses'
import { expenseLedgerText } from '../lib/content/ledger'

export function ExpensesPage() {
  const expenses = useExpenses()

  return (
    <>
      <PageHeader title={expenseLedgerText.title} intro={expenseLedgerText.intro} />
      <DataStatus queries={[expenses]} />
      {expenses.data && <LedgerView kind="expense" entries={expenses.data} />}
    </>
  )
}
