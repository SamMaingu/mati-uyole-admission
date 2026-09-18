import VerticalSteps from './VerticalSteps'
import { buildSteps } from '../lib/progress'
import { useMe } from '../lib/useMe'
import { useLocation } from 'react-router-dom'
import { t } from '../lib/i18n'

export default function Sidebar() {
  const { user } = useMe()
  const { pathname } = useLocation()
  if (!user) return null

  const steps = buildSteps(user)
  const current = steps.find((s) => s.to === pathname)

  return (
    <section className="card s-card">
      <span className="card-label">{t('sidebar.steps')}</span>
      <VerticalSteps steps={steps} current={current?.key} />
    </section>
  )
}