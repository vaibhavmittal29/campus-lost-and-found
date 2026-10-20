import './ItemGrid.css'

export default function ItemGrid({ children, className = '' }) {
  return <div className={`item-grid ${className}`.trim()}>{children}</div>
}
