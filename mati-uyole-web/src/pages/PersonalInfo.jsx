import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import { useMe } from '../lib/useMe'
import { usePlaces } from '../lib/usePlaces'
import { useDraft } from '../lib/useDraft'
import api from '../lib/api'

const INITIAL = {
  gender: '',
  date_of_birth: '',
  place_of_birth: '',
  marital_status: 'single',
  citizenship: 'Tanzanian',
  citizenship_other: '',
  region: '',
  district: '',
  city_town: '',
  present_address: '',
  postal_box: '',
  has_disability: false,
  disability_details: '',
}

export default function PersonalInfo() {
  const navigate = useNavigate()
  const { user, refresh } = useMe()
  const profile = user?.applicant_profile
  const { regions, districts, loadDistricts, loading } = usePlaces()

  const { values: form, patch: setForm, applyServer, commit } = useDraft('personal', INITIAL)

  useEffect(() => {
    if (!profile) return
    applyServer({
      gender: profile.gender ?? '',
      date_of_birth: (profile.date_of_birth ?? '').slice(0, 10),
      place_of_birth: profile.place_of_birth ?? '',
      marital_status: profile.marital_status ?? 'single',
      citizenship: profile.citizenship ?? 'Tanzanian',
      citizenship_other: profile.citizenship_other ?? '',
      region: profile.region ?? '',
      district: profile.district ?? '',
      city_town: profile.city_town ?? '',
      present_address: profile.present_address ?? '',
      postal_box: profile.postal_box ?? '',
      has_disability: Boolean(profile.has_disability),
      disability_details: profile.disability_details ?? '',
    })
  }, [profile, applyServer])

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
    setSaving(true)
    try {
      await api.put('/me/personal-info', form)
      commit()
      await refresh()
      navigate('/apply/kin')
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell stepper currentStep={1}>
      <h1 className="section-title">{t('personal.title')}</h1>
      <p className="lead">{t('register.note')}</p>

      <form className="card" onSubmit={onSubmit}>
        <Notice type="error">{error}</Notice>

        <Field label={t('personal.gender')}>
          <select value={form.gender} onChange={set('gender')} required>
            <option value="">—</option>
            <option value="male">{t('personal.male')}</option>
            <option value="female">{t('personal.female')}</option>
            <option value="other">{t('personal.other')}</option>
          </select>
        </Field>

        <Field label={t('personal.dob')}>
          <input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} required />
        </Field>

        <Field label={t('personal.placeOfBirth')}>
          <input value={form.place_of_birth} onChange={set('place_of_birth')} />
        </Field>

        <Field label={t('personal.marital')}>
          <select value={form.marital_status} onChange={set('marital_status')}>
            <option value="single">{t('personal.single')}</option>
            <option value="married">{t('personal.married')}</option>
            <option value="other">{t('personal.other')}</option>
          </select>
        </Field>

        <Field label={t('personal.citizenship')}>
          <select value={form.citizenship} onChange={set('citizenship')}>
            <option value="Tanzanian">{t('personal.tanzanian')}</option>
            <option value="Other">{t('personal.otherCitizen')}</option>
          </select>
        </Field>

        {form.citizenship === 'Other' && (
          <Field label={t('personal.citizenshipOther')}>
            <input value={form.citizenship_other} onChange={set('citizenship_other')} required />
          </Field>
        )}

        <Field label={t('personal.region')}>
          <select value={form.region} onChange={onRegionChange} required>
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
            required
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

        <Field label={t('personal.city')}>
          <input value={form.city_town} onChange={set('city_town')} />
        </Field>

        <Field label={t('personal.address')}>
          <input value={form.present_address} onChange={set('present_address')} required />
        </Field>

        <Field label={t('personal.postalBox')}>
          <input value={form.postal_box} onChange={set('postal_box')} />
        </Field>

        <Notice type="info">{t('personal.disabilityNote')}</Notice>

        <Field label={t('personal.disability')}>
          <select
            value={form.has_disability ? 'yes' : 'no'}
            onChange={(e) => setForm((f) => ({ ...f, has_disability: e.target.value === 'yes' }))}
          >
            <option value="no">{t('no')}</option>
            <option value="yes">{t('yes')}</option>
          </select>
        </Field>

        {form.has_disability && (
          <Field label={t('personal.disabilityDetails')}>
            <textarea value={form.disability_details} onChange={set('disability_details')} rows={3} />
          </Field>
        )}

        <div className="btn-row">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
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