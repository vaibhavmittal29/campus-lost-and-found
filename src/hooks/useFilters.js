import { useState, useEffect, useCallback, useMemo } from 'react'

const DEFAULT_FILTERS = {
  q: '',
  category: 'all',
  location: 'all',
  status: 'all',
  sort: 'newest',
  ref: 'tt',
}

function parseUrlFilters() {
  if (typeof window === 'undefined') return { ...DEFAULT_FILTERS }

  const params = new URLSearchParams(window.location.search)
  return {
    q: params.get('q') || DEFAULT_FILTERS.q,
    category: params.get('category') || DEFAULT_FILTERS.category,
    location: params.get('location') || DEFAULT_FILTERS.location,
    status: params.get('status') || DEFAULT_FILTERS.status,
    sort: params.get('sort') || DEFAULT_FILTERS.sort,
    ref: params.get('ref') || DEFAULT_FILTERS.ref,
  }
}

function updateUrlParams(filters) {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    // Only include non-default and non-empty values
    if (value && value !== DEFAULT_FILTERS[key]) {
      params.set(key, value)
    }
  })

  // Preserve fail=1 if present in original URL for simulated testing
  const originalParams = new URLSearchParams(window.location.search)
  if (originalParams.has('fail')) {
    params.set('fail', originalParams.get('fail'))
  }

  const queryString = params.toString()
  const newRelativePath = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname

  window.history.replaceState(null, '', newRelativePath)
}

export function useFilters() {
  const [filters, setFiltersState] = useState(parseUrlFilters)

  // Sync to URL when filters change
  useEffect(() => {
    updateUrlParams(filters)
  }, [filters])

  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({
      ...DEFAULT_FILTERS,
      // Preserve sort & ref preferences if desired, but clear filter dimensions
      sort: DEFAULT_FILTERS.sort,
      ref: DEFAULT_FILTERS.ref,
    })
  }, [])

  const isFiltered = useMemo(() => {
    return (
      Boolean(filters.q) ||
      filters.category !== 'all' ||
      filters.location !== 'all' ||
      filters.status !== 'all'
    )
  }, [filters])

  return {
    filters,
    setFilter,
    resetFilters,
    isFiltered,
    DEFAULT_FILTERS,
  }
}
