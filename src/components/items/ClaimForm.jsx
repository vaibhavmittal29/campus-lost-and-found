import { useState, useRef } from 'react'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import {
  validateClaimName,
  validateContact,
  validateClaimMessage,
} from '../../utils/validators.js'
import './ClaimForm.css'

export default function ClaimForm({ item, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name: '',
    contact: '',
    message: '',
  })
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const fieldRefs = {
    name: useRef(null),
    contact: useRef(null),
    message: useRef(null),
  }

  const isItemFound = item.status === 'found'

  const getFieldError = (field, val) => {
    switch (field) {
      case 'name':
        return validateClaimName(val)
      case 'contact':
        return validateContact(val)
      case 'message':
        return validateClaimMessage(val)
      default:
        return ''
    }
  }

  const handleChange = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }))
    if (touched[field]) {
      const err = getFieldError(field, val)
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const err = getFieldError(field, values[field])
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const nameErr = validateClaimName(values.name)
    const contactErr = validateContact(values.contact)
    const msgErr = validateClaimMessage(values.message)

    const formErrors = {
      name: nameErr,
      contact: contactErr,
      message: msgErr,
    }

    setErrors(formErrors)
    setTouched({ name: true, contact: true, message: true })

    const errorKeys = Object.keys(formErrors).filter((k) => formErrors[k])
    if (errorKeys.length > 0) {
      if (fieldRefs[errorKeys[0]]?.current) {
        fieldRefs[errorKeys[0]].current.focus()
      }
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: values.name,
        contact: values.contact,
        message: values.message,
        previousStatus: item.status,
      })
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit claim. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form className="claim-form" onSubmit={handleSubmit} noValidate>
      <div className="claim-form__info-box">
        <p className="claim-form__intro">
          {isItemFound
            ? 'To claim this found item, provide verifiable proof of ownership so the finder can confirm it belongs to you.'
            : 'If you located this lost item, let the owner know where and how to safely retrieve it.'}
        </p>
        <p className="claim-form__disclaimer">
          ⚠️ Demo mode — submissions persist in your browser; no real email or SMS is sent.
        </p>
      </div>

      {errorCount > 0 && Object.keys(touched).length > 1 && (
        <div className="claim-form__alert" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>Please correct the highlighted fields before submitting.</span>
        </div>
      )}

      {submitError && (
        <div className="claim-form__alert claim-form__alert--error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <FormField
        id="claim-name"
        label="Your Full Name"
        required
        error={touched.name ? errors.name : null}
      >
        <input
          ref={fieldRefs.name}
          id="claim-name"
          type="text"
          className="form-input"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="e.g. Vaibhav Mittal"
          maxLength={50}
          aria-invalid={Boolean(touched.name && errors.name)}
        />
      </FormField>

      <FormField
        id="claim-contact"
        label="Your Contact (Email or Mobile)"
        required
        error={touched.contact ? errors.contact : null}
        hint="Where the poster can reach you"
      >
        <input
          ref={fieldRefs.contact}
          id="claim-contact"
          type="text"
          className="form-input"
          value={values.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          onBlur={() => handleBlur('contact')}
          placeholder="student@vitstudent.ac.in or 9876543210"
          aria-invalid={Boolean(touched.contact && errors.contact)}
        />
      </FormField>

      <FormField
        id="claim-message"
        label={
          isItemFound
            ? 'Proof of Ownership'
            : 'Recovery Instructions'
        }
        required
        error={touched.message ? errors.message : null}
        hint={`${values.message.length}/200 characters`}
      >
        <textarea
          ref={fieldRefs.message}
          id="claim-message"
          className="form-textarea"
          rows={3}
          value={values.message}
          maxLength={200}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder={
            isItemFound
              ? 'Describe something unique (contents, wallpaper, serial marks, stickers)...'
              : 'I have left it at TT reception desk / call me to collect...'
          }
          aria-invalid={Boolean(touched.message && errors.message)}
        />
      </FormField>

      <div className="claim-form__actions">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={ShieldCheck}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Claim'}
        </Button>
      </div>
    </form>
  )
}
