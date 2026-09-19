export function Field({ label, optional, error, children }) {
  return (
    <div className="field">
      <label>
        {label} {optional && <span className="opt">({optional})</span>}
      </label>
      {children}
      {error && <div className="err">{error}</div>}
    </div>
  )
}

export function Button({ children, variant, loading, ...props }) {
  const cls = ['btn', variant === 'secondary' ? 'secondary' : '', variant === 'ghost' ? 'ghost' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spin" />}
      {children}
    </button>
  )
}

import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const NOTICE_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warn: AlertTriangle,
}

export function Notice({ type, children }) {
  if (!children) return null
  const Icon = NOTICE_ICONS[type] ?? Info
  return (
    <div className={`notice ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="notice-ic">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="notice-msg">{children}</span>
    </div>
  )
}

export function apiErrors(err, fallback) {
  const data = err?.response?.data
  if (data?.message) return data.message
  if (data?.errors) {
    const first = Object.values(data.errors)[0]
    if (Array.isArray(first)) return first[0]
    return String(first)
  }
  return fallback ?? err?.message ?? 'Kuna tatizo. Jaribu tena.'
}