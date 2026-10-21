import { useState, useCallback, useRef, useMemo } from 'react'
import { ToastContext } from './ToastContext.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idCounter = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    idCounter.current += 1
    const id = `toast_${Date.now()}_${idCounter.current}`

    const newToast = {
      id,
      message,
      type, // 'success' | 'error' | 'info'
      duration,
    }

    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const toast = useMemo(
    () => ({
      success: (msg, dur) => addToast(msg, 'success', dur),
      error: (msg, dur) => addToast(msg, 'error', dur),
      info: (msg, dur) => addToast(msg, 'info', dur),
      custom: addToast,
    }),
    [addToast],
  )

  const contextValue = useMemo(
    () => ({ toasts, removeToast, toast }),
    [toasts, removeToast, toast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}
