import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import './Dialog.css'

export default function Dialog({
  open = false,
  onClose,
  title,
  children,
  maxWidth = '560px',
  ariaLabel = null,
}) {
  const dialogRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      previousActiveElementRef.current = document.activeElement
      if (!dialog.open) {
        dialog.showModal()
      }
      document.body.style.overflow = 'hidden'
    } else {
      if (dialog.open) {
        dialog.close()
      }
      document.body.style.overflow = ''
      if (previousActiveElementRef.current && previousActiveElementRef.current.focus) {
        previousActiveElementRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle native cancel (Esc key)
  const handleCancel = (e) => {
    e.preventDefault()
    onClose && onClose()
  }

  // Handle click on backdrop
  const handleClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose && onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      style={{ '--dialog-max-width': maxWidth }}
      onCancel={handleCancel}
      onClick={handleClick}
      aria-label={ariaLabel || title}
    >
      <div className="modal-dialog__container">
        <div className="modal-dialog__header">
          {title && <h2 className="modal-dialog__title">{title}</h2>}
          <button
            type="button"
            className="modal-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-dialog__content">{children}</div>
      </div>
    </dialog>
  )
}
