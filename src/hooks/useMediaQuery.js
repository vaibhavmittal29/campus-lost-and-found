import { useState, useEffect } from 'react'

/**
 * Custom hook that listens to a CSS media query string.
 * Example: const isDesktop = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)
    const listener = (event) => setMatches(event.matches)

    // Initial check
    setMatches(mediaQueryList.matches)

    // Modern and fallback event listener binding
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else {
      mediaQueryList.addListener(listener)
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else {
        mediaQueryList.removeListener(listener)
      }
    }
  }, [query])

  return matches
}
