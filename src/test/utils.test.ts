import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getStockStatus, clamp } from '../lib/utils'

describe('formatCurrency', () => {
  it('formats a positive number as USD currency', () => {
    expect(formatCurrency(49.99)).toBe('$49.99')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
})

describe('formatDate', () => {
  it('formats an ISO date string to a readable format', () => {
    const result = formatDate('2024-01-15T10:00:00.000Z')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2024/)
  })
})

describe('getStockStatus', () => {
  it('returns Out of Stock when stock is 0', () => {
    const result = getStockStatus(0)
    expect(result.label).toBe('Out of Stock')
  })

  it('returns Low Stock when stock is less than 10', () => {
    const result = getStockStatus(5)
    expect(result.label).toBe('Low Stock')
  })

  it('returns In Stock when stock is 10 or more', () => {
    const result = getStockStatus(10)
    expect(result.label).toBe('In Stock')
    const result2 = getStockStatus(100)
    expect(result2.label).toBe('In Stock')
  })
})

describe('clamp', () => {
  it('clamps a value below the min', () => {
    expect(clamp(-5, 0, 100)).toBe(0)
  })

  it('clamps a value above the max', () => {
    expect(clamp(150, 0, 100)).toBe(100)
  })

  it('returns the value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })
})
