import { useState, useEffect, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react'
import { validateImageFile } from '../../utils/imageUtils.js'
import './ImageUploader.css'

export default function ImageUploader({
  file,
  onChange,
  onClear,
  error = null,
}) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [internalError, setInternalError] = useState(null)
  const fileInputRef = useRef(null)

  // Manage object URL lifecycle cleanly to prevent memory leaks
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const handleProcessFile = (selectedFile) => {
    if (!selectedFile) return

    setInternalError(null)
    const validationErr = validateImageFile(selectedFile)
    if (validationErr) {
      setInternalError(validationErr)
      return
    }

    onChange && onChange(selectedFile)
  }

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0]
    handleProcessFile(selected)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files?.[0]
    handleProcessFile(droppedFile)
  }

  const handleRemove = () => {
    setInternalError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClear && onClear()
  }

  const displayError = internalError || error

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        id="item-photo-input"
        className="visually-hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        aria-describedby={displayError ? 'image-uploader-error' : undefined}
      />

      {!previewUrl ? (
        <div
          className={`uploader-dropzone ${isDragOver ? 'uploader-dropzone--dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          tabIndex="0"
          role="button"
          aria-label="Upload photo of the item. Click or drag and drop."
        >
          <div className="uploader-dropzone__icon-box">
            <UploadCloud size={28} className="uploader-dropzone__icon" aria-hidden="true" />
          </div>
          <p className="uploader-dropzone__prompt">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className="uploader-dropzone__hint">
            JPG, PNG or WebP · Up to 5 MB
          </p>
        </div>
      ) : (
        <div className="uploader-preview">
          <div className="uploader-preview__image-container">
            <img
              src={previewUrl}
              alt="Item preview"
              className="uploader-preview__image"
            />
          </div>

          <div className="uploader-preview__info">
            <div className="uploader-preview__filename">
              <ImageIcon size={14} aria-hidden="true" />
              <span title={file?.name}>{file?.name}</span>
            </div>
            <span className="uploader-preview__filesize">
              {file?.size ? `${(file.size / 1024).toFixed(0)} KB` : ''}
            </span>

            <div className="uploader-preview__actions">
              <button
                type="button"
                className="uploader-preview__btn uploader-preview__btn--change"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw size={13} aria-hidden="true" />
                Change
              </button>
              <button
                type="button"
                className="uploader-preview__btn uploader-preview__btn--remove"
                onClick={handleRemove}
              >
                <Trash2 size={13} aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {displayError && (
        <p id="image-uploader-error" className="image-uploader__error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
