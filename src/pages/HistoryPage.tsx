import { PageHeader } from '../components/ui/PageHeader'
import { DataStatus } from '../components/layout/DataStatus'
import { LedgerView } from '../components/sections/ledger/LedgerView'
import { usePantEntries } from '../hooks/usePantEntries'
import { pantLedgerText } from '../lib/content/ledger'

export function HistoryPage() {
  const pant = usePantEntries()

  return (
    <>
      <PageHeader title={pantLedgerText.title} intro={pantLedgerText.intro} />
      <DataStatus queries={[pant]} />
      {pant.data && <LedgerView kind="pant" entries={pant.data} />}
    </>
  )
}
