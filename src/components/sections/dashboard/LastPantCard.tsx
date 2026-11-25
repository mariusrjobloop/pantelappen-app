import { AlarmClock, CalendarClock } from 'lucide-react'
import { Card } from '../../ui/Card'
import { dashboardText } from '../../../lib/content/dashboard'
import { formatDateLong } from '../../../lib/format'
import { PANT_REMINDER_DAYS, type DashboardSummary } from '../../../lib/stats'

const text = dashboardText.lastPant

type LastPantCardProps = {
  summary: DashboardSummary
}

export function LastPantCard({ summary }: LastPantCardProps) {
  const { lastPantDate, daysSinceLastPant } = summary

  if (lastPantDate === null || daysSinceLastPant === null) {
    return (
      <Card heading={text.heading} tone="yellow" icon={CalendarClock}>
        <p className="mt-4 text-ink-muted">{text.empty}</p>
      </Card>
    )
  }

  const showReminder = daysSinceLastPant >= PANT_REMINDER_DAYS

  return (
    <Card heading={text.heading} tone="yellow" icon={CalendarClock}>
      <p className="mt-4 font-display text-4xl font-extrabold">{text.daysSince(daysSinceLastPant)}</p>
      <p className="mt-1 text-ink-muted">
        <time dateTime={lastPantDate}>{formatDateLong(lastPantDate)}</time>
      </p>
      {showReminder && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-surface/70 p-3 font-semibold">
          <AlarmClock aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} />
          {text.reminder}
        </p>
      )}
    </Card>
  )
}
