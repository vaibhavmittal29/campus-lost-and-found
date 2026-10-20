import { useItems } from './hooks/useItems.js'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PageContainer from './components/layout/PageContainer.jsx'
import './App.css'

export default function App() {
  const { items, status, error, reload } = useItems()

  const handlePostClick = () => {
    // Will be wired in Phase 6
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
                <div className="results-placeholder">
                  <p>Loading campus items...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="results-placeholder" style={{ borderColor: 'var(--color-lost-fg)' }}>
                  <p style={{ color: 'var(--color-lost-fg)', marginBottom: 'var(--space-3)' }}>
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={reload}
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-surface)',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {status === 'ready' && (
                <div className="results-placeholder" style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    Loaded {items.length} items successfully (Phase 2 temporary view):
                  </p>
                  <pre
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      fontSize: 'var(--text-sm)',
                      background: 'var(--color-bg)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {items
                      .map(
                        (it, idx) =>
                          `${idx + 1}. [${it.status.toUpperCase()}] ${it.title} (${it.category}) — ${it.date}`,
                      )
                      .join('\n')}
                  </pre>
                </div>
              )}
            </section>
          </div>
        </PageContainer>
      </main>

      <Footer onResetDemo={handleResetDemo} />
    </div>
  )
}
