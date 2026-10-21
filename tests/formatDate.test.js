import { describe, it, expect } from 'vitest'
import { formatDate, timeAgo } from '../src/utils/formatDate.js'

describe('formatDate utilities', () => {
  it('formats dates in readable Indian English format', () => {
    const formatted = formatDate('2026-10-15')
    expect(formatted).toMatch(/15\s+Oct\s+2026/)
  })

  it('calculates friendly relative time', () => {
    const now = new Date()
    expect(timeAgo(now.toISOString())).toBe('just now')

    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    expect(timeAgo(twoDaysAgo.toISOString())).toContain('2 days ago')
  })

  it('handles null or invalid date safely', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate('invalid-date')).toBe('')
    expect(timeAgo(null)).toBe('')
    expect(timeAgo('invalid-date')).toBe('')
  })
})
