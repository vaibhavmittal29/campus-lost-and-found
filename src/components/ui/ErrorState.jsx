import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button.jsx'
import './ErrorState.css'

export default function ErrorState({
  message = 'Failed to load items from the campus database.',
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon-box">
        <AlertTriangle size={36} className="error-state__icon" aria-hidden="true" />
      </div>
      <h3 className="error-state__title">Something went wrong</h3>
      <p className="error-state__description">{message}</p>
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  )
}
