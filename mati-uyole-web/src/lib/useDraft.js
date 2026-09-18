import { useEffect, useState } from 'react'
import { loadDraft, saveDraft, clearDraft } from './draft'

export function useDraft(key, initial) {
  const [values, setValues] = useState(() => ({ ...initial, ...(loadDraft(key) ?? {}) }))
  const [touched, setTouched] = useState(() => new Set(Object.keys(loadDraft(key) ?? {})))

  useEffect(() => {
    const out = {}
    for (const k of touched) out[k] = values[k]
    saveDraft(key, out)
  })

  const patch = (updater) => {
    const next = typeof updater === 'function' ? updater(values) : updater
    setTouched((prev) => {
      for (const k of Object.keys(next)) {
        if (next[k] !== values[k]) prev.add(k)
      }
      return prev
    })
    setValues(next)
  }

  const applyServer = (server) => {
    let changed = false
    const next = { ...values }
    for (const k of Object.keys(server)) {
      if (touched.has(k)) continue
      if (next[k] !== server[k]) {
        next[k] = server[k]
        changed = true
      }
    }
    if (changed) setValues(next)
  }

  const commit = () => {
    setTouched(new Set())
    clearDraft(key)
  }

  return { values, patch, applyServer, commit }
}