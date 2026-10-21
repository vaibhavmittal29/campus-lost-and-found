/**
 * Pure validation functions for form fields.
 * Each returns a user-friendly error string or '' if valid.
 */

export function validateType(type) {
  if (!type || (type !== 'lost' && type !== 'found')) {
    return 'Please select whether you lost or found this item.'
  }
  return ''
}

export function validateTitle(title) {
  const trimmed = (title || '').trim()
  if (!trimmed) {
    return 'Please give this item a short name (e.g. Blue Hydro Flask).'
  }
  if (trimmed.length < 3) {
    return 'Item name must be at least 3 characters long.'
  }
  if (trimmed.length > 60) {
    return 'Item name cannot exceed 60 characters.'
  }
  return ''
}

export function validateCategory(category) {
  if (!category || category === 'all') {
    return 'Please choose an appropriate category.'
  }
  return ''
}

export function validateLocation(locationId) {
  if (!locationId || locationId === 'all') {
    return 'Please select where on campus the item was seen.'
  }
  return ''
}

export function validateDate(dateStr) {
  if (!dateStr) {
    return 'Please enter the date when the item was lost or found.'
  }

  const inputDate = new Date(`${dateStr}T00:00:00`)
  if (isNaN(inputDate.getTime())) {
    return 'Please enter a valid calendar date.'
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (inputDate > today) {
    return 'Date cannot be in the future.'
  }

  const ninetyDaysAgo = new Date(today)
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  if (inputDate < ninetyDaysAgo) {
    return 'Date cannot be older than 90 days.'
  }

  return ''
}

export function validateDescription(description) {
  const trimmed = (description || '').trim()
  if (!trimmed) {
    return 'Add at least 10 characters so people can recognise the item.'
  }
  if (trimmed.length < 10) {
    return `Add at least ${10 - trimmed.length} more characters to describe unique marks or features.`
  }
  if (trimmed.length > 300) {
    return `Description cannot exceed 300 characters (${trimmed.length}/300).`
  }
  return ''
}

export function validateContact(contact) {
  const trimmed = (contact || '').trim()
  if (!trimmed) {
    return 'Please provide a campus email or 10-digit mobile number.'
  }

  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(trimmed)) {
    return ''
  }

  // 10-digit Indian mobile number (optional +91 or 91 prefix)
  const phoneClean = trimmed.replace(/[\s\-()]/g, '')
  const phoneRegex = /^(?:\+?91)?[6-9]\d{9}$/
  if (phoneRegex.test(phoneClean)) {
    return ''
  }

  return 'Enter a valid email address or a 10-digit mobile number.'
}

export function validateClaimName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) {
    return 'Please enter your name.'
  }
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters.'
  }
  if (trimmed.length > 50) {
    return 'Name cannot exceed 50 characters.'
  }
  return ''
}

export function validateClaimMessage(message) {
  const trimmed = (message || '').trim()
  if (!trimmed) {
    return 'Please provide details proving ownership or where you found it.'
  }
  if (trimmed.length < 10) {
    return 'Please provide at least 10 characters with recognizable details.'
  }
  if (trimmed.length > 200) {
    return 'Message cannot exceed 200 characters.'
  }
  return ''
}

/**
 * Validates the full Post Item form values object
 */
export function validatePostForm(values) {
  const errors = {}

  const typeErr = validateType(values.type)
  if (typeErr) errors.type = typeErr

  const titleErr = validateTitle(values.title)
  if (titleErr) errors.title = titleErr

  const catErr = validateCategory(values.category)
  if (catErr) errors.category = catErr

  const locErr = validateLocation(values.locationId)
  if (locErr) errors.locationId = locErr

  const dateErr = validateDate(values.date)
  if (dateErr) errors.date = dateErr

  const descErr = validateDescription(values.description)
  if (descErr) errors.description = descErr

  const contactErr = validateContact(values.contact)
  if (contactErr) errors.contact = contactErr

  return errors
}
