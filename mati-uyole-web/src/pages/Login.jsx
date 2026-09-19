import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import { useToast } from '../components/Toast'
import { validPhone } from '../lib/validate'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!form.phone.trim()) errs.phone = t('field.required')
    else if (!validPhone(form.phone)) errs.phone = t('errors.phone')
    if (!form.password) errs.password = t('field.required')
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function clearError(key) {
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(form)
      toast.success(t('toast.welcomeBack'))
      navigate('/dashboard')
    } catch (err) {
      const msg = apiErrors(err, t('misc.error'))
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t('login.title')}
      note={t('app.tagline')}
      badge={t('landing.hero.badge')}
      switchTo="/register"
      switchLabel={t('login.create')}
    >
      <form className="card" onSubmit={onSubmit}>
        <Notice type="error">{error}</Notice>

        <Field label={t('login.phone')} error={errors.phone}>
          <input
            className={errors.phone ? 'error' : ''}
            value={form.phone}
            onChange={(e) => {
              set('phone')(e)
              clearError('phone')
            }}
            inputMode="tel"
            required
          />
        </Field>

        <Field label={t('login.password')} error={errors.password}>
          <input
            className={errors.password ? 'error' : ''}
            type="password"
            value={form.password}
            onChange={(e) => {
              set('password')(e)
              clearError('password')
            }}
            required
          />
        </Field>

        <Button type="submit" loading={loading}>
          {t('login.submit')}
        </Button>

        <div className="switch-line">
          {t('register.hint')} <Link to="/register">{t('login.create')}</Link>
        </div>
      </form>
    </AuthLayout>
  )
}