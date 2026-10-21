import { getLocation } from '../constants/locations.js'

/**
 * Computes a relevance score for a given item based on the search query.
 * Scoring rules:
 * - Title word-start match: +5
 * - Title contains: +3
 * - Category or Location label contains: +2
 * - Description contains: +1
 */
export function scoreItem(item, q = '') {
  if (!item || !q) return 0

  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  const title = (item.title || '').toLowerCase()
  const desc = (item.description || '').toLowerCase()
  const cat = (item.category || '').toLowerCase()
  const locLabel = getLocation(item.locationId).label.toLowerCase()

  let totalScore = 0

  words.forEach((word) => {
    // Word boundary start match in title (e.g. "wal" matches "Wallet")
    const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(word)}`, 'i')
    if (wordBoundaryRegex.test(title)) {
      totalScore += 5
    } else if (title.includes(word)) {
      totalScore += 3
    }

    if (cat.includes(word) || locLabel.includes(word)) {
      totalScore += 2
    }

    if (desc.includes(word)) {
      totalScore += 1
    }
  })

  return totalScore
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
