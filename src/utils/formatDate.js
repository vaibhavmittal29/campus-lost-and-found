/**
 * Formats an ISO date string or YYYY-MM-DD into a readable Indian English format: "12 Oct 2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return ''
  try {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

/**
 * Returns a human-friendly relative time string such as "today", "yesterday", or "3 days ago"
 */
export function timeAgo(dateInput) {
  if (!dateInput) return ''
  try {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return ''

    const now = new Date()
    // Compare dates in calendar days
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' })

    if (diffDays <= 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours < 1) {
        return 'just now'
      }
      return rtf.format(-diffHours, 'hour')
    }

    if (diffDays < 30) {
      return rtf.format(-diffDays, 'day')
    }

    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths < 12) {
      return rtf.format(-diffMonths, 'month')
    }

    const diffYears = Math.floor(diffDays / 365)
    return rtf.format(-diffYears, 'year')
  } catch {
    return ''
  }
}
