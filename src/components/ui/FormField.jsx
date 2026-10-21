import './FormField.css'

export default function FormField({
  id,
  label,
  error = null,
  hint = null,
  required = false,
  children,
  className = '',
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`.trim()}>
      <div className="form-field__label-row">
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && <span className="form-field__required" aria-hidden="true"> *</span>}
        </label>
        {hint && (
          <span id={hintId} className="form-field__hint">
            {hint}
          </span>
        )}
      </div>

      <div className="form-field__control" data-describedby={describedBy}>
        {children}
      </div>

      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
