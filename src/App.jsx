import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useItems } from './hooks/useItems.js'
import { useFilters } from './hooks/useFilters.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { filterItems } from './utils/filterItems.js'
import { sortItems } from './utils/sortItems.js'
import { distanceBetween, formatDistanceMeters } from './utils/distance.js'
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
import EmptyState from './components/ui/EmptyState.jsx'
import ErrorState from './components/ui/ErrorState.jsx'
import './App.css'

export default function App() {
  const { items, status, error, reload, addItem, claim } = useItems()
  const { filters, setFilter, resetFilters } = useFilters()

  const [isPostOpen, setIsPostOpen] = useState(false)
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
    const newItem = await addItem(payload)
    setNewlyPostedId(newItem.id)

    // Smooth scroll to top to see newly created item
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Highlight card for 2.5 seconds
    setTimeout(() => {
      setNewlyPostedId(null)
    }, 2500)
  }

  const handleClaimItem = async (id, claimPayload) => {
    await claim(id, claimPayload)
  }

  const handleResetDemo = () => {
    // Will be wired in Phase 8
  }

  return (
    <div className="app-layout">
      <a href="#results-content" className="skip-link">
        Skip to results
      </a>

      <Header onPostClick={() => setIsPostOpen(true)} />

      <main className="main-content">
        <PageContainer>
          <section className="search-section" aria-label="Search items">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              onClear={handleClearSearch}
            />
          </section>

          <div className="content-grid">
            <aside className="filters-sidebar" aria-label="Filters">
              <FilterPanel
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
                    sortSlot={
                      <SortSelect
                        value={filters.sort}
                        onChange={(sortVal) => setFilter('sort', sortVal)}
                        hasQuery={Boolean(filters.q)}
                        referenceLocation={filters.ref}
                        onReferenceChange={(refVal) => setFilter('ref', refVal)}
                      />
                    }
                  />

                  {visibleItems.length === 0 ? (
                    <EmptyState
                      variant="no-results"
                      title="No matching campus items"
                      description="We couldn't find anything matching your active filters or search terms. Try clearing some filters or searching for a broader term."
                      actionLabel="Clear all filters"
                      onAction={resetFilters}
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

      {/* Floating Action Button on mobile */}
      <button
        type="button"
        className="floating-post-btn"
        onClick={() => setIsPostOpen(true)}
        aria-label="Post a new lost or found item"
      >
        <Plus size={28} aria-hidden="true" />
      </button>

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
    </div>
  )
}
