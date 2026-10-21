import { X } from 'lucide-react'
import { getLocation } from '../../constants/locations.js'
import { getStatus } from '../../constants/statuses.js'
import './ActiveFilterChips.css'

export default function ActiveFilterChips({ filters, onRemove }) {
  const chips = []

  if (filters.q) {
    chips.push({
      key: 'q',
      label: `Search: "${filters.q}"`,
    })
  }

  if (filters.status && filters.status !== 'all') {
    const statusObj = getStatus(filters.status)
    chips.push({
      key: 'status',
      label: `Status: ${statusObj.label}`,
    })
  }

  if (filters.category && filters.category !== 'all') {
    chips.push({
      key: 'category',
      label: `Category: ${filters.category}`,
    })
  }

  if (filters.location && filters.location !== 'all') {
    const loc = getLocation(filters.location)
    chips.push({
      key: 'location',
      label: `Location: ${loc.label}`,
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="active-chips" aria-label="Active filters">
      <span className="active-chips__label">Active filters:</span>
      <ul className="active-chips__list">
        {chips.map((chip) => (
          <li key={chip.key} className="active-chip">
            <span className="active-chip__text">{chip.label}</span>
            <button
              type="button"
              className="active-chip__remove"
              onClick={() => onRemove(chip.key)}
              aria-label={`Remove filter ${chip.label}`}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
