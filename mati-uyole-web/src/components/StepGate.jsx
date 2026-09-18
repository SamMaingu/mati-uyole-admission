import { Navigate, useLocation } from 'react-router-dom'
import { buildSteps } from '../lib/progress'
import { useMe } from '../lib/useMe'

export default function StepGate({ children }) {
  const { user } = useMe()
  const { pathname } = useLocation()

  if (!user) return children

  const steps = buildSteps(user)
  const step = steps.find((s) => s.to === pathname)
  const active = steps.find((s) => s.state === 'active')

  if (step && step.state === 'locked' && active) {
    return <Navigate to={active.to} replace />
  }

  return children
}