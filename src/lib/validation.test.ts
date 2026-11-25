import { describe, expect, it } from 'vitest'
import { validateAmount, validateDate, validateExpenseForm, validatePantForm } from './validation'

const TODAY = '2026-11-24'

describe('validateAmount', () => {
  it('godtar gyldige beløp og gir øre', () => {
    expect(validateAmount('320')).toEqual({ ore: 32000 })
    expect(validateAmount('320,50')).toEqual({ ore: 32050 })
    expect(validateAmount('100000')).toEqual({ ore: 10_000_000 })
  })

  it.each([
    ['', 'Skriv inn et beløp.'],
    ['   ', 'Skriv inn et beløp.'],
    ['abc', 'Beløpet må være et tall, f.eks. 320 eller 320,50.'],
    ['-50', 'Beløpet må være et tall, f.eks. 320 eller 320,50.'],
    ['0', 'Beløpet må være større enn 0 kr.'],
    ['0,00', 'Beløpet må være større enn 0 kr.'],
  ])('avviser %j', (input, message) => {
    expect(validateAmount(input)).toEqual({ error: message })
  })

  it('avviser beløp over 100 000 kr', () => {
    const result = validateAmount('100000,01')
    expect('error' in result && result.error.replace(/\s/g, ' ')).toBe(
      'Beløpet kan ikke være mer enn 100 000 kr.',
    )
  })
})

describe('validateDate', () => {
  it('godtar i dag og tidligere datoer', () => {
    expect(validateDate(TODAY, TODAY)).toBeNull()
    expect(validateDate('2026-01-15', TODAY)).toBeNull()
  })

  it('avviser tom, ugyldig, fremtidig og for gammel dato', () => {
    expect(validateDate('', TODAY)).toBe('Velg en dato.')
    expect(validateDate('24.11.2026', TODAY)).toBe('Datoen er ugyldig.')
    expect(validateDate('2026-11-25', TODAY)).toBe('Datoen kan ikke være frem i tid.')
    expect(validateDate('0202-11-24', TODAY)).toBe('Datoen kan ikke være før 2020-01-01.')
  })
})

describe('validatePantForm', () => {
  it('gir data klar for databasen', () => {
    expect(validatePantForm({ amount: '320,50', date: TODAY, note: '  to sekker ' }, TODAY)).toEqual({
      ok: true,
      data: { amount_ore: 32050, pant_date: TODAY, note: 'to sekker' },
    })
  })

  it('lagrer tomt notat som null', () => {
    const r = validatePantForm({ amount: '100', date: TODAY, note: '   ' }, TODAY)
    expect(r.ok && r.data.note).toBeNull()
  })

  it('samler alle feil på én gang', () => {
    const r = validatePantForm({ amount: '', date: '', note: 'x'.repeat(501) }, TODAY)
    expect(r.ok).toBe(false)
    expect(!r.ok && Object.keys(r.errors).sort()).toEqual(['amount', 'date', 'note'])
  })
})

describe('validateExpenseForm', () => {
  it('gir data klar for databasen', () => {
    expect(validateExpenseForm({ amount: '450', date: TODAY, description: ' Pizza ' }, TODAY)).toEqual({
      ok: true,
      data: { amount_ore: 45000, spent_date: TODAY, description: 'Pizza' },
    })
  })

  it('krever beskrivelse', () => {
    const r = validateExpenseForm({ amount: '450', date: TODAY, description: '  ' }, TODAY)
    expect(!r.ok && r.errors).toEqual({ description: 'Skriv hva pengene ble brukt på.' })
  })

  it('avviser for lang beskrivelse', () => {
    const r = validateExpenseForm({ amount: '450', date: TODAY, description: 'x'.repeat(201) }, TODAY)
    expect(!r.ok && r.errors.description).toBe('Beskrivelsen kan være maks 200 tegn.')
  })
})
