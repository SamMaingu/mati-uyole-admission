import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
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

        <Field label={t('login.phone')}>
          <input value={form.phone} onChange={set('phone')} inputMode="tel" required />
        </Field>

        <Field label={t('login.password')}>
          <input type="password" value={form.password} onChange={set('password')} required />
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