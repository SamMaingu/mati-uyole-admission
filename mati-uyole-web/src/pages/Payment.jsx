import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../lib/i18n'
import { formatTZS } from '../lib/format'
import AppShell from '../components/AppShell'
import { Button, Notice, apiErrors } from '../components/ui'
import api from '../lib/api'
import { useMe } from '../lib/useMe'

export default function Payment() {
  const navigate = useNavigate()
  const { refresh } = useMe()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [marking, setMarking] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.post('/applications')
      setApp(data.application)
      if (!data.application.payment?.control_number && data.application.payment?.status !== 'paid') {
        const res = await api.post(`/payments/${data.application.id}/initiate`)
        setApp((a) => ({ ...a, payment: res.data.payment }))
      }
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

  async function initControlNumber() {
    setGenerating(true)
    setError('')
    try {
      const res = await api.post(`/payments/${app.id}/initiate`)
      setApp((a) => ({ ...a, payment: res.data.payment }))
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setGenerating(false)
    }
  }

  async function markPaid() {
    setMarking(true)
    setError('')
    try {
      const res = await api.post(`/payments/${app.id}/mark-paid`)
      setApp((a) => ({ ...a, payment: res.data.payment }))
      await load()
      await refresh()
    } catch (err) {
      setError(apiErrors(err, t('misc.error')))
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <AppShell stepper currentStep={3}>
        <div className="card center">{t('misc.loading')}</div>
      </AppShell>
    )
  }

  const payment = app?.payment
  const paid = payment?.status === 'paid'

  return (
    <AppShell stepper currentStep={3}>
      <h1 className="section-title">{t('payment.title')}</h1>

      <Notice type="error">{error}</Notice>

      {paid ? (
        <div className="card">
          <Notice type="success">{t('payment.paid')}</Notice>
          <dl className="dl">
            <div className="dl-row">
              <dt>{t('application.no')}</dt>
              <dd className="mono">{payment.receipt_reference ?? '—'}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="card">
          {payment?.control_number ? (
            <>
              <p className="lead" style={{ marginBottom: 0 }}>
                {t('payment.method')}
              </p>
              <div className="control-no">{payment.control_number}</div>
              <dl className="dl">
                <div className="dl-row">
                  <dt>{t('payment.amount')}</dt>
                  <dd>{formatTZS(payment.amount)}</dd>
                </div>
                <div className="dl-row">
                  <dt>{t('payment.bank')}</dt>
                  <dd>NMB / GePG</dd>
                </div>
              </dl>
              <Notice type="info">{t('payment.receipt')}</Notice>
              <div className="test-paid-box">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.location.reload()}
                  style={{ marginTop: 12 }}
                >
                  {t('payment.pending')}
                </Button>
                <Button type="button" onClick={markPaid} loading={marking} style={{ marginTop: 12 }}>
                  {t('payment.testPaid')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Notice type="info">{t('payment.method')}</Notice>
              <Button type="button" onClick={initControlNumber} loading={generating}>
                {t('payment.generate')}
              </Button>
            </>
          )}
        </div>
      )}

      <div className="step-nav">
        <Button type="button" variant="secondary" onClick={() => navigate('/apply/academic')}>
          {t('back')}
        </Button>
        {paid && (
          <Button type="button" onClick={() => navigate('/apply/programmes')}>
            {t('next')}
          </Button>
        )}
      </div>
    </AppShell>
  )
}