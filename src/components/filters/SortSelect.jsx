import { ArrowUpDown, Navigation } from 'lucide-react'
import { SORT_OPTIONS } from '../../constants/sortOptions.js'
import { LOCATIONS } from '../../constants/locations.js'
import './SortSelect.css'

export default function SortSelect({
  value = 'newest',
  onChange,
  hasQuery = false,
  referenceLocation = 'tt',
  onReferenceChange,
}) {
  return (
    <div className="sort-controls">
      <div className="sort-select-wrapper">
        <label htmlFor="sort-select" className="sort-label">
          <ArrowUpDown size={14} className="sort-icon" aria-hidden="true" />
          <span>Sort by:</span>
        </label>
        <select
          id="sort-select"
          className="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => {
            const isRelevance = opt.id === 'relevance'
            const isDisabled = isRelevance && !hasQuery

            return (
              <option
                key={opt.id}
                value={opt.id}
                disabled={isDisabled}
                title={isDisabled ? 'Type a search term to sort by Best match' : ''}
              >
                {opt.label} {isDisabled ? '(search query needed)' : ''}
              </option>
            )
          })}
        </select>
      </div>

      {value === 'nearest' && (
        <div className="ref-location-wrapper">
          <label htmlFor="ref-location-select" className="ref-location-label">
            <Navigation size={13} className="ref-location-icon" aria-hidden="true" />
            <span>Near:</span>
          </label>
          <select
            id="ref-location-select"
            className="ref-location-select"
            value={referenceLocation}
            onChange={(e) => onReferenceChange && onReferenceChange(e.target.value)}
            aria-label="Reference location for nearest sort"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
