import { ArrowRight, ReceiptText, Recycle, ShoppingBag } from 'lucide-react'
import { Card } from '../../ui/Card'
import { ButtonLink } from '../../ui/ButtonLink'
import { EmptyState } from '../../ui/EmptyState'
import { IconBadge } from '../../ui/IconBadge'
import { dashboardText } from '../../../lib/content/dashboard'
import { formatDateShort, formatKroner } from '../../../lib/format'
import type { Transaction } from '../../../lib/stats'

const text = dashboardText.transactions

type TransactionListProps = {
  transactions: Transaction[]
  todayIso: string
}

export function TransactionList({ transactions, todayIso }: TransactionListProps) {
  return (
    <Card heading={text.heading} icon={ReceiptText} iconTone="yellow">
      {transactions.length === 0 ? (
        <EmptyState icon={ReceiptText}>{text.empty}</EmptyState>
      ) : (
        <table className="mt-4 w-full border-collapse text-left">
          <caption className="sr-only">{text.caption}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">{text.columns.text}</th>
              <th scope="col" className="hidden sm:table-cell">
                {text.columns.date}
              </th>
              <th scope="col">{text.columns.amount}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const isPant = t.kind === 'pant'
              return (
                <tr key={`${t.kind}-${t.id}`} className="border-b-2 border-surface-muted last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <IconBadge icon={isPant ? Recycle : ShoppingBag} tone={isPant ? 'green' : 'pink'} size="sm" />
                      <div>
                        <span className="block font-semibold">{isPant ? text.pantLabel : text.expenseLabel}</span>
                        {t.text && <span className="block text-ink-muted">{t.text}</span>}
                        {/* På mobil står datoen her i stedet for i egen kolonne */}
                        <time dateTime={t.date} className="block text-sm text-ink-muted sm:hidden">
                          {formatDateShort(t.date, todayIso)}
                        </time>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-3 whitespace-nowrap text-ink-muted tabular-nums sm:table-cell">
                    <time dateTime={t.date}>{formatDateShort(t.date, todayIso)}</time>
                  </td>
                  <td
                    className={`py-3 text-right text-lg font-bold whitespace-nowrap tabular-nums ${isPant ? 'text-positive' : 'text-ink'}`}
                  >
                    {isPant ? '+ ' : '− '}
                    {formatKroner(t.amountOre)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <ButtonLink to="/historikk" variant="ghost" trailingIcon={ArrowRight} className="mt-4 -ml-4">
        {text.seeAll}
      </ButtonLink>
    </Card>
  )
}
