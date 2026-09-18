import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import api from '../lib/api'
import { useMe } from '../lib/useMe'

export default function Programmes() {
  const navigate = useNavigate()
  const { refresh } = useMe()
  const [app, setApp] = useState(null)
  const [levels, setLevels] = useState([])
  const [programmes, setProgrammes] = useState([])
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const appRes = await api.post('/applications')
      const progRes = await api.get('/programmes/matching')
      setApp(appRes.data.application)
      setLevels(progRes.data.levels)
      setProgrammes(progRes.data.programmes)
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedLevel && levels.length) {
      const initial = app?.programme?.nta_level ?? levels[0]
      setSelectedLevel(initial)
    }
  }, [levels, selectedLevel, app?.programme?.nta_level])

  async function select(programmeId) {
    setSaving(true)
    setError('')
    try {
      const res = await api.post(`/applications/${app.id}/programme`, { programme_id: programmeId })
      setApp(res.data.application)
      await refresh()
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  const locked = Boolean(app?.programme)
  const activeLevel = locked ? app.programme.nta_level : selectedLevel

  const courses = useMemo(
    () => programmes.filter((p) => p.nta_level === activeLevel),
    [programmes, activeLevel],
  )

  if (loading) {
    return (
      <AppShell stepper currentStep={4}>
        <div className="card center">{t('misc.loading')}</div>
      </AppShell>
    )
  }

  return (
    <AppShell stepper currentStep={4}>
      <h1 className="section-title">{t('programme.title')}</h1>
      <p className="lead">{t('programme.available')}</p>

      <Notice type="error">{error}</Notice>

      {app.programme && (
        <Notice type="info">
          <b>{t('programme.selected')}:</b> {app.programme.name}
        </Notice>
      )}

      {levels.length === 0 ? (
        <p className="muted">{t('programme.noMatch')}</p>
      ) : (
        <>
          <Notice type="success">
            {t('programme.matchedNote')} {levels.map((l) => `NTA ${l}`).join(' · ')}
          </Notice>

          <Field label={t('programme.chooseLevel')}>
            <select
              value={activeLevel ?? ''}
              disabled={locked}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  NTA {l}
                </option>
              ))}
            </select>
          </Field>

          {locked && <p className="hint warn">{t('programme.levelLocked')}</p>}

          <h2 className="prog-group-title">
            {t('programme.availableAt').replace('{n}', activeLevel ?? '')}
          </h2>

          {courses.map((p) => {
            const selected = app.programme_id === p.id
            return (
              <div key={p.id} className={`prog ${selected ? 'selected' : ''}`}>
                <div className="head">
                  <h3>{p.name}</h3>
                  <span className="lvl">{t('programme.nta')} {p.nta_level}</span>
                </div>
                {p.description && <p>{p.description}</p>}
                {p.entry_requirements_text && (
                  <div className="req">
                    <b>{t('programme.requirements')}</b>
                    {p.entry_requirements_text}
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  {selected ? (
                    <Button type="button" variant="secondary" disabled>
                      <Check size={16} strokeWidth={2.5} /> {t('programme.selected')}
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => select(p.id)} loading={saving}>
                      {t('programme.select')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}

      <div className="step-nav">
        <Button type="button" variant="secondary" onClick={() => navigate('/apply/payment')}>
          {t('back')}
        </Button>
        <Button type="button" onClick={() => navigate('/apply/review')} disabled={!app?.programme_id}>
          {t('next')}
        </Button>
      </div>
    </AppShell>
  )
}