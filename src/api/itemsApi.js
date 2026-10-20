const STORAGE_KEYS = {
  USER_ITEMS: 'clf:v1:userItems',
  CLAIMS: 'clf:v1:claims',
}

/**
 * Helper to safely read from localStorage
 */
function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.warn(`[itemsApi] Error reading localStorage key "${key}":`, err)
    return fallback
  }
}

/**
 * Helper to safely write to localStorage
 */
function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`[itemsApi] Error writing to localStorage key "${key}":`, err)
  }
}

/**
 * Converts daysAgo into real calendar date and ISO postedAt
 */
function normalizeSeedItem(item) {
  const daysAgo = typeof item.daysAgo === 'number' ? item.daysAgo : 0
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const dateStr = `${yyyy}-${mm}-${dd}`
  const postedAt = new Date(`${dateStr}T09:30:00.000Z`).toISOString()

  return {
    ...item,
    date: item.date || dateStr,
    postedAt: item.postedAt || postedAt,
  }
}

/**
 * Delay simulation helper
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetches all items, merging seed JSON, user posts, and claim overrides
 */
export async function fetchItems() {
  // Simulated network latency (600–900 ms)
  const randomLatency = Math.floor(Math.random() * 300) + 600
  await delay(randomLatency)

  // Failure simulation for testing error states
  if (typeof window !== 'undefined' && window.location.search.includes('fail=1')) {
    throw new Error('Simulated network error (?fail=1). Please retry.')
  }

  // Safe fetch using Vite's BASE_URL
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  const jsonUrl = `${basePath}data/items.json`

  const response = await fetch(jsonUrl)
  if (!response.ok) {
    throw new Error(`Failed to load items. Status: ${response.status}`)
  }

  const rawSeed = await response.json()
  const seedItems = rawSeed.map(normalizeSeedItem)

  // Merge with localStorage userItems and claim overrides
  const userItems = getStoredJson(STORAGE_KEYS.USER_ITEMS, [])
  const claimsMap = getStoredJson(STORAGE_KEYS.CLAIMS, {})

  const allItems = [...userItems, ...seedItems].map((item) => {
    if (claimsMap[item.id]) {
      return {
        ...item,
        status: 'claimed',
        claim: claimsMap[item.id],
      }
    }
    return item
  })

  return allItems
}

/**
 * Creates a new item posted by the user
 */
export async function createItem(payload) {
  await delay(500)

  const now = new Date()
  const newItem = {
    id: `itm_${Date.now()}`,
    title: payload.title.trim(),
    category: payload.category,
    locationId: payload.locationId,
    date: payload.date || now.toISOString().split('T')[0],
    postedAt: now.toISOString(),
    status: payload.type || 'lost',
    description: payload.description.trim(),
    image: payload.image || null,
    contact: payload.contact.trim(),
    claim: null,
  }

  const userItems = getStoredJson(STORAGE_KEYS.USER_ITEMS, [])
  const updated = [newItem, ...userItems]
  setStoredJson(STORAGE_KEYS.USER_ITEMS, updated)

  return newItem
}

/**
 * Submits a claim for an item
 */
export async function claimItem(id, claimPayload) {
  await delay(500)

  const claimsMap = getStoredJson(STORAGE_KEYS.CLAIMS, {})
  const claimRecord = {
    name: claimPayload.name.trim(),
    contact: claimPayload.contact.trim(),
    message: claimPayload.message.trim(),
    claimedAt: new Date().toISOString(),
  }

  claimsMap[id] = claimRecord
  setStoredJson(STORAGE_KEYS.CLAIMS, claimsMap)

  return { id, claim: claimRecord, status: 'claimed' }
}

/**
 * Clears demo localStorage data
 */
export function resetDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_ITEMS)
    localStorage.removeItem(STORAGE_KEYS.CLAIMS)
  } catch (err) {
    console.warn('[itemsApi] Error clearing demo localStorage:', err)
  }
}
