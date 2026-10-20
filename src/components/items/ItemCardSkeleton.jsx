import './ItemCardSkeleton.css'

export default function ItemCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__media skeleton-box" />
      <div className="skeleton-card__body">
        <div className="skeleton-box skeleton-card__title-line" />
        <div className="skeleton-box skeleton-card__title-line-short" />
        <div className="skeleton-box skeleton-card__badge" />
        <div className="skeleton-card__meta">
          <div className="skeleton-box skeleton-card__meta-line" />
          <div className="skeleton-box skeleton-card__meta-line" />
        </div>
      </div>
    </div>
  )
}
