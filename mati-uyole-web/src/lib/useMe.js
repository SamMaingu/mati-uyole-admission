import { useCallback, useEffect, useState } from 'react'
import api from './api'

let cached = null
let inflight = null
const listeners = new Set()

function fetchMe() {
  if (!inflight) {
    inflight = api
      .get('/me')
      .then((r) => {
        cached = r.data.user
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useMe() {
  const [data, setData] = useState(cached)
  const [loading, setLoading] = useState(cached === null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fn = () => setData(cached)
    listeners.add(fn)
    if (cached === null) {
      fetchMe()
        .then(fn)
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    } else {
      fn()
    }
    return () => listeners.delete(fn)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/me')
      cached = res.data.user
      listeners.forEach((fn) => fn())
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user: data, loading, error, refresh }
}