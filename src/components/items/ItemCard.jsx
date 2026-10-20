import React from 'react'
import { MapPin, Calendar } from 'lucide-react'
import ItemImage from '../ui/ItemImage.jsx'
import Badge from '../ui/Badge.jsx'
import { getLocation } from '../../constants/locations.js'
import { formatDate, timeAgo } from '../../utils/formatDate.js'
import './ItemCard.css'

function ItemCard({ item, onOpen, distanceHint = null }) {
  const location = getLocation(item.locationId)
  const isClaimed = item.status === 'claimed'

  return (
    <article
      className={`item-card ${isClaimed ? 'item-card--claimed' : ''}`}
      onClick={() => onOpen && onOpen(item)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onOpen) {
          e.preventDefault()
          onOpen(item)
        }
      }}
      tabIndex="0"
      role="button"
      aria-label={`${item.title}, ${item.status} in ${location.label}`}
    >
      <div className="item-card__media">
        <ItemImage
          src={item.image}
          alt={`Photo of ${item.title}`}
          category={item.category}
          className="item-card__image"
        />
        <div className="item-card__badge-slot">
          <Badge variant={item.status} />
        </div>
      </div>

      <div className="item-card__body">
        <h3 className="item-card__title" title={item.title}>
          {item.title}
        </h3>

        <div className="item-card__category">
          <Badge variant="category" categoryName={item.category} />
        </div>

        <div className="item-card__meta">
          <div className="item-card__meta-row" title={`Location: ${location.label}`}>
            <MapPin size={14} className="item-card__meta-icon" aria-hidden="true" />
            <span className="item-card__meta-text">{location.label}</span>
            {distanceHint && (
              <span className="item-card__distance-tag">{distanceHint}</span>
            )}
          </div>

          <div
            className="item-card__meta-row"
            title={`Reported on ${formatDate(item.date)} (${timeAgo(item.date)})`}
          >
            <Calendar size={14} className="item-card__meta-icon" aria-hidden="true" />
            <span className="item-card__meta-text">
              {formatDate(item.date)} · {timeAgo(item.date)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default React.memo(ItemCard)
