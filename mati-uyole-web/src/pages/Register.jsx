import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import { Button, Field, Notice, apiErrors } from '../components/ui'
import { useToast } from '../components/Toast'
import { validPhone, validEmail } from '../lib/validate'
import { getCategory, clearCategory, categoryLabel } from '../lib/categories'
import AuthLayout from '../components/AuthLayout'

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const category = getCategory()
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
    if (!form.first_name.trim() || form.first_name.trim().length < 2) errs.first_name = t('errors.firstName')
    if (!form.last_name.trim() || form.last_name.trim().length < 2) errs.last_name = t('errors.lastName')
    if (!validPhone(form.phone)) errs.phone = t('errors.phone')
    if (form.email && !validEmail(form.email)) errs.email = t('errors.email')
    if (form.password.length < 6) errs.password = 'Neno la siri liwe na herufi 6 au zaidi'
    if (form.password !== form.password_confirmation) errs.confirm = 'Maneno ya siri hayalingani'
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
      const payload = { ...form, ...(category ? { nta_level: category } : {}) }
      await register(payload)
      clearCategory()
      toast.success(t('toast.accountCreated'))
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
      title={t('register.title')}
      note={t('register.note')}
      badge={t('landing.hero.badge')}
      switchTo="/login"
      switchLabel={t('login.submit')}
    >
      <form className="card" onSubmit={onSubmit}>
        <Notice type="error">{error}</Notice>
        <Notice type="info">{t('register.hint')}</Notice>
        {category && (
          <Notice type="info">
            {t('category.selected')} <b>{categoryLabel(category)}</b>
          </Notice>
        )}

        <Field label={t('register.firstName')} error={errors.first_name}>
          <input
            className={errors.first_name ? 'error' : ''}
            value={form.first_name}
            onChange={(e) => {
              set('first_name')(e)
              clearError('first_name')
            }}
            required
          />
        </Field>

        <Field label={t('register.middleName')} optional={true}>
          <input value={form.middle_name} onChange={set('middle_name')} />
        </Field>

        <Field label={t('register.lastName')} error={errors.last_name}>
          <input
            className={errors.last_name ? 'error' : ''}
            value={form.last_name}
            onChange={(e) => {
              set('last_name')(e)
              clearError('last_name')
            }}
            required
          />
        </Field>

        <Field label={t('register.phone')} error={errors.phone}>
          <input
            className={errors.phone ? 'error' : ''}
            value={form.phone}
            onChange={(e) => {
              set('phone')(e)
              clearError('phone')
            }}
            inputMode="tel"
            placeholder="0712 345 678"
            required
          />
        </Field>

        <Field label={t('register.email')} optional={true} error={errors.email}>
          <input
            className={errors.email ? 'error' : ''}
            type="email"
            value={form.email}
            onChange={(e) => {
              set('email')(e)
              clearError('email')
            }}
          />
        </Field>

        <Field label={t('register.password')} error={errors.password}>
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

        <Field label={t('register.confirm')} error={errors.confirm}>
          <input
            className={errors.confirm ? 'error' : ''}
            type="password"
            value={form.password_confirmation}
            onChange={(e) => {
              set('password_confirmation')(e)
              clearError('confirm')
            }}
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