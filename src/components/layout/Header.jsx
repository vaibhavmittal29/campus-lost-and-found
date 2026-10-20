import { PlusCircle } from 'lucide-react'
import Button from '../ui/Button.jsx'
import './Header.css'

export default function Header({ onPostClick }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__brand">
          <div className="header__logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path
                d="M16 7c-3.31 0-6 2.69-6 6 0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="var(--color-surface)"
              />
            </svg>
          </div>
          <div className="header__titles">
            <h1 className="header__title">Campus Lost &amp; Found</h1>
            <p className="header__subtitle">Reunite campus belongings · VIT Vellore</p>
          </div>
        </div>

        <div className="header__actions">
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={onPostClick}
            className="header__post-btn"
          >
            Post an item
          </Button>
        </div>
      </div>
    </header>
  )
}
