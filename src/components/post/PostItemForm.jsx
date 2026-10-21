import { useState, useRef } from 'react'
import { AlertCircle, Send } from 'lucide-react'
import { CATEGORIES } from '../../constants/categories.js'
import { LOCATIONS } from '../../constants/locations.js'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import ImageUploader from './ImageUploader.jsx'
import {
  validateType,
  validateTitle,
  validateCategory,
  validateLocation,
  validateDate,
  validateDescription,
  validateContact,
  validatePostForm,
} from '../../utils/validators.js'
import { resizeImageToDataUrl } from '../../utils/imageUtils.js'
import './PostItemForm.css'

const TODAY_STR = new Date().toISOString().split('T')[0]
const MIN_DATE_STR = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 90)
  return d.toISOString().split('T')[0]
})()

export default function PostItemForm({ onSubmit, onCancel }) {
  const [values, setValues] = useState({
    type: 'lost',
    title: '',
    category: '',
    locationId: '',
    date: TODAY_STR,
    description: '',
    contact: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const fieldRefs = {
    title: useRef(null),
    category: useRef(null),
    locationId: useRef(null),
    date: useRef(null),
    description: useRef(null),
    contact: useRef(null),
  }

  // Pure single-field validator selector
  const getFieldError = (name, val) => {
    switch (name) {
      case 'type':
        return validateType(val)
      case 'title':
        return validateTitle(val)
      case 'category':
        return validateCategory(val)
      case 'locationId':
        return validateLocation(val)
      case 'date':
        return validateDate(val)
      case 'description':
        return validateDescription(val)
      case 'contact':
        return validateContact(val)
      default:
        return ''
    }
  }

  const handleChange = (name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }))

    // If field was touched, re-validate dynamically
    if (touched[name]) {
      const err = getFieldError(name, val)
      setErrors((prev) => ({ ...prev, [name]: err }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const err = getFieldError(name, values[name])
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const formErrors = validatePostForm(values)
    setErrors(formErrors)

    // Mark all as touched
    const allTouched = Object.keys(fieldRefs).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    const errorKeys = Object.keys(formErrors).filter((k) => formErrors[k])
    if (errorKeys.length > 0) {
      // Focus first invalid field
      const firstInvalidField = errorKeys[0]
      if (fieldRefs[firstInvalidField]?.current) {
        fieldRefs[firstInvalidField].current.focus()
      }
      return
    }

    try {
      setIsSubmitting(true)

      let imageDataUrl = null
      if (imageFile) {
        imageDataUrl = await resizeImageToDataUrl(imageFile, 800, 0.8)
      }

      await onSubmit({
        ...values,
        image: imageDataUrl,
      })
    } catch (err) {
      setSubmitError(err.message || 'Failed to post item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      {/* Top error summary */}
      {errorCount > 0 && Object.keys(touched).length > 2 && (
        <div className="post-form__alert" role="alert">
          <AlertCircle size={18} className="post-form__alert-icon" aria-hidden="true" />
          <span>
            Please resolve the <strong>{errorCount}</strong> highlighted error{errorCount > 1 ? 's' : ''} below.
          </span>
        </div>
      )}

      {submitError && (
        <div className="post-form__alert post-form__alert--server" role="alert">
          <AlertCircle size={18} className="post-form__alert-icon" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      {/* 1. Item Type (Lost vs Found) */}
      <fieldset className="post-form__type-group">
        <legend className="post-form__type-legend">I want to report:</legend>
        <div className="post-form__type-options">
          <label
            className={`post-form__type-option ${
              values.type === 'lost' ? 'post-form__type-option--active-lost' : ''
            }`}
          >
            <input
              type="radio"
              name="item-type"
              value="lost"
              checked={values.type === 'lost'}
              onChange={() => handleChange('type', 'lost')}
            />
            <span>I lost something</span>
          </label>

          <label
            className={`post-form__type-option ${
              values.type === 'found' ? 'post-form__type-option--active-found' : ''
            }`}
          >
            <input
              type="radio"
              name="item-type"
              value="found"
              checked={values.type === 'found'}
              onChange={() => handleChange('type', 'found')}
            />
            <span>I found something</span>
          </label>
        </div>
      </fieldset>

      {/* 2. Item Title */}
      <FormField
        id="post-title"
        label="Item Name"
        required
        error={touched.title ? errors.title : null}
        hint="e.g. Casio fx-991EX Calculator"
      >
        <input
          ref={fieldRefs.title}
          id="post-title"
          type="text"
          className="form-input"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="What is the item?"
          maxLength={60}
          aria-invalid={Boolean(touched.title && errors.title)}
        />
      </FormField>

      {/* 3. Category & Location row */}
      <div className="post-form__grid-row">
        <FormField
          id="post-category"
          label="Category"
          required
          error={touched.category ? errors.category : null}
        >
          <select
            ref={fieldRefs.category}
            id="post-category"
            className="form-select"
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            aria-invalid={Boolean(touched.category && errors.category)}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="post-location"
          label="Campus Location"
          required
          error={touched.locationId ? errors.locationId : null}
        >
          <select
            ref={fieldRefs.locationId}
            id="post-location"
            className="form-select"
            value={values.locationId}
            onChange={(e) => handleChange('locationId', e.target.value)}
            onBlur={() => handleBlur('locationId')}
            aria-invalid={Boolean(touched.locationId && errors.locationId)}
          >
            <option value="">Where on campus?</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* 4. Date */}
      <FormField
        id="post-date"
        label="Date"
        required
        error={touched.date ? errors.date : null}
        hint="Within the last 90 days"
      >
        <input
          ref={fieldRefs.date}
          id="post-date"
          type="date"
          className="form-input"
          value={values.date}
          min={MIN_DATE_STR}
          max={TODAY_STR}
          onChange={(e) => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          aria-invalid={Boolean(touched.date && errors.date)}
        />
      </FormField>

      {/* 5. Description with live character counter */}
      <FormField
        id="post-description"
        label="Description"
        required
        error={touched.description ? errors.description : null}
        hint={`${values.description.length}/300 characters`}
      >
        <textarea
          ref={fieldRefs.description}
          id="post-description"
          className="form-textarea"
          rows={3}
          value={values.description}
          maxLength={300}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe color, brand, stickers, scratches, or unique contents..."
          aria-invalid={Boolean(touched.description && errors.description)}
        />
      </FormField>

      {/* 6. Photo upload */}
      <div className="post-form__uploader-wrapper">
        <label className="form-field__label">Photo (optional)</label>
        <ImageUploader
          file={imageFile}
          onChange={(f) => setImageFile(f)}
          onClear={() => setImageFile(null)}
        />
      </div>

      {/* 7. Contact Info */}
      <FormField
        id="post-contact"
        label="Contact Information"
        required
        error={touched.contact ? errors.contact : null}
        hint="Your VIT email or 10-digit mobile number"
      >
        <input
          ref={fieldRefs.contact}
          id="post-contact"
          type="text"
          className="form-input"
          value={values.contact}
          onChange={(e) => handleChange('contact', e.target.value)}
          onBlur={() => handleBlur('contact')}
          placeholder="student@vitstudent.ac.in or 9876543210"
          aria-invalid={Boolean(touched.contact && errors.contact)}
        />
      </FormField>

      {/* Actions */}
      <div className="post-form__actions">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Send}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting…' : 'Post Item'}
        </Button>
      </div>
    </form>
  )
}
