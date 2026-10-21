import { Search, X } from 'lucide-react'
import './SearchBar.css'

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by item, place or category…',
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClear && onClear()
    }
  }

  return (
    <div className="search-bar">
      <Search className="search-bar__icon" size={20} aria-hidden="true" />
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search lost and found items"
        autoComplete="off"
        spellCheck="false"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={onClear}
          aria-label="Clear search query"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
