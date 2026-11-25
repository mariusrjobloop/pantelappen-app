import { describe, expect, it } from 'vitest'
import {
  daysBetween,
  formatDateLong,
  formatDateShort,
  formatKroner,
  formatMonth,
  oreToInput,
  parseIsoDate,
  parseKronerToOre,
  toIsoDate,
} from './format'

/** Intl bruker hardt mellomrom (U+00A0) og ekte minustegn. Normaliser for lesbare tester. */
const plain = (s: string) => s.replace(/\s/g, ' ').replace('−', '-')

describe('formatKroner', () => {
  it('viser hele kroner uten desimaler', () => {
    expect(plain(formatKroner(15000))).toBe('150 kr')
    expect(plain(formatKroner(0))).toBe('0 kr')
  })

  it('bruker mellomrom som tusenskille', () => {
    expect(plain(formatKroner(234000))).toBe('2 340 kr')
  })

  it('viser øre med komma når de finnes', () => {
    expect(plain(formatKroner(234050))).toBe('2 340,50 kr')
    expect(plain(formatKroner(5))).toBe('0,05 kr')
  })

  it('viser negative beløp', () => {
    expect(plain(formatKroner(-45000))).toBe('-450 kr')
  })
})

describe('parseKronerToOre', () => {
  it.each([
    ['150', 15000],
    ['150,5', 15050],
    ['150,50', 15050],
    ['150.50', 15050],
    ['0,29', 29],
    ['1 500', 150000],
    ['1 500', 150000],
    ['  320 kr ', 32000],
    ['320kr.', 32000],
    ['0', 0],
  ])('tolker %j som %i øre', (input, expected) => {
    expect(parseKronerToOre(input)).toBe(expected)
  })

  it.each(['', 'abc', '-50', '1,234', '1.500,00', '12,3,4', ',50', '50,'])(
    'avviser %j',
    (input) => {
      expect(parseKronerToOre(input)).toBeNull()
    },
  )
})

describe('datoer', () => {
  it('toIsoDate bruker lokal dato, ikke UTC', () => {
    expect(toIsoDate(new Date(2026, 10, 24, 23, 59))).toBe('2026-11-24')
    expect(toIsoDate(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05')
  })

  it('parseIsoDate gir midnatt lokal tid', () => {
    const d = parseIsoDate('2026-11-12')
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 10, 12, 0])
  })

  it('daysBetween teller kalenderdager', () => {
    expect(daysBetween('2026-11-24', '2026-11-24')).toBe(0)
    expect(daysBetween('2026-11-23', '2026-11-24')).toBe(1)
    expect(daysBetween('2026-11-12', '2026-11-24')).toBe(12)
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1)
  })

  it('daysBetween påvirkes ikke av overgang til/fra sommertid', () => {
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2)
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2)
  })

  it('formaterer datoer på norsk', () => {
    expect(formatDateLong('2026-11-12')).toBe('torsdag 12. november 2026')
    expect(formatDateShort('2026-11-12', '2026-11-24')).toBe('12. nov.')
    expect(formatDateShort('2025-11-12', '2026-11-24')).toBe('12. nov. 2025')
  })
})

describe('oreToInput', () => {
  it.each([
    [32000, '320'],
    [32050, '320,50'],
    [32005, '320,05'],
    [5, '0,05'],
    [150000, '1500'],
  ])('%i øre → %j, og tilbake', (ore, text) => {
    expect(oreToInput(ore)).toBe(text)
    expect(parseKronerToOre(oreToInput(ore))).toBe(ore)
  })
})

describe('formatMonth', () => {
  it('gir måned og år på norsk', () => {
    expect(formatMonth('2026-11')).toBe('november 2026')
    expect(formatMonth('2026-01')).toBe('januar 2026')
  })
})
