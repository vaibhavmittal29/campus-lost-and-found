import { describe, it, expect } from 'vitest'
import { sortItems } from '../src/utils/sortItems.js'

describe('sortItems pure utility', () => {
  const sampleItems = [
    {
      id: 'item1',
      title: 'Item A',
      locationId: 'sjt', // (58, 46)
      postedAt: '2026-10-10T10:00:00.000Z',
    },
    {
      id: 'item2',
      title: 'Item B',
      locationId: 'tt', // (50, 50)
      postedAt: '2026-10-12T10:00:00.000Z',
    },
    {
      id: 'item3',
      title: 'Item C',
      locationId: 'gate', // (12, 85)
      postedAt: '2026-10-11T10:00:00.000Z',
    },
  ]

  it('sorts newest first by default', () => {
    const result = sortItems(sampleItems, 'newest')
    expect(result.map((i) => i.id)).toEqual(['item2', 'item3', 'item1'])
  })

  it('sorts oldest first correctly', () => {
    const result = sortItems(sampleItems, 'oldest')
    expect(result.map((i) => i.id)).toEqual(['item1', 'item3', 'item2'])
  })

  it('sorts by nearest location relative to ref', () => {
    // If ref is 'tt', item2 (at tt) is nearest, then item1 (sjt), then item3 (gate)
    const result = sortItems(sampleItems, 'nearest', { ref: 'tt' })
    expect(result.map((i) => i.id)).toEqual(['item2', 'item1', 'item3'])
  })

  it('guarantees no mutation of the source array', () => {
    const original = [...sampleItems]
    sortItems(sampleItems, 'oldest')
    expect(sampleItems).toEqual(original)
  })
})
