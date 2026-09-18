import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import AppShell from '../components/AppShell'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import { useMe } from '../lib/useMe'
import { usePlaces } from '../lib/usePlaces'
import { useDraft } from '../lib/useDraft'
import api from '../lib/api'

const LEVELS = ['CSEE', 'ACSEE', 'NVA_III', 'NTA_DIPLOMA', 'OTHER']
const NECTA_LEVELS = ['CSEE', 'ACSEE']
const IDX = /^[SP]\d{4}\/\d{4}\/\d{4}$/

const levelLabel = (lvl) =>
  ({ CSEE: t('academic.csee'), ACSEE: t('academic.acsee'), NVA_III: t('academic.nva3'), NTA_DIPLOMA: t('academic.diploma'), OTHER: t('academic.other') })[lvl] ?? lvl

const PRIM_INITIAL = {
  primary_school_name: '',
  primary_school_region: '',
  primary_school_district: '',
  country: 'Tanzania',
}

function QualWizard({ mode, initial, onSaved, onCancel }) {
  const editing = Boolean(initial)
  const [level, setLevel] = useState(initial?.level ?? 'CSEE')
  const [step, setStep] = useState(editing ? 'manual' : 'level')
  const [indexNo, setIndexNo] = useState(initial?.index_no ?? '')
  const [lookup, setLookup] = useState(null)
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [notMine, setNotMine] = useState(false)
  const [manual, setManual] = useState({
    school_name: initial?.school_name ?? '',
    division: initial?.division ?? '',
    points: initial?.points ?? '',
    year_completed: initial?.year_completed ?? '',
    avn_number: initial?.avn_number ?? '',
    candidate_name: initial?.candidate_name ?? '',
  })

  function pickLevel(lvl) {
    setLevel(lvl)
    setNotMine(false)
    setLookup(null)
    setStep(NECTA_LEVELS.includes(lvl) ? 'index' : 'manual')
  }

  function setM(key) {
    return (e) => setManual((m) => ({ ...m, [key]: e.target.value }))
  }

  async function retrieve() {
    setErr('')
    setSaving(true)
    try {
      const { data } = await api.post('/academic/lookup', { level, index_no: indexNo.trim() })
      setLookup(data)
      setNotMine(false)
      setStep('result')
    } catch (e) {
      setErr(apiErrors(e, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  async function save(payload) {
    setErr('')
    setSaving(true)
    try {
      if (editing) {
        const { data } = await api.put(`/me/academic/qualifications/${initial.id}`, payload)
        onSaved(data.academic_qualification)
      } else {
        const { data } = await api.post('/me/academic/qualifications', payload)
        onSaved(data.academic_qualification)
        onCancel()
      }
    } catch (e) {
      setErr(apiErrors(e, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  function saveResult() {
    save({
      level,
      index_no: lookup.index_no,
      candidate_name: lookup.candidate_name,
      school_name: lookup.school_name,
      division: lookup.division,
      points: lookup.points,
      year_completed: lookup.year_completed,
      confirmed: true,
    })
  }

  function saveManual() {
    const payload = {
      level,
      confirmed: initial?.confirmed ?? true,
      index_no: indexNo.trim() || null,
      school_name: manual.school_name,
      division: manual.division,
      points: manual.points ? Number(manual.points) : null,
      year_completed: manual.year_completed ? Number(manual.year_completed) : null,
      avn_number: manual.avn_number,
      candidate_name: manual.candidate_name,
    }
    save(payload)
  }

  return (
    <div className="card wiz-card">
      <span className="card-label">{editing ? t('academic.editQualification') : t('academic.chooseLevel')}</span>

      {step === 'level' && (
        <div className="wiz-levels">
          {LEVELS.map((lvl) => (
            <button type="button" key={lvl} className="wiz-opt" onClick={() => pickLevel(lvl)}>
              <b>{levelLabel(lvl)}</b>
              <small>
                {lvl === 'CSEE' && 'S0000/0000/0000'}
                {lvl === 'ACSEE' && 'P0000/0000/0000'}
                {lvl === 'NVA_III' && 'VETA'}
                {lvl === 'NTA_DIPLOMA' && 'NTA'}
                {lvl === 'OTHER' && '—'}
              </small>
            </button>
          ))}
        </div>
      )}

      {step === 'index' && (
        <div className="wiz-step">
          <Field label={t('academic.enterIndex')}>
            <input
              value={indexNo}
              onChange={(e) => setIndexNo(e.target.value)}
              placeholder={level === 'CSEE' ? 'S0000/0000/0000' : 'P0000/0000/0000'}
              spellCheck="false"
            />
          </Field>
          {notMine && <p className="hint warn">{t('academic.notMineHint')}</p>}
          <div className="btn-row">
            <Button loading={saving} disabled={!IDX.test(indexNo.trim())} onClick={retrieve} type="button">
              {t('academic.retrieve')}
            </Button>
          </div>
          <button type="button" className="link-btn" onClick={() => setStep('manual')}>
            {t('academic.fillManual')}
          </button>
        </div>
      )}

      {step === 'result' && lookup && (
        <div className="wiz-step">
          <span className="card-label">{t('academic.results')}</span>
          <p className="mock-tag">{t('academic.mockData')}</p>
          <div className="result-box">
            <div className="result-row">
              <span>{t('academic.candidate')}</span>
              <b>{lookup.candidate_name}</b>
            </div>
            <div className="result-row">
              <span>{t('academic.schoolAt')}</span>
              <b>{lookup.school_name}</b>
            </div>
            <div className="result-row">
              <span>{t('academic.indexPrimary')}</span>
              <b className="mono">{lookup.index_no}</b>
            </div>
            <div className="result-row">
              <span>{t('academic.divisionAt')}</span>
              <b>{lookup.division}</b>
            </div>
            <div className="result-row">
              <span>{t('academic.yearAt')}</span>
              <b>{lookup.year_completed}</b>
            </div>
            <div className="result-row">
              <span>{t('academic.pointsAt')}</span>
              <b>{lookup.points}</b>
            </div>
          </div>
          <div className="btn-row">
            <Button type="button" loading={saving} onClick={saveResult}>
              {t('academic.itsMine')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => {
                setLookup(null)
                setIndexNo('')
                setNotMine(true)
                setStep('index')
              }}
            >
              {t('academic.notMine')}
            </Button>
          </div>
          <button type="button" className="link-btn" onClick={() => setStep('manual')}>
            {t('academic.fillManual')}
          </button>
        </div>
      )}

      {step === 'manual' && (
        <div className="wiz-step">
          <span className="card-label">{t('academic.manualTitle')}</span>
          <p className="muted">{t('academic.manualHint')}</p>

          {editing ? (
            <Field label={t('academic.qualification')}>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {levelLabel(lvl)}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label={t('academic.qualification')}>
              <span className="acq-badge">{levelLabel(level)}</span>
            </Field>
          )}

          {!editing && NECTA_LEVELS.includes(level) && (
            <Field label={t('academic.enterIndex')}>
              <input value={indexNo} onChange={(e) => setIndexNo(e.target.value)} spellCheck="false" />
            </Field>
          )}

          {!NECTA_LEVELS.includes(level) && (
            <>
              <Field label={t('academic.school')} optional={true}>
                <input value={manual.school_name} onChange={setM('school_name')} />
              </Field>
              <Field label={t('academic.candidate')} optional={true}>
                <input value={manual.candidate_name} onChange={setM('candidate_name')} />
              </Field>
            </>
          )}

          <div className="card-grid-2">
            <Field label={t('academic.division')} optional={true}>
              <select value={manual.division} onChange={setM('division')}>
                <option value="">—</option>
                <option value="I">Division I</option>
                <option value="II">Division II</option>
                <option value="III">Division III</option>
                <option value="IV">Division IV</option>
                <option value="0">0 (Zero)</option>
              </select>
            </Field>
            <Field label={t('academic.points')} optional={true}>
              <input
                type="number"
                value={manual.points}
                onChange={setM('points')}
                min="0"
                max="100"
              />
            </Field>
            <Field label={t('academic.yearCompleted')} optional={true}>
              <input
                type="number"
                value={manual.year_completed}
                onChange={setM('year_completed')}
                min="1990"
                max={new Date().getFullYear()}
              />
            </Field>
            {(level === 'NVA_III' || level === 'NTA_DIPLOMA') && (
              <Field label={t('academic.avn')} optional={true}>
                <input value={manual.avn_number} onChange={setM('avn_number')} placeholder="19NA12212ME" />
              </Field>
            )}
          </div>

          <Notice type="error">{err}</Notice>
          <div className="btn-row">
            <Button loading={saving} onClick={saveManual} type="button">
              {t('academic.confirmSave')}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
              {t('back')}
            </Button>
          </div>
        </div>
      )}

      {step !== 'manual' && (
        <button
          type="button"
          className="link-btn muted"
          disabled={saving}
          onClick={() => {
            if (step === 'level') onCancel()
            else if (step === 'index') setStep('level')
            else if (step === 'result') setStep('index')
          }}
        >
          {t('back')}
        </button>
      )}
    </div>
  )
}

export default function AcademicInfo() {
  const navigate = useNavigate()
  const { user, refresh } = useMe()
  const profile = user?.applicant_profile
  const rec = profile?.academic_record ?? null
  const { regions, districts, loadDistricts, loading } = usePlaces()

  const { values: prim, patch: setPrim, applyServer, commit } = useDraft('academic', PRIM_INITIAL)
  const [quals, setQuals] = useState(profile?.academic_qualifications ?? [])
  const [showDetails, setShowDetails] = useState(false)
  const [wizard, setWizard] = useState(null)
  const [primError, setPrimError] = useState('')
  const [contError, setContError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!rec) return
    applyServer({
      primary_school_name: rec.primary_school_name ?? '',
      primary_school_region: rec.primary_school_region ?? '',
      primary_school_district: rec.primary_school_district ?? '',
      country: rec.country ?? 'Tanzania',
    })
  }, [rec, applyServer])

  useEffect(() => {
    setQuals(profile?.academic_qualifications ?? [])
  }, [profile])

  useEffect(() => {
    if (!regions.length || !prim.primary_school_region) return
    const r = regions.find((x) => x.name === prim.primary_school_region)
    if (r) loadDistricts(r.id)
  }, [regions, prim.primary_school_region, loadDistricts])

  function setPrimKey(key) {
    return (e) => setPrim((p) => ({ ...p, [key]: e.target.value }))
  }

  function onRegionChange(e) {
    const name = e.target.value
    const r = regions.find((x) => x.name === name)
    setPrim((p) => ({ ...p, primary_school_region: name, primary_school_district: '' }))
    loadDistricts(r?.id)
  }

  function onSaved(q) {
    setQuals((list) => {
      const i = list.findIndex((x) => x.id === q.id)
      if (i >= 0) {
        const next = [...list]
        next[i] = q
        return next
      }
      return [...list, q]
    })
    refresh()
  }

  function onRemoved(q) {
    setQuals((list) => list.filter((x) => x.id !== q.id))
    refresh()
  }

  async function removeQual(q) {
    setContError('')
    setPrimError('')
    try {
      await api.delete(`/me/academic/qualifications/${q.id}`)
      onRemoved(q)
    } catch (e) {
      setContError(apiErrors(e, t('misc.error')))
    }
  }

  async function savePrimary() {
    setPrimError('')
    await api.put('/me/academic-info', prim)
  }

  async function onContinue() {
    setContError('')
    setSaving(true)
    try {
      await savePrimary()
      if (!quals.length) {
        setContError(t('academic.atLeastOne'))
        return
      }
      commit()
      await refresh()
      navigate('/apply/payment')
    } catch (e) {
      setContError(apiErrors(e, t('misc.error')))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell stepper currentStep={2}>
      <h1 className="section-title">{t('academic.title')}</h1>
      <p className="lead">{t('academic.subtitle')}</p>

      <section className="card">
        <span className="card-label">{t('academic.primarySchool')}</span>
        <p className="muted">{t('academic.primaryHint')}</p>
        <Field label={t('academic.primaryName')}>
          <input
            value={prim.primary_school_name}
            onChange={setPrimKey('primary_school_name')}
            placeholder="e.g. Mch. Mwansangati Primary School"
          />
        </Field>

        <button type="button" className="link-btn" onClick={() => setShowDetails((v) => !v)}>
          {t('academic.details')}
        </button>

        {showDetails && (
          <div className="card-grid-2">
            <Field label={t('academic.primaryRegion')} optional={true}>
              <select value={prim.primary_school_region} onChange={onRegionChange}>
                <option value="">{loading ? t('misc.loading') : '—'}</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('academic.primaryDistrict')} optional={true}>
              <select
                value={districts.some((d) => d.name === prim.primary_school_district) ? prim.primary_school_district : ''}
                onChange={setPrimKey('primary_school_district')}
                disabled={!prim.primary_school_region}
              >
                <option value="">—</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
        <Notice type="error">{primError}</Notice>
      </section>

      <section className="acq-block">
        <span className="card-label">{t('academic.qualList')}</span>

        {!quals.length && <p className="muted">{t('academic.noQuals')}</p>}

        {quals.map((q) => (
          <div className="acq-card" key={q.id}>
            <span className="acq-badge">{levelLabel(q.level)}</span>
            <div className="acq-info">
              {q.candidate_name && !q.school_name && <span className="acq-school">{q.candidate_name}</span>}
              {q.school_name && (
                <span className="acq-school">
                  {q.school_name}
                  {q.candidate_name ? ` · ${q.candidate_name}` : ''}
                </span>
              )}
              {q.index_no && <span className="acq-index mono">{q.index_no}</span>}
              <span className="acq-meta">
                {[q.division && `${t('academic.divisionAt')}: ${q.division}`, q.points && `${t('academic.pointsAt')}: ${q.points}`, q.year_completed && `${t('academic.yearAt')}: ${q.year_completed}`]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
            {q.confirmed && <span className="acq-conf">{t('academic.confirmedBadge')}</span>}
            <div className="acq-actions">
              <button type="button" className="btn-ghost" onClick={() => setWizard({ mode: 'edit', q })}>
                {t('academic.edit')}
              </button>
              <button type="button" className="btn-ghost danger" onClick={() => removeQual(q)}>
                {t('academic.remove')}
              </button>
            </div>
          </div>
        ))}

        {!wizard && (
          <Button variant="secondary" className="acq-add" onClick={() => setWizard({ mode: 'add' })}>
            + {t('academic.addQualification')}
          </Button>
        )}

        {wizard && (
          <QualWizard
            mode={wizard.mode}
            initial={wizard.mode === 'edit' ? wizard.q : null}
            onSaved={onSaved}
            onCancel={() => setWizard(null)}
          />
        )}
      </section>

      <Notice type="error">{contError}</Notice>

      <div className="btn-row">
        <Button type="button" variant="secondary" onClick={() => navigate('/apply/kin')}>
          {t('back')}
        </Button>
        <Button type="button" loading={saving} onClick={onContinue}>
          {t('next')}
        </Button>
      </div>
    </AppShell>
  )
}