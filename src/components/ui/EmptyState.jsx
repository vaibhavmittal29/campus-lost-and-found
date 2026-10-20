import { SearchX, PackageOpen } from 'lucide-react'
import Button from './Button.jsx'
import './EmptyState.css'

export default function EmptyState({
  variant = 'no-results', // 'no-results' | 'no-items'
  title,
  description,
  actionLabel,
  onAction,
}) {
  const isNoResults = variant === 'no-results'
  const Icon = isNoResults ? SearchX : PackageOpen

  const defaultTitle = isNoResults ? 'No matching items found' : 'No items reported yet'
  const defaultDesc = isNoResults
    ? 'Try clearing some filters or searching for different keywords.'
    : 'Be the first to report a lost or found item on campus.'
  const defaultAction = isNoResults ? 'Clear all filters' : 'Post an item'

  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon-box">
        <Icon size={40} className="empty-state__icon" aria-hidden="true" />
      </div>
      <h3 className="empty-state__title">{title || defaultTitle}</h3>
      <p className="empty-state__description">{description || defaultDesc}</p>
      {onAction && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel || defaultAction}
        </Button>
      )}
    </div>
  )
}
