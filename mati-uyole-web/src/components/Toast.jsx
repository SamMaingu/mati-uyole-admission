import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

let nextId = 1

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warn: AlertTriangle,
}

const DURATION = {
  success: 3500,
  info: 3500,
  warn: 5000,
  error: 6000,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [leaving, setLeaving] = useState(new Set())
  const timers = useRef(new Map())

  const remove = useCallback((id) => {
    setLeaving((prev) => new Set(prev).add(id))
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
      setLeaving((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 260)
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = nextId++
      setToasts((list) => [...list.slice(-3), { id, type, message }])
      const t = window.setTimeout(() => remove(id), DURATION[type] ?? 4000)
      timers.current.set(id, t)
      return () => {
        window.clearTimeout(timers.current.get(id))
        timers.current.delete(id)
      }
    },
    [remove],
  )

  const api = useMemo(() => {
    const withType = (type) => (message) => push(type, message)
    return {
      success: withType('success'),
      error: withType('error'),
      info: withType('info'),
      warn: withType('warn'),
    }
  }, [push])

  function dismiss(id) {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    remove(id)
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-region" role="region" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] ?? Info
          return (
            <div
              key={t.id}
              className={`toast toast-${t.type} ${leaving.has(t.id) ? 'leaving' : ''}`}
              role={t.type === 'error' ? 'alert' : 'status'}
            >
              <span className="toast-ic">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="toast-msg">{t.message}</span>
              <button type="button" className="toast-x" aria-label="Close" onClick={() => dismiss(t.id)}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}