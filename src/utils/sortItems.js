import { distanceBetween } from './distance.js'
import { scoreItem } from './relevance.js'

/**
 * Pure sorting function for lost & found items.
 * Guarantees no mutation of the source array.
 */
export function sortItems(items, sortMode = 'newest', options = {}) {
  if (!Array.isArray(items)) return []

  const { q = '', ref = 'tt' } = options
  const list = [...items]

  switch (sortMode) {
    case 'newest':
      return list.sort((a, b) => {
        const timeA = new Date(a.postedAt || a.date).getTime()
        const timeB = new Date(b.postedAt || b.date).getTime()
        return timeB - timeA
      })

    case 'oldest':
      return list.sort((a, b) => {
        const timeA = new Date(a.postedAt || a.date).getTime()
        const timeB = new Date(b.postedAt || b.date).getTime()
        return timeA - timeB
      })

    case 'nearest':
      return list.sort((a, b) => {
        const distA = distanceBetween(a.locationId, ref)
        const distB = distanceBetween(b.locationId, ref)
        if (distA !== distB) {
          return distA - distB
        }
        // Tie-break with newest
        const timeA = new Date(a.postedAt || a.date).getTime()
        const timeB = new Date(b.postedAt || b.date).getTime()
        return timeB - timeA
      })

    case 'relevance':
      return list.sort((a, b) => {
        const scoreA = scoreItem(a, q)
        const scoreB = scoreItem(b, q)
        if (scoreA !== scoreB) {
          return scoreB - scoreA
        }
        // Tie-break with newest
        const timeA = new Date(a.postedAt || a.date).getTime()
        const timeB = new Date(b.postedAt || b.date).getTime()
        return timeB - timeA
      })

    default:
      return list
  }
}
