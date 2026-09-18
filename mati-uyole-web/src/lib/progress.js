import { formatTZS } from './format'

export function buildSteps(user) {
  const profile = user?.applicant_profile
  const app = user?.applications?.[0]
  const payment = app?.payment
  const paid = payment?.status === 'paid'
  const hasPersonal = Boolean(profile)
  const hasKin = Boolean(profile?.next_of_kin)
  const hasAcademic = Boolean(profile?.academic_record?.primary_school_name) && (profile?.academic_qualifications?.length ?? 0) > 0
  const hasProgramme = Boolean(app?.programme_id)
  const submitted = Boolean(app && !['draft', 'payment_pending', 'paid'].includes(app.status))

  const raw = [
    { key: 'account', to: '/dashboard', done: true },
    { key: 'personal', to: '/apply/personal', done: hasPersonal },
    { key: 'kin', to: '/apply/kin', done: hasKin },
    { key: 'academic', to: '/apply/academic', done: hasAcademic },
    { key: 'payment', to: '/apply/payment', done: paid, sub: formatTZS(payment?.amount ?? 20000) },
    { key: 'programme', to: '/apply/programmes', done: hasProgramme },
    { key: 'review', to: '/apply/review', done: submitted },
  ]

  let activeSeen = false
  return raw.map((s) => {
    if (submitted || s.done) return { ...s, state: 'done' }
    if (!activeSeen) {
      activeSeen = true
      return { ...s, state: 'active' }
    }
    return { ...s, state: 'locked' }
  })
}