import { getStatus } from '../../constants/statuses.js'
import { getCategory } from '../../constants/categories.js'
import './Badge.css'

export default function Badge({
  variant = 'lost', // 'lost' | 'found' | 'claimed' | 'category'
  categoryName = null,
  children,
  className = '',
}) {
  if (variant === 'category') {
    const cat = getCategory(categoryName || children)
    const Icon = cat.icon
    return (
      <span className={`badge badge--category ${className}`.trim()}>
        {Icon && <Icon className="badge__icon" size={13} aria-hidden="true" />}
        <span className="badge__text">{children || cat.name}</span>
      </span>
    )
  }

  const statusObj = getStatus(variant)
  const Icon = statusObj.icon

  return (
    <span
      className={`badge badge--status badge--${variant} ${className}`.trim()}
      style={{
        backgroundColor: statusObj.bgColor,
        color: statusObj.fgColor,
      }}
    >
      <Icon className="badge__icon" size={13} aria-hidden="true" />
      <span className="badge__text">{children || statusObj.label}</span>
    </span>
  )
}
