import { useState, useEffect, useCallback } from 'react'
import { fetchItems, createItem, claimItem } from '../api/itemsApi.js'

export function useItems() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    try {
      const data = await fetchItems()
      if (isMounted) {
        setItems(data)
        setStatus('ready')
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message || 'An unexpected error occurred.')
        setStatus('error')
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    setStatus('loading')
    setError(null)

    fetchItems()
      .then((data) => {
        if (isMounted) {
          setItems(data)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred.')
          setStatus('error')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const reload = useCallback(() => {
    return loadData()
  }, [loadData])

  const addItem = useCallback(async (payload) => {
    const newItem = await createItem(payload)
    setItems((prev) => [newItem, ...prev])
    return newItem
  }, [])

  const claim = useCallback(async (id, claimPayload) => {
    const updated = await claimItem(id, claimPayload)
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'claimed', claim: updated.claim } : item)),
    )
    return updated
  }, [])

  return {
    items,
    status,
    error,
    reload,
    addItem,
    claim,
  }
}
