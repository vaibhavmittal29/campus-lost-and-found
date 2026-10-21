import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { useItems } from './hooks/useItems.js'
import { useFilters } from './hooks/useFilters.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { useMediaQuery } from './hooks/useMediaQuery.js'
import { useToast } from './hooks/useToast.js'
import { filterItems } from './utils/filterItems.js'
import { sortItems } from './utils/sortItems.js'
import { distanceBetween, formatDistanceMeters } from './utils/distance.js'
import { resetDemoData } from './api/itemsApi.js'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PageContainer from './components/layout/PageContainer.jsx'
import SearchBar from './components/filters/SearchBar.jsx'
import FilterPanel from './components/filters/FilterPanel.jsx'
import ResultsSummary from './components/filters/ResultsSummary.jsx'
import SortSelect from './components/filters/SortSelect.jsx'
import ItemGrid from './components/items/ItemGrid.jsx'
import ItemCard from './components/items/ItemCard.jsx'
import ItemCardSkeleton from './components/items/ItemCardSkeleton.jsx'
import ItemDetailDialog from './components/items/ItemDetailDialog.jsx'
import PostItemDialog from './components/post/PostItemDialog.jsx'
import Dialog from './components/ui/Dialog.jsx'
import EmptyState from './components/ui/EmptyState.jsx'
import ErrorState from './components/ui/ErrorState.jsx'
import ToastContainer from './components/ui/Toast.jsx'
import './App.css'

export default function App() {
  const { items, status, error, reload, addItem, claim } = useItems()
  const { filters, setFilter, resetFilters, isFiltered } = useFilters()
  const { toast } = useToast()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [isPostOpen, setIsPostOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [newlyPostedId, setNewlyPostedId] = useState(null)

  // Raw search input state for instant typing responsiveness
  const [searchText, setSearchText] = useState(filters.q || '')
  const debouncedSearchText = useDebouncedValue(searchText, 300)
  const hadQueryRef = useRef(Boolean(filters.q))

  // Deep-link query check on load (?item=itm_001)
  useEffect(() => {
    if (status === 'ready' && items.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const itemId = params.get('item')
      if (itemId && !selectedItemId) {
        const found = items.find((i) => i.id === itemId)
        if (found) {
          setSelectedItemId(found.id)
        }
      }
    }
  }, [status, items, selectedItemId])

  // Sync selected item in URL
  const handleOpenItem = (item) => {
    setSelectedItemId(item.id)
    const params = new URLSearchParams(window.location.search)
    params.set('item', item.id)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }

  const handleCloseDetail = () => {
    setSelectedItemId(null)
    const params = new URLSearchParams(window.location.search)
    params.delete('item')
    const qs = params.toString()
    const newPath = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', newPath)
  }

  // Keep debounced search query synced with filters
  useEffect(() => {
    if (debouncedSearchText !== filters.q) {
      setFilter('q', debouncedSearchText)

      // Auto-switch to "relevance" when search term is first entered
      if (debouncedSearchText && !hadQueryRef.current) {
        setFilter('sort', 'relevance')
        hadQueryRef.current = true
      } else if (!debouncedSearchText) {
        hadQueryRef.current = false
        if (filters.sort === 'relevance') {
          setFilter('sort', 'newest')
        }
      }
    }
  }, [debouncedSearchText, filters.q, filters.sort, setFilter])

  // Sync back if filters.q is cleared externally (e.g. chip or reset)
  useEffect(() => {
    if (filters.q !== searchText && filters.q === '') {
      setSearchText('')
      hadQueryRef.current = false
      if (filters.sort === 'relevance') {
        setFilter('sort', 'newest')
      }
    }
  }, [filters.q, searchText, filters.sort, setFilter])

  // Category & status counts
  const counts = useMemo(() => {
    const statusCounts = { all: items.length, lost: 0, found: 0, claimed: 0 }
    const categoryCounts = {}

    items.forEach((item) => {
      if (statusCounts[item.status] !== undefined) {
        statusCounts[item.status] += 1
      }
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
    })

    return { status: statusCounts, categories: categoryCounts }
  }, [items])

  // Active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.status !== 'all') count += 1
    if (filters.category !== 'all') count += 1
    if (filters.location !== 'all') count += 1
    return count
  }, [filters])

  // Pure filtering followed by pure sorting
  const visibleItems = useMemo(() => {
    const filtered = filterItems(items, filters)
    return sortItems(filtered, filters.sort, {
      q: filters.q,
      ref: filters.ref,
    })
  }, [items, filters])

  // Selected item object lookup
  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || null
  }, [items, selectedItemId])

  const handleClearSearch = () => {
    setSearchText('')
    setFilter('q', '')
  }

  const handleRemoveChip = (key) => {
    if (key === 'q') {
      handleClearSearch()
    } else {
      setFilter(key, 'all')
    }
  }

  const handleCreatedItem = async (payload) => {
    try {
      const newItem = await addItem(payload)
      setNewlyPostedId(newItem.id)

      // Smooth scroll to top to view the new item
      window.scrollTo({ top: 0, behavior: 'smooth' })

      toast.success('Your item has been posted successfully!')

      // Highlight card for 2.5 seconds
      setTimeout(() => {
        setNewlyPostedId(null)
      }, 2500)
    } catch (err) {
      toast.error(err.message || 'Failed to post item.')
    }
  }

  const handleClaimItem = async (id, claimPayload) => {
    try {
      await claim(id, claimPayload)
      toast.success('Claim submitted! Direct contact details are now revealed.')
    } catch (err) {
      toast.error(err.message || 'Failed to submit claim.')
    }
  }

  const handleResetDemo = async () => {
    const confirmed = window.confirm(
      'Reset all demo data? This will restore the original 24 items and clear user posts and claims.',
    )
    if (!confirmed) return

    resetDemoData()
    resetFilters()
    setSearchText('')
    await reload()
    toast.info('Demo items restored to factory default.')
  }

  const sortSelectComponent = (
    <SortSelect
      value={filters.sort}
      onChange={(sortVal) => setFilter('sort', sortVal)}
      hasQuery={Boolean(filters.q)}
      referenceLocation={filters.ref}
      onReferenceChange={(refVal) => setFilter('ref', refVal)}
    />
  )

  return (
    <div className="app-layout">
      <a href="#results-content" className="skip-link">
        Skip to results
      </a>

      <Header onPostClick={() => setIsPostOpen(true)} />

      <main className="main-content">
        <PageContainer>
          <section className="search-section" aria-label="Search and filter items">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              onClear={handleClearSearch}
            />

            {/* Mobile / Tablet toolbar (<1024px) */}
            <div className="mobile-toolbar">
              <button
                type="button"
                className="mobile-filter-trigger"
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-label="Open filter options"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="mobile-filter-trigger__badge">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="mobile-toolbar__sort">
                {sortSelectComponent}
              </div>
            </div>
          </section>

          <div className="content-grid">
            {/* Desktop Sticky Sidebar (>=1024px) */}
            <aside className="filters-sidebar" aria-label="Filters">
              <FilterPanel
                className="filter-panel--sticky"
                filters={filters}
                onChange={setFilter}
                onReset={resetFilters}
                counts={counts}
              />
            </aside>

            <section
              id="results-content"
              className="results-section"
              aria-label="Lost and found results"
              tabIndex="-1"
            >
              {status === 'loading' && (
                <ItemGrid>
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <ItemCardSkeleton key={`skeleton-${idx}`} />
                  ))}
                </ItemGrid>
              )}

              {status === 'error' && (
                <ErrorState message={error} onRetry={reload} />
              )}

              {status === 'ready' && items.length === 0 && (
                <EmptyState
                  variant="no-items"
                  title="No campus items found"
                  description="Be the first to report a lost or found item at VIT Vellore."
                  actionLabel="Post an item"
                  onAction={() => setIsPostOpen(true)}
                />
              )}

              {status === 'ready' && items.length > 0 && (
                <>
                  <ResultsSummary
                    count={visibleItems.length}
                    total={items.length}
                    filters={filters}
                    onRemoveFilter={handleRemoveChip}
                    sortSlot={isDesktop ? sortSelectComponent : null}
                  />

                  {visibleItems.length === 0 ? (
                    <EmptyState
                      variant="no-results"
                      title={
                        filters.q && !isFiltered
                          ? `No items found for "${filters.q}"`
                          : 'No matching campus items'
                      }
                      description={
                        filters.q
                          ? 'Check your spelling or try broader keywords like "bottle", "card", or "key".'
                          : 'Try clearing one or more active filters to broaden your search.'
                      }
                      actionLabel={filters.q && !isFiltered ? 'Clear search' : 'Clear all filters'}
                      onAction={filters.q && !isFiltered ? handleClearSearch : resetFilters}
                    />
                  ) : (
                    <ItemGrid>
                      {visibleItems.map((item) => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onOpen={handleOpenItem}
                          isHighlighted={item.id === newlyPostedId}
                          distanceHint={
                            filters.sort === 'nearest'
                              ? formatDistanceMeters(
                                  distanceBetween(item.locationId, filters.ref),
                                )
                              : null
                          }
                        />
                      ))}
                    </ItemGrid>
                  )}
                </>
              )}
            </section>
          </div>
        </PageContainer>
      </main>

      {/* Floating Action Button on mobile (<640px) */}
      <button
        type="button"
        className="floating-post-btn"
        onClick={() => setIsPostOpen(true)}
        aria-label="Post a new lost or found item"
      >
        <Plus size={28} aria-hidden="true" />
      </button>

      {/* Mobile Filters Drawer Modal (<1024px) */}
      <Dialog
        open={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Filter Campus Items"
        maxWidth="500px"
      >
        <FilterPanel
          filters={filters}
          onChange={setFilter}
          onReset={resetFilters}
          counts={counts}
          onApply={() => setIsMobileDrawerOpen(false)}
          resultCount={visibleItems.length}
        />
      </Dialog>

      {/* Post item modal dialog */}
      <PostItemDialog
        open={isPostOpen}
        onClose={() => setIsPostOpen(false)}
        onCreated={handleCreatedItem}
      />

      {/* Item detail & claim dialog */}
      <ItemDetailDialog
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={handleCloseDetail}
        onClaimed={handleClaimItem}
      />

      <Footer onResetDemo={handleResetDemo} />

      {/* Global toast notification system */}
      <ToastContainer />
    </div>
  )
}
