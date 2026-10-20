import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PageContainer from './components/layout/PageContainer.jsx'
import './App.css'

export default function App() {
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
              <div className="results-placeholder">
                <p>Items grid placeholder (Phase 3)</p>
              </div>
            </section>
          </div>
        </PageContainer>
      </main>

      <Footer onResetDemo={handleResetDemo} />
    </div>
  )
}
