import { useId, useState, type KeyboardEvent } from 'react'
import { ChartColumn, Table2 } from 'lucide-react'
import { Card } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { StatusPill } from '../../ui/StatusPill'
import { useElementWidth } from '../../../hooks/useElementWidth'
import { weeklyText as text } from '../../../lib/content/weekly'
import { formatDateRange, formatKroner } from '../../../lib/format'
import {
  WEEKS_SHOWN,
  classifyWeek,
  niceTicksOre,
  weeklyStats,
  weeklyTotals,
  type WeekBucket,
  type WeekStatus,
} from '../../../lib/weekly'
import type { PantEntry } from '../../../types/models'

// Mål i piksler (tegnes i ekte piksler, så teksten ikke krymper på smale skjermer)
const PLOT_HEIGHT = 200
const MARGIN = { top: 28, right: 8, bottom: 36, left: 72 }
const CHART_HEIGHT = MARGIN.top + PLOT_HEIGHT + MARGIN.bottom
const MAX_BAR_WIDTH = 24
const CORNER_RADIUS = 4
/** Under denne kolonnebredden vises bare annenhver ukeetikett, så tallene ikke kolliderer. */
const MIN_SLOT_FOR_ALL_LABELS = 30

type WeeklyChartProps = {
  pant: readonly PantEntry[]
  todayIso: string
}

/** Stolpe med 4px avrundet topp og rett bunn mot grunnlinjen. */
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(CORNER_RADIUS, w / 2, h)
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`
}

export function WeeklyChart({ pant, todayIso }: WeeklyChartProps) {
  const buckets = weeklyTotals(pant, todayIso)
  const stats = weeklyStats(buckets)
  const statuses = buckets.map((b) => classifyWeek(b, stats.averageOre))
  const summaryId = useId()

  return (
    <Card heading={text.heading} icon={ChartColumn}>
      <p className="mt-3 text-ink-muted">{text.subheading(WEEKS_SHOWN)}</p>

      {!stats.hasAnyPant ? (
        <EmptyState icon={ChartColumn}>{text.empty(WEEKS_SHOWN)}</EmptyState>
      ) : (
        <>
          <p id={summaryId} className="mt-4 font-semibold">
            {text.summary(stats.goodWeeks, stats.completeWeeks, stats.averageOre)}
          </p>
          <Legend averageOre={stats.averageOre} />
          <Chart buckets={buckets} statuses={statuses} averageOre={stats.averageOre} describedBy={summaryId} />
          <WeekTable buckets={buckets} statuses={statuses} />
        </>
      )}
    </Card>
  )
}

function Legend({ averageOre }: { averageOre: number }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-ink">
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block size-4 rounded-sm bg-chart-accent" />
        {text.legendGood}
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block size-4 rounded-sm bg-chart-muted" />
        {text.legendBelow}
      </li>
      {averageOre > 0 && (
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-0.5 w-5 bg-ink-muted" />
          {text.averageLabel(averageOre)}
        </li>
      )}
    </ul>
  )
}

type ChartProps = {
  buckets: WeekBucket[]
  statuses: WeekStatus[]
  averageOre: number
  describedBy: string
}

function Chart({ buckets, statuses, averageOre, describedBy }: ChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const [keyboardFocus, setKeyboardFocus] = useState(false)

  const n = buckets.length
  const maxOre = Math.max(averageOre, ...buckets.map((b) => b.totalOre))
  const ticks = niceTicksOre(maxOre)
  const yMax = ticks[ticks.length - 1] || 1
  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const slot = plotWidth / n
  const barWidth = Math.min(MAX_BAR_WIDTH, slot * 0.6)
  const y = (ore: number) => MARGIN.top + PLOT_HEIGHT - (ore / yMax) * PLOT_HEIGHT
  const xCenter = (i: number) => MARGIN.left + slot * (i + 0.5)
  const baseline = y(0)
  // Annenhver etikett regnet bakover fra inneværende uke, så den alltid har etikett
  const showWeekLabel = (i: number) => slot >= MIN_SLOT_FOR_ALL_LABELS || (n - 1 - i) % 2 === 0

  const describe = (i: number) => {
    const b = buckets[i]
    const status = text.status[statuses[i]]
    return text.describeWeek(b.weekNumber, formatDateRange(b.start, b.end), b.totalOre, status)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, (current: number) => number> = {
      ArrowLeft: (c) => Math.max(0, c - 1),
      ArrowRight: (c) => Math.min(n - 1, c + 1),
      Home: () => 0,
      End: () => n - 1,
    }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    // Funksjonell oppdatering, så raske tastetrykk (tasterepetisjon) ikke leser en gammel verdi
    setActive((a) => move(a ?? n - 1))
  }

  const activeBucket = active === null ? null : buckets[active]
  const tooltipLeft = active === null ? 0 : Math.min(Math.max(xCenter(active), 90), width - 90)

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={text.chartLabel}
      aria-describedby={describedBy}
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        // Bare tastaturfokus (ikke museklikk) skal starte navigering og opplesning
        if (!e.currentTarget.matches(':focus-visible')) return
        setKeyboardFocus(true)
        setActive((a) => a ?? n - 1)
      }}
      onBlur={() => {
        setKeyboardFocus(false)
        setActive(null)
      }}
      className="relative mt-4 rounded-md"
      style={{ height: CHART_HEIGHT }}
    >
      {width > 0 && (
        <svg
          width={width}
          height={CHART_HEIGHT}
          aria-hidden="true"
          onPointerLeave={() => !keyboardFocus && setActive(null)}
        >
          {/* Rutenett og y-akse: hårfine, heltrukne og dempede */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(t)}
                y2={y(t)}
                strokeWidth={1}
                className={t === 0 ? 'stroke-chart-muted' : 'stroke-chart-grid'}
              />
              <text
                x={MARGIN.left - 8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-ink-muted text-sm tabular-nums"
              >
                {formatKroner(t)}
              </text>
            </g>
          ))}

          {/* Markering av aktiv uke */}
          {active !== null && (
            <rect
              x={MARGIN.left + slot * active}
              y={MARGIN.top}
              width={slot}
              height={PLOT_HEIGHT}
              className="fill-chart-grid"
              opacity={0.6}
            />
          )}

          {/* Stolper */}
          {buckets.map((b, i) => {
            if (b.totalOre <= 0) return null
            const top = y(b.totalOre)
            return (
              <path
                key={b.start}
                d={barPath(xCenter(i) - barWidth / 2, top, barWidth, baseline - top)}
                className={statuses[i] === 'good' ? 'fill-chart-accent' : 'fill-chart-muted'}
              />
            )
          })}

          {/* Snittlinje. Verdien står i forklaringen rett over grafen, så den ikke kolliderer med stolpene. */}
          {averageOre > 0 && (
            <line
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={y(averageOre)}
              y2={y(averageOre)}
              strokeWidth={2}
              className="stroke-ink-muted"
            />
          )}

          {/* Ukenummer langs x-aksen */}
          <text x={MARGIN.left - 8} y={baseline + 22} textAnchor="end" className="fill-ink-muted text-sm">
            {text.axisWeek}
          </text>
          {buckets.map((b, i) =>
            !showWeekLabel(i) ? null : (
              <text
                key={b.start}
                x={xCenter(i)}
                y={baseline + 22}
                textAnchor="middle"
                className={`text-sm tabular-nums ${b.isCurrent ? 'fill-ink font-bold' : 'fill-ink-muted'}`}
              >
                {b.weekNumber}
              </text>
            ),
          )}

          {/* Treffflater: hele kolonnen, ikke bare stolpen */}
          {buckets.map((b, i) => (
            <rect
              key={b.start}
              x={MARGIN.left + slot * i}
              y={MARGIN.top}
              width={slot}
              height={PLOT_HEIGHT + MARGIN.bottom}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              // Trykk på mobil (ingen hover)
              onPointerDown={() => setActive(i)}
            />
          ))}
        </svg>
      )}

      {activeBucket && active !== null && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 w-max max-w-60 -translate-x-1/2 -translate-y-full rounded-2xl border-2 border-border bg-surface px-4 py-3 shadow-lg"
          style={{ left: tooltipLeft, top: Math.max(y(activeBucket.totalOre), MARGIN.top) - 8 }}
        >
          <p className="font-display text-2xl font-extrabold">{formatKroner(activeBucket.totalOre)}</p>
          <p className="text-sm text-ink-muted">
            {text.weekShort(activeBucket.weekNumber)} · {formatDateRange(activeBucket.start, activeBucket.end)}
          </p>
          <p className="mt-1.5">
            <StatusPill status={statuses[active]} label={text.status[statuses[active]]} size="sm" />
          </p>
        </div>
      )}

      {/* Leser opp uka når man går med piltastene */}
      <p className="sr-only" aria-live="polite">
        {keyboardFocus && active !== null ? describe(active) : ''}
      </p>
    </div>
  )
}

function WeekTable({ buckets, statuses }: { buckets: WeekBucket[]; statuses: WeekStatus[] }) {
  return (
    <details className="mt-4">
      <summary className="inline-flex min-h-tap cursor-pointer items-center gap-2 rounded-full font-semibold underline underline-offset-4">
        <Table2 aria-hidden="true" className="size-5" strokeWidth={2.25} />
        {text.tableToggle}
      </summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{text.tableCaption}</caption>
          <thead>
            <tr className="border-b-2 border-border text-ink-muted">
              <th scope="col" className="py-2 pr-4 font-semibold">
                {text.columns.week}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                {text.columns.period}
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                {text.columns.amount}
              </th>
              <th scope="col" className="py-2 font-semibold">
                {text.columns.status}
              </th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((b, i) => (
              <tr key={b.start} className="border-b border-border/50 last:border-b-0">
                <th scope="row" className="py-2 pr-4 font-semibold tabular-nums">
                  {b.weekNumber}{' '}
                  {b.isCurrent && <span className="font-normal text-ink-muted">{text.currentWeekSuffix}</span>}
                </th>
                <td className="py-2 pr-4 whitespace-nowrap">{formatDateRange(b.start, b.end)}</td>
                <td className="py-2 pr-4 text-right whitespace-nowrap tabular-nums">{formatKroner(b.totalOre)}</td>
                <td className="py-2">
                  <StatusPill status={statuses[i]} label={text.status[statuses[i]]} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
