import { useState } from 'react'
import { getCategory } from '../../constants/categories.js'
import './ItemImage.css'

export default function ItemImage({ src, alt, category, className = '' }) {
  const [hasError, setHasError] = useState(false)

  const catObj = getCategory(category)
  const basePath = (import.meta.env.BASE_URL || '/').endsWith('/')
    ? import.meta.env.BASE_URL || '/'
    : `${import.meta.env.BASE_URL}/`

  const placeholderPath = `${basePath}images/placeholders/${catObj.placeholder || 'generic.svg'}`

  let imageSrc = placeholderPath
  if (src && !hasError) {
    if (src.startsWith('data:') || src.startsWith('http')) {
      imageSrc = src
    } else {
      const cleanPath = src.replace(/^\/+/, '')
      imageSrc = `${basePath}${cleanPath}`
    }
  }

  return (
    <div className={`item-image-wrapper ${className}`.trim()}>
      <img
        src={imageSrc}
        alt={alt || `Photo of ${category}`}
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="item-image"
      />
    </div>
  )
}
