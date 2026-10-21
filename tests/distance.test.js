import { describe, it, expect } from 'vitest'
import { distanceBetween, formatDistanceMeters } from '../src/utils/distance.js'

describe('distance calculation utility', () => {
  it('returns zero distance for identical campus locations', () => {
    expect(distanceBetween('tt', 'tt')).toBe(0)
  })

  it('is symmetric: distance(A, B) === distance(B, A)', () => {
    const distAB = distanceBetween('tt', 'gate')
    const distBA = distanceBetween('gate', 'tt')
    expect(distAB).toBeCloseTo(distBA, 5)
  })

  it('formats friendly approximate walking meters', () => {
    expect(formatDistanceMeters(0)).toBe('Here')
    expect(formatDistanceMeters(25)).toBe('≈ 100 m')
  })
})
