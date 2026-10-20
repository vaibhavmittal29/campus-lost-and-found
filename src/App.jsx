import { useState } from 'react'
import { useItems } from './hooks/useItems.js'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PageContainer from './components/layout/PageContainer.jsx'
import ItemGrid from './components/items/ItemGrid.jsx'
import ItemCard from './components/items/ItemCard.jsx'
import ItemCardSkeleton from './components/items/ItemCardSkeleton.jsx'
import EmptyState from './components/ui/EmptyState.jsx'
import ErrorState from './components/ui/ErrorState.jsx'
import './App.css'

export default function App() {
  const { items, status, error, reload } = useItems()
  const [, setSelectedItem] = useState(null)

  const handleOpenItem = (item) => {
    // Will open ItemDetailDialog in Phase 7
    setSelectedItem(item)
  }

  const handlePostClick = () => {
    // Will open PostItemDialog in Phase 6
  }

  const handleResetDemo = () => {
    // Will be wired in Phase 8
  }

  return (
    <div className="app-layout">
      <a href="#results-content" className="skip-link">
        Skip to results
      </a>

      <Header onPostClick={handlePostClick} />

      <main className="main-content">
        <PageContainer>
          <section className="search-section" aria-label="Search items">
            <div className="search-placeholder">
              Search bar placeholder (Phase 4)
            </div>
          </section>

          <div className="content-grid">
            <aside className="filters-sidebar" aria-label="Filters">
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                Filter panel placeholder (Phase 4)
              </p>
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
                <EmptyState variant="no-items" onAction={handlePostClick} />
              )}

              {status === 'ready' && items.length > 0 && (
                <ItemGrid>
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onOpen={handleOpenItem}
                    />
                  ))}
                </ItemGrid>
              )}
            </section>
          </div>
        </PageContainer>
      </main>

      <Footer onResetDemo={handleResetDemo} />
    </div>
  )
}
