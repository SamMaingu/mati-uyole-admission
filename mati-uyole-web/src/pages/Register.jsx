import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import AuthLayout from '../components/AuthLayout'

const PHONE_RE = /^0\d{9}$|^(\+?255)\d{9}$/

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function validate() {
    const errs = {}
    if (!PHONE_RE.test(form.phone)) errs.phone = t('errors.phone')
    if (form.password.length < 6) errs.password = 'Neno la siri liwe na herufi 6 au zaidi'
    if (form.password !== form.password_confirmation) errs.confirm = 'Maneno ya siri hayalingani'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const data = await register(form)
      if (data.user?.application_number) {
        navigate('/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t('register.title')}
      note={t('register.note')}
      badge={t('landing.hero.badge')}
      switchTo="/login"
      switchLabel={t('login.submit')}
    >
      <form className="card" onSubmit={onSubmit}>
        <Notice type="error">{error}</Notice>
        <Notice type="info">{t('register.hint')}</Notice>

        <Field label={t('register.firstName')}>
          <input value={form.first_name} onChange={set('first_name')} required />
        </Field>

        <Field label={t('register.middleName')} optional={true}>
          <input value={form.middle_name} onChange={set('middle_name')} />
        </Field>

        <Field label={t('register.lastName')}>
          <input value={form.last_name} onChange={set('last_name')} required />
        </Field>

        <Field label={t('register.phone')} error={errors.phone}>
          <input
            className={errors.phone ? 'error' : ''}
            value={form.phone}
            onChange={set('phone')}
            inputMode="tel"
            placeholder="0712 345 678"
            required
          />
        </Field>

        <Field label={t('register.email')} optional={true}>
          <input type="email" value={form.email} onChange={set('email')} />
        </Field>

        <Field label={t('register.password')} error={errors.password}>
          <input
            className={errors.password ? 'error' : ''}
            type="password"
            value={form.password}
            onChange={set('password')}
            required
          />
        </Field>

        <Field label={t('register.confirm')} error={errors.confirm}>
          <input
            className={errors.confirm ? 'error' : ''}
            type="password"
            value={form.password_confirmation}
            onChange={set('password_confirmation')}
            required
          />
        </Field>

        <Button type="submit" loading={loading}>
          {t('register.submit')}
        </Button>

        <div className="switch-line">
          {t('login.noAccount')} <Link to="/login">{t('login.submit')}</Link>
        </div>
      </form>
    </AuthLayout>
  )
}