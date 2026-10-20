import { useState } from 'react'
import { getCategory } from '../../constants/categories.js'
import './ItemImage.css'

export default function ItemImage({ src, alt, category, className = '' }) {
  const [hasError, setHasError] = useState(false)

  const catObj = getCategory(category)
  const placeholderPath = `${import.meta.env.BASE_URL}images/placeholders/${catObj.placeholder || 'generic.svg'}`

  let imageSrc = placeholderPath
  if (src && !hasError) {
    if (src.startsWith('data:') || src.startsWith('http')) {
      imageSrc = src
    } else {
      const cleanPath = src.replace(/^\/+/, '')
      imageSrc = `${import.meta.env.BASE_URL}${cleanPath}`
    }
  }

  return (
    <div className={`item-image-wrapper ${className}`.trim()}>
      <img
        src={imageSrc}
        alt={alt || `Photo of ${category}`}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="item-image"
      />
    </div>
  )
}
