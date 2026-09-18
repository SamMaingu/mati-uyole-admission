import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'
import LangSwitch from './LangSwitch'

const INTRO_STEPS = [
  { n: '01', key: 'landing.step1.title' },
  { n: '02', key: 'landing.step2.title' },
  { n: '03', key: 'landing.step3.title' },
]

export default function AuthLayout({ title, note, badge, switchTo, switchLabel, children }) {
  return (
    <div className="auth-page">
      <header className="auth-top">
        <div className="auth-top-in">
          <Link to="/" className="auth-brand">
            <img src="/logo.png" alt={t('app.name')} className="auth-brand-img" />
            <span className="auth-brand-name">MATI UYOLE</span>
          </Link>
          <div className="auth-top-actions">
            <LangSwitch />
            <Link to={switchTo} className="auth-top-link">
              {switchLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="auth-grid">
        <aside className="auth-intro">
          <span className="ai-logo-box">
            <img src="/logo.png" alt="" />
          </span>
          <p className="ai-name">MATI UYOLE</p>
          <p className="ai-sub">{t('landing.institution.sub')}</p>

          <span className="ai-badge">{badge}</span>
          <h1 className="ai-title">{title}</h1>
          <p className="ai-note">{note}</p>

          <ul className="ai-steps">
            {INTRO_STEPS.map((s) => (
              <li key={s.n}>
                <span className="ai-no mono">{s.n}</span>
                <span>{t(s.key)}</span>
              </li>
            ))}
          </ul>
        </aside>

        <section className="auth-col">
          <div className="auth-logo auth-logo-mobile">
            <img src="/logo.png" alt={t('app.name')} className="logo-auth" />
            <h1>{title}</h1>
            <p>{note}</p>
          </div>
          {children}
        </section>
      </main>
    </div>
  )
}