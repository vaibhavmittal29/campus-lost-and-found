import { describe, it, expect } from 'vitest'
import { scoreItem } from '../src/utils/relevance.js'

describe('relevance scoreItem utility', () => {
  const itemExactTitle = {
    title: 'Blue Water Bottle',
    category: 'Bottles & Lunch Boxes',
    locationId: 'tt',
    description: 'Found on table',
  }

  const itemDescriptionOnly = {
    title: 'Gym Flask',
    category: 'Other',
    locationId: 'sports',
    description: 'A blue water bottle lost during evening',
  }

  it('ranks title matches higher than description-only matches', () => {
    const scoreTitle = scoreItem(itemExactTitle, 'bottle')
    const scoreDesc = scoreItem(itemDescriptionOnly, 'bottle')

    expect(scoreTitle).toBeGreaterThan(scoreDesc)
  })

  it('rewards word-start boundary matches', () => {
    const scoreStart = scoreItem(itemExactTitle, 'water')
    expect(scoreStart).toBeGreaterThanOrEqual(5)
  })

  it('returns 0 for empty query', () => {
    expect(scoreItem(itemExactTitle, '')).toBe(0)
    expect(scoreItem(itemExactTitle, '   ')).toBe(0)
  })
})
