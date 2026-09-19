import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { Button, Notice, apiErrors } from '../components/ui'
import { useToast } from '../components/Toast'
import api from '../lib/api'
import { useMe } from '../lib/useMe'
import { categoryLabel } from '../lib/categories'

export default function Programmes() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, refresh } = useMe()
  const [app, setApp] = useState(null)
  const [programmes, setProgrammes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const appRes = await api.post('/applications')
      const level = user?.nta_level
      const progRes = await api.get('/programmes', {
        params: level ? { nta_level: level } : {},
      })
      setApp(appRes.data.application)
      setProgrammes(progRes.data.programmes ?? [])
    } catch (err) {
      const msg = apiErrors(err, t('misc.error'))
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.nta_level])

  async function select(programmeId) {
    setSaving(true)
    setError('')
    try {
      const res = await api.post(`/applications/${app.id}/programme`, { programme_id: programmeId })
      setApp(res.data.application)
      await refresh()
      toast.success(t('toast.programmeSelected'))
    } catch (err) {
      const msg = apiErrors(err, t('misc.error'))
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const category = user?.nta_level ?? app?.programme?.nta_level ?? null

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

      {category && (
        <Notice type="success">
          {t('programme.category').replace('{n}', category)} — {categoryLabel(category)}
        </Notice>
      )}

      {programmes.length === 0 ? (
        <p className="muted">
          {category ? t('programme.noMatchCategory') : t('programme.noMatch')}
        </p>
      ) : (
        <>
          {category && (
            <h2 className="prog-group-title">
              {t('programme.availableAt').replace('{n}', category)}
            </h2>
          )}

          {programmes.map((p) => {
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