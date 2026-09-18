import { useCallback, useEffect, useState } from 'react'
import api from './api'

export function usePlaces() {
  const [regions, setRegions] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let on = true
    api
      .get('/regions')
      .then((r) => {
        if (on) setRegions(r.data.regions ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (on) setLoading(false)
      })
    return () => {
      on = false
    }
  }, [])

  const loadDistricts = useCallback((regionId) => {
    setDistricts([])
    if (!regionId) return
    api
      .get(`/regions/${regionId}/districts`)
      .then((r) => setDistricts(r.data.districts ?? []))
      .catch(() => setDistricts([]))
  }, [])

  return { regions, districts, loadDistricts, loading }
}