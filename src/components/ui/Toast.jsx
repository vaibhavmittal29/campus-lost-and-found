import { useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast.js'
import './Toast.css'

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null)
  const remainingTimeRef = useRef(toast.duration || 4000)
  const startTimeRef = useRef(Date.now())

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id)
    }, remainingTimeRef.current)
  }, [onDismiss, toast.id])

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      const elapsed = Date.now() - startTimeRef.current
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
    }
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startTimer])

  let Icon = Info
  if (toast.type === 'success') Icon = CheckCircle2
  if (toast.type === 'error') Icon = AlertTriangle

  return (
    <div
      className={`toast-item toast-item--${toast.type}`}
      role="status"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <Icon className="toast-item__icon" size={18} aria-hidden="true" />
      <span className="toast-item__message">{toast.message}</span>
      <button
        type="button"
        className="toast-item__dismiss"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <aside
      className="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </aside>
  )
}
