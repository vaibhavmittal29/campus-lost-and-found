const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_RAW_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * Validates file MIME type and raw file size before processing.
 * Returns an error string or null if valid.
 */
export function validateImageFile(file) {
  if (!file) return null

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, and WebP images are supported.'
  }

  if (file.size > MAX_RAW_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return `Image is too large (${sizeMb} MB). Maximum size before upload is 5 MB.`
  }

  return null
}

/**
 * Resizes an image file client-side to fit within maxSize x maxSize bounding box,
 * converting it to a compressed JPEG data URL.
 */
export function resizeImageToDataUrl(file, maxSize = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'))
    }

    reader.onload = (readerEvent) => {
      const img = new Image()

      img.onerror = () => {
        reject(new Error('Failed to parse image data.'))
      }

      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }

      img.src = readerEvent.target.result
    }

    reader.readAsDataURL(file)
  })
}
