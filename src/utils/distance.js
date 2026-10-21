import { getLocation } from '../constants/locations.js'

/**
 * Calculates Euclidean distance between two campus location IDs
 * using the normalized campus grid (0–100 scale).
 */
export function distanceBetween(locationIdA, locationIdB) {
  if (locationIdA === locationIdB) return 0

  const locA = getLocation(locationIdA)
  const locB = getLocation(locationIdB)

  const dx = locA.x - locB.x
  const dy = locA.y - locB.y

  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Converts grid units to approximate real-world campus walking meters (roughly x4).
 * Returns a friendly string like "≈ 120 m away".
 */
export function formatDistanceMeters(distanceUnits) {
  if (distanceUnits === 0) return 'Here'
  const meters = Math.round(distanceUnits * 4)
  return `≈ ${meters} m`
}
