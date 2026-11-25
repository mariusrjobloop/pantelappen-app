import { describe, expect, it } from 'vitest'
import {
  addDays,
  classifyWeek,
  isoWeekNumber,
  niceTicksOre,
  weekStart,
  weeklyStats,
  weeklyTotals,
  type WeekBucket,
} from './weekly'
import type { PantEntry } from '../types/models'

function pant(amount_ore: number, pant_date: string): PantEntry {
  return { id: pant_date + amount_ore, amount_ore, pant_date, note: null, created_at: '', updated_at: '', deleted_at: null }
}

// Tirsdag 24. november 2026, uke 48
const TODAY = '2026-11-24'

describe('datoer og uker', () => {
  it('addDays går over måneds- og årsskifte', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('weekStart gir mandagen', () => {
    expect(weekStart('2026-11-23')).toBe('2026-11-23') // mandag
    expect(weekStart('2026-11-24')).toBe('2026-11-23') // tirsdag
    expect(weekStart('2026-11-29')).toBe('2026-11-23') // søndag
    expect(weekStart('2026-01-01')).toBe('2025-12-29') // torsdag, uka starter året før
  })

  it('isoWeekNumber følger ISO 8601', () => {
    expect(isoWeekNumber('2026-11-24')).toBe(48)
    expect(isoWeekNumber('2026-01-01')).toBe(1)
    expect(isoWeekNumber('2025-12-29')).toBe(1) // mandag i uke 1 av 2026
    expect(isoWeekNumber('2027-01-01')).toBe(53) // fredag i uke 53 av 2026
    expect(isoWeekNumber('2027-01-04')).toBe(1)
  })

  it('påvirkes ikke av sommertid', () => {
    expect(weekStart('2026-03-29')).toBe('2026-03-23') // søndag med overgang til sommertid
    expect(weekStart('2026-10-25')).toBe('2026-10-19') // søndag med overgang til vintertid
  })
})

describe('weeklyTotals', () => {
  it('lager 12 uker, eldste først, siste er inneværende uke', () => {
    const weeks = weeklyTotals([], TODAY)
    expect(weeks).toHaveLength(12)
    expect(weeks[11]).toMatchObject({ start: '2026-11-23', end: '2026-11-29', weekNumber: 48, isCurrent: true })
    expect(weeks[0]).toMatchObject({ start: '2026-09-07', weekNumber: 37, isCurrent: false })
  })

  it('summerer pant i riktig uke og ignorerer eldre pant', () => {
    const weeks = weeklyTotals(
      [pant(30000, '2026-11-23'), pant(5000, '2026-11-24'), pant(20000, '2026-11-15'), pant(99900, '2026-01-01')],
      TODAY,
    )
    expect(weeks[11]).toMatchObject({ totalOre: 35000, count: 2 })
    expect(weeks[10]).toMatchObject({ weekNumber: 47, totalOre: 0 })
    expect(weeks[9]).toMatchObject({ weekNumber: 46, totalOre: 20000, count: 1 }) // søndag 15. nov.
    expect(weeks.reduce((s, w) => s + w.totalOre, 0)).toBe(55000)
  })
})

describe('weeklyStats og classifyWeek', () => {
  const week = (totalOre: number, isCurrent = false): WeekBucket => ({
    start: '',
    end: '',
    weekNumber: 1,
    totalOre,
    count: totalOre > 0 ? 1 : 0,
    isCurrent,
  })

  it('snittet regnes bare av hele uker', () => {
    const stats = weeklyStats([week(30000), week(0), week(60000), week(500000, true)])
    expect(stats.averageOre).toBe(30000)
    expect(stats.completeWeeks).toBe(3)
    expect(stats.goodWeeks).toBe(2) // 300 og 600 kr er ≥ 300 kr
  })

  it('runder snittet til hele kroner', () => {
    // (300 + 0 + 469,10) / 3 = 256,37 kr → 256 kr
    expect(weeklyStats([week(30000), week(0), week(46910)]).averageOre).toBe(25600)
  })

  it('en uke uten pant er aldri bra, heller ikke når snittet er 0', () => {
    expect(classifyWeek(week(0), 0)).toBe('below')
    expect(weeklyStats([week(0), week(0)]).goodWeeks).toBe(0)
    expect(weeklyStats([week(0), week(0)]).hasAnyPant).toBe(false)
  })

  it('inneværende uke blir «bra» når den når snittet, ellers «pågår»', () => {
    expect(classifyWeek(week(10000, true), 30000)).toBe('current')
    expect(classifyWeek(week(30000, true), 30000)).toBe('good')
    expect(classifyWeek(week(29999), 30000)).toBe('below')
  })
})

describe('niceTicksOre', () => {
  it('gir runde kronebeløp som dekker maks', () => {
    expect(niceTicksOre(0)).toEqual([0])
    expect(niceTicksOre(60000)).toEqual([0, 20000, 40000, 60000]) // 600 kr → 0/200/400/600
    expect(niceTicksOre(35000)).toEqual([0, 10000, 20000, 30000, 40000])
    expect(niceTicksOre(95000)).toEqual([0, 25000, 50000, 75000, 100000])
    expect(niceTicksOre(250)).toEqual([0, 100, 200, 300]) // 2,50 kr → 0/1/2/3
  })
})
