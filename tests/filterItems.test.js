import { describe, it, expect } from 'vitest'
import { filterItems } from '../src/utils/filterItems.js'

describe('filterItems pure utility', () => {
  const sampleItems = [
    {
      id: '1',
      title: 'Blue Water Bottle',
      category: 'Bottles & Lunch Boxes',
      locationId: 'tt',
      status: 'lost',
      description: 'Steel 750ml bottle with VIT logo',
    },
    {
      id: '2',
      title: 'Black Leather Wallet',
      category: 'Wallets & Bags',
      locationId: 'sjt',
      status: 'found',
      description: 'Contains hostel key card',
    },
    {
      id: '3',
      title: 'Black Wallet',
      category: 'Wallets & Bags',
      locationId: 'foodys',
      status: 'claimed',
      description: 'Found near cafeteria bench',
    },
  ]

  it('returns all items when filter object is empty or all defaults', () => {
    const result = filterItems(sampleItems, {})
    expect(result).toHaveLength(3)
  })

  it('filters by status correctly', () => {
    const lostOnly = filterItems(sampleItems, { status: 'lost' })
    expect(lostOnly).toHaveLength(1)
    expect(lostOnly[0].id).toBe('1')

    const claimedOnly = filterItems(sampleItems, { status: 'claimed' })
    expect(claimedOnly).toHaveLength(1)
    expect(claimedOnly[0].id).toBe('3')
  })

  it('filters by category correctly', () => {
    const wallets = filterItems(sampleItems, { category: 'Wallets & Bags' })
    expect(wallets).toHaveLength(2)
  })

  it('filters by campus location correctly', () => {
    const sjtItems = filterItems(sampleItems, { location: 'sjt' })
    expect(sjtItems).toHaveLength(1)
    expect(sjtItems[0].id).toBe('2')
  })

  it('performs multi-word AND search across titles and descriptions', () => {
    // "black" matches #2 and #3, but "leather" only matches #2
    const result = filterItems(sampleItems, { q: 'black leather' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('matches location label in search query', () => {
    const result = filterItems(sampleItems, { q: 'cafeteria' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('3')
  })

  it('returns empty array when no items match the criteria', () => {
    const result = filterItems(sampleItems, { q: 'umbrella' })
    expect(result).toHaveLength(0)
  })

  it('does not mutate the source items array', () => {
    const clone = [...sampleItems]
    filterItems(sampleItems, { status: 'lost' })
    expect(sampleItems).toEqual(clone)
  })
})
