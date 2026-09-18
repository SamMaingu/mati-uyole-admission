import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { useMe } from '../lib/useMe'

function K({ k, v, mono }) {
  return (
    <div className="dl-row">
      <dt>{k}</dt>
      <dd className={mono ? 'mono' : ''}>{v || '—'}</dd>
    </div>
  )
}

export default function Profile() {
  const { user, loading } = useMe()

  if (loading || !user) {
    return (
      <AppShell>
        <div className="card center">{t('misc.loading')}</div>
      </AppShell>
    )
  }

  const fullName = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  const created = user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : null

  return (
    <AppShell>
      <h1 className="section-title">{t('profile.title')}</h1>

      <div className="card">
        <h1 className="identity-name">{fullName}</h1>
        <span className="mono-pill">{user.application_number}</span>
      </div>

      <div className="card">
        <span className="card-label">{t('profile.account')}</span>
        <dl className="dl">
          <K k={t('profile.fullName')} v={fullName} />
          <K k={t('register.phone')} v={user.phone} mono />
          <K k={t('profile.email')} v={user.email} />
          <K k={t('profile.joined')} v={created} />
        </dl>
      </div>
    </AppShell>
  )
}