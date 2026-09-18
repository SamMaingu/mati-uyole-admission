import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { t } from '../lib/i18n'
import { buildSteps } from '../lib/progress'
import AppShell from '../components/AppShell'
import { Button } from '../components/ui'
import { useMe } from '../lib/useMe'

const UNDER_REVIEW_STATUSES = [
  'submitted',
  'under_review',
  'additional_info_required',
  'eligible',
  'not_eligible',
  'selected',
  'waitlisted',
  'not_selected',
  'admission_completed',
]

export default function Dashboard() {
  const { user, loading, error } = useMe()

  if (loading) {
    return (
      <AppShell>
        <div className="card center">{t('misc.loading')}</div>
      </AppShell>
    )
  }

  if (error) {
    return (
      <AppShell>
        <div className="card center">{t('misc.error')}</div>
      </AppShell>
    )
  }

  const steps = buildSteps(user)
  const activeStep = steps.find((s) => s.state === 'active')
  const app = user.applications?.[0]
  const underReview = app && UNDER_REVIEW_STATUSES.includes(app.status)

  return (
    <AppShell>
      <div className="card">
        <h1 className="identity-name">
          {t('dashboard.welcome')}, {user.first_name}
        </h1>
        <span className="mono-pill">{user.application_number}</span>
      </div>

      {underReview && (
        <div className="card app-status">
          <div className="app-status-icon">
            <Clock size={26} />
          </div>
          <div className="app-status-body">
            <span className={`status-chip ${app.status}`}>{t(`status.${app.status}`)}</span>
            <h2>{t('dashboard.reviewTitle')}</h2>
            <p>{t('dashboard.reviewText')}</p>
            {app.submitted_at && (
              <p className="muted">
                {t('dashboard.submittedOn')} {new Date(app.submitted_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {activeStep && (
        <Link to={activeStep.to}>
          <Button>{t('next')}</Button>
        </Link>
      )}
    </AppShell>
  )
}