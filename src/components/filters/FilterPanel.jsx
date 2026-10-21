import { RotateCcw } from 'lucide-react'
import { CATEGORIES } from '../../constants/categories.js'
import { LOCATIONS } from '../../constants/locations.js'
import { STATUSES } from '../../constants/statuses.js'
import Button from '../ui/Button.jsx'
import './FilterPanel.css'

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  counts = {},
  className = '',
  onApply = null,
  resultCount = null,
}) {
  const isFiltered =
    Boolean(filters.q) ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.status !== 'all'

  return (
    <div className={`filter-panel ${className}`.trim()}>
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onReset}
          disabled={!isFiltered}
          className="filter-panel__reset-btn"
          title="Reset all filters"
        >
          Reset
        </Button>
      </div>

      {/* 1. Status Segmented Control */}
      <fieldset className="filter-group">
        <legend className="filter-group__label">Status</legend>
        <div className="segmented-control" role="radiogroup">
          <label
            className={`segmented-control__item ${
              filters.status === 'all' ? 'segmented-control__item--active' : ''
            }`}
          >
            <input
              type="radio"
              name="status-filter"
              value="all"
              checked={filters.status === 'all'}
              onChange={() => onChange('status', 'all')}
              className="visually-hidden"
            />
            <span>All</span>
            {counts.status?.all !== undefined && (
              <span className="count-pill">{counts.status.all}</span>
            )}
          </label>

          {STATUSES.map((status) => {
            const isActive = filters.status === status.id
            const count = counts.status?.[status.id]
            return (
              <label
                key={status.id}
                className={`segmented-control__item ${
                  isActive ? 'segmented-control__item--active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="status-filter"
                  value={status.id}
                  checked={isActive}
                  onChange={() => onChange('status', status.id)}
                  className="visually-hidden"
                />
                <span>{status.label}</span>
                {count !== undefined && <span className="count-pill">{count}</span>}
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* 2. Category Chips */}
      <div className="filter-group">
        <label className="filter-group__label" id="category-group-label">
          Category
        </label>
        <div
          className="category-chips"
          role="group"
          aria-labelledby="category-group-label"
        >
          <button
            type="button"
            className={`category-chip ${
              filters.category === 'all' ? 'category-chip--active' : ''
            }`}
            onClick={() => onChange('category', 'all')}
            aria-pressed={filters.category === 'all'}
          >
            <span>All Categories</span>
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = filters.category === cat.name
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${isActive ? 'category-chip--active' : ''}`}
                onClick={() => onChange('category', isActive ? 'all' : cat.name)}
                aria-pressed={isActive}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{cat.name}</span>
                {counts.categories?.[cat.name] !== undefined && (
                  <span className="count-pill">
                    {counts.categories[cat.name]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Location Select */}
      <div className="filter-group">
        <label htmlFor="filter-location-select" className="filter-group__label">
          Campus Location
        </label>
        <div className="select-wrapper">
          <select
            id="filter-location-select"
            className="filter-select"
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
          >
            <option value="all">All Locations on Campus</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional drawer apply footer */}
      {onApply && (
        <div className="filter-panel__drawer-footer">
          <Button
            variant="primary"
            size="md"
            onClick={onApply}
            className="filter-panel__apply-btn"
          >
            {resultCount !== null
              ? `Show ${resultCount} Results`
              : 'Apply Filters'}
          </Button>
        </div>
      )}
    </div>
  )
}
