import { getLocation } from '../constants/locations.js'

/**
 * Pure filtering function for lost & found items.
 * Does not mutate the source array.
 */
export function filterItems(items, filters = {}) {
  if (!Array.isArray(items)) return []

  const {
    q = '',
    category = 'all',
    location = 'all',
    status = 'all',
  } = filters

  const trimmedQ = (q || '').trim().toLowerCase()
  const searchWords = trimmedQ ? trimmedQ.split(/\s+/).filter(Boolean) : []

  return items.filter((item) => {
    // 1. Status filter
    if (status && status !== 'all' && item.status !== status) {
      return false
    }

    // 2. Category filter
    if (category && category !== 'all' && item.category !== category) {
      return false
    }

    // 3. Location filter
    if (location && location !== 'all' && item.locationId !== location) {
      return false
    }

    // 4. Search query (all words must match in searchable text - AND logic)
    if (searchWords.length > 0) {
      const locLabel = getLocation(item.locationId).label.toLowerCase()
      const title = (item.title || '').toLowerCase()
      const desc = (item.description || '').toLowerCase()
      const cat = (item.category || '').toLowerCase()

      const searchableText = `${title} ${desc} ${cat} ${locLabel}`

      const allWordsMatch = searchWords.every((word) =>
        searchableText.includes(word),
      )

      if (!allWordsMatch) {
        return false
      }
    }

    return true
  })
}
