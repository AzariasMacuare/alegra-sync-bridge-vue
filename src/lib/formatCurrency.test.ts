import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formats COP amounts for es-CO locale', () => {
    const formatted = formatCurrency(150000, 'COP')
    expect(formatted).toContain('150')
    expect(formatted).toMatch(/COP|\$/)
  })

  it('formats USD amounts', () => {
    const formatted = formatCurrency(99.5, 'USD')
    expect(formatted).toContain('99')
  })
})
