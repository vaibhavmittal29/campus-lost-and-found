import ActiveFilterChips from './ActiveFilterChips.jsx'
import './ResultsSummary.css'

export default function ResultsSummary({
  count,
  total,
  filters,
  onRemoveFilter,
  sortSlot = null,
}) {
  return (
    <div className="results-summary">
      <div className="results-summary__top">
        <div
          className="results-summary__count"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing <strong>{count}</strong> of {total} campus items
        </div>

        {sortSlot && <div className="results-summary__sort">{sortSlot}</div>}
      </div>

      <ActiveFilterChips filters={filters} onRemove={onRemoveFilter} />
    </div>
  )
}
