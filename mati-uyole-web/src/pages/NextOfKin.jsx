import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import { useMe } from '../lib/useMe'
import { usePlaces } from '../lib/usePlaces'
import { useDraft } from '../lib/useDraft'
import api from '../lib/api'

const PHONE_RE = /^0\d{9}$|^(\+?255)\d{9}$/

const INITIAL = {
  full_name: '',
  relationship: '',
  phone: '',
  present_address: '',
  postal_box: '',
  city_town: '',
  email: '',
  region: '',
  district: '',
}

export default function NextOfKin() {
  const navigate = useNavigate()
  const { user, refresh } = useMe()
  const kin = user?.applicant_profile?.next_of_kin
  const { regions, districts, loadDistricts, loading } = usePlaces()

  const { values: form, patch: setForm, applyServer, commit } = useDraft('kin', INITIAL)

  useEffect(() => {
    if (!kin) return
    applyServer({
      full_name: kin.full_name ?? '',
      relationship: kin.relationship ?? '',
      phone: kin.phone ?? '',
      present_address: kin.present_address ?? '',
      postal_box: kin.postal_box ?? '',
      city_town: kin.city_town ?? '',
      email: kin.email ?? '',
      region: kin.region ?? '',
      district: kin.district ?? '',
    })
  }, [kin, applyServer])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!regions.length || !form.region) return
    const r = regions.find((x) => x.name === form.region)
    if (r) loadDistricts(r.id)
  }, [regions, form.region, loadDistricts])

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function onRegionChange(e) {
    const name = e.target.value
    const r = regions.find((x) => x.name === name)
    setForm((f) => ({ ...f, region: name, district: '' }))
    loadDistricts(r?.id)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!PHONE_RE.test(form.phone)) {
      setError(t('errors.phone'))
      return
    }
    setSaving(true)
    try {
      await api.put('/me/next-of-kin', form)
      commit()
      await refresh()
      navigate('/apply/academic')
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell stepper currentStep={1}>
      <h1 className="section-title">{t('kin.title')}</h1>
      <p className="lead">{t('dashboard.flow')}</p>

      <form className="card" onSubmit={onSubmit}>
        <Notice type="error">{error}</Notice>

        <Field label={t('kin.fullName')}>
          <input value={form.full_name} onChange={set('full_name')} required />
        </Field>

        <Field label={t('kin.relationship')}>
          <select value={form.relationship} onChange={set('relationship')} required>
            <option value="">—</option>
            {['mother', 'father', 'sister', 'brother', 'uncle', 'relative'].map((k) => (
              <option key={k} value={k}>
                {t(`kin.rel.${k}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('kin.phone')}>
          <input value={form.phone} onChange={set('phone')} inputMode="tel" required />
        </Field>

        <Field label={t('kin.address')}>
          <input value={form.present_address} onChange={set('present_address')} />
        </Field>

        <Field label={t('kin.postalBox')}>
          <input value={form.postal_box} onChange={set('postal_box')} />
        </Field>

        <Field label={t('kin.city')}>
          <input value={form.city_town} onChange={set('city_town')} />
        </Field>

        <Field label={t('personal.region')}>
          <select value={form.region} onChange={onRegionChange}>
            <option value="">{loading ? t('misc.loading') : '—'}</option>
            {regions.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('personal.district')}>
          <select
            value={districts.some((d) => d.name === form.district) ? form.district : ''}
            onChange={set('district')}
            disabled={!form.region}
          >
            <option value="">—</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('kin.email')} optional={true}>
          <input type="email" value={form.email} onChange={set('email')} />
        </Field>

        <div className="btn-row">
          <Button type="button" variant="secondary" onClick={() => navigate('/apply/personal')}>
            {t('back')}
          </Button>
          <Button type="submit" loading={saving}>
            {t('next')}
          </Button>
        </div>
      </form>
    </AppShell>
  )
}