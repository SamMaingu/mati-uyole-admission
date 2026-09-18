import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { formatTZS } from '../lib/format'
import AppShell from '../components/AppShell'
import { Button, Notice, apiErrors } from '../components/ui'
import api from '../lib/api'
import { useMe } from '../lib/useMe'

const KIN_KEYS = ['mother', 'father', 'sister', 'brother', 'uncle', 'relative']
const kinLabel = (v) => (v && KIN_KEYS.includes(v) ? t(`kin.rel.${v}`) : v ?? '')
const qualLabel = (lvl) =>
  ({ CSEE: t('academic.csee'), ACSEE: t('academic.acsee'), NVA_III: t('academic.nva3'), NTA_DIPLOMA: t('academic.diploma'), OTHER: t('academic.other') })[lvl] ?? lvl

function Section({ title, children }) {
  return (
    <div className="card">
      <span className="card-label">{title}</span>
      <dl className="dl">{children}</dl>
    </div>
  )
}

function K({ k, v, mono }) {
  return (
    <div className="dl-row">
      <dt>{k}</dt>
      <dd className={mono ? 'mono' : ''}>{v || '—'}</dd>
    </div>
  )
}

const TERMINAL = new Set([
  'submitted',
  'under_review',
  'additional_info_required',
  'eligible',
  'not_eligible',
  'selected',
  'waitlisted',
  'not_selected',
  'admission_completed',
])

export default function Review() {
  const navigate = useNavigate()
  const { user, refresh } = useMe()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .post('/applications')
      .then((res) => setApp(res.data.application))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function onSubmit() {
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post(`/applications/${app.id}/submit`)
      setApp(res.data.application)
      await refresh()
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <AppShell stepper currentStep={5}>
        <div className="card center">{t('misc.loading')}</div>
      </AppShell>
    )
  }

  const profile = user.applicant_profile
  const rec = profile?.academic_record
  const kin = profile?.next_of_kin
  const payment = app?.payment

  if (app && TERMINAL.has(app.status)) {
    return (
      <AppShell stepper currentStep={5}>
        <div className="card center">
          <Notice type="success">{t('review.submitted')}</Notice>
          <p className="lead">
            {t('application.no')} <span className="mono-pill">{user.application_number}</span>
          </p>
          <Button type="button" onClick={() => navigate('/dashboard')} style={{ marginTop: 4 }}>
            {t('next')} → Dashboard
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell stepper currentStep={5}>
      <h1 className="section-title">{t('review.title')}</h1>

      <Notice type="error">{error}</Notice>

      <Section title={t('personal.title')}>
        <K k={t('personal.gender')} v={profile?.gender} />
        <K k={t('personal.dob')} v={profile?.date_of_birth} />
        <K k="Mkoa/Wilaya" v={`${profile?.region ?? ''} / ${profile?.district ?? ''}`} />
        <K k={t('personal.address')} v={profile?.present_address} />
      </Section>

      <Section title={t('kin.title')}>
        <K k={t('kin.fullName')} v={kin?.full_name} />
        <K k={t('kin.relationship')} v={kinLabel(kin?.relationship)} />
        <K k={t('kin.phone')} v={kin?.phone} mono />
      </Section>

      <Section title={t('academic.title')}>
        <K k={t('academic.primarySchool')} v={rec?.primary_school_name} />
        {profile?.academic_qualifications?.map((q) => (
          <div className="review-qual" key={q.id}>
            <b>{qualLabel(q.level)}</b>
            <K k={t('academic.enterIndex')} v={q.index_no} mono />
            <K k={t('academic.school')} v={q.school_name || q.candidate_name} />
            <K
              k={`${t('academic.divisionAt')} / ${t('academic.pointsAt')} · ${t('academic.yearAt')}`}
              v={`${q.division ?? '—'} / ${q.points ?? '—'} · ${q.year_completed ?? '—'}`}
            />
          </div>
        ))}
      </Section>

      <Section title={t('stepper.programme')}>
        <K k={t('stepper.programme')} v={app?.programme?.name} />
        <K k={t('programme.nta')} v={app?.programme?.nta_level} />
        <K k={t('stepper.payment')} v={payment ? formatTZS(payment.amount) : '—'} mono />
      </Section>

      <div className="card">
        <label className="checkline">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>{t('review.confirm')}</span>
        </label>
        <div className="step-nav" style={{ marginTop: 14 }}>
          <Button type="button" variant="secondary" onClick={() => navigate('/apply/programmes')}>
            {t('back')}
          </Button>
          <Button type="button" onClick={onSubmit} loading={submitting} disabled={!confirmed}>
            {t('review.submit')}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}