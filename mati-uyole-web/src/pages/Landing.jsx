import { Link } from 'react-router-dom'
import {
  Sprout,
  ArrowRight,
  GraduationCap,
  Globe,
  Search,
  UserPlus,
  ClipboardList,
  Hammer,
  Briefcase,
} from 'lucide-react'
import { t } from '../lib/i18n'
import LangSwitch from '../components/LangSwitch'

const NAV = [
  { id: 'top', key: 'nav.home', href: '#top' },
  { id: 'kozi', key: 'nav.courses', href: '#kozi' },
  { id: 'maelekezo', key: 'nav.how', href: '#maelekezo' },
  { id: 'wasiliana', key: 'nav.contact', href: '#wasiliana' },
]

const STEPS = [
  { num: '01', key: 'landing.step1.title', text: 'landing.step1.text', icon: UserPlus },
  { num: '02', key: 'landing.step2.title', text: 'landing.step2.text', icon: ClipboardList },
  { num: '03', key: 'landing.step3.title', text: 'landing.step3.text', icon: Search },
]

const FEATS = [
  { key: 'landing.about.f1', text: 'landing.about.f1t', icon: GraduationCap },
  { key: 'landing.about.f2', text: 'landing.about.f2t', icon: Hammer },
  { key: 'landing.about.f3', text: 'landing.about.f3t', icon: Briefcase },
]

export default function Landing() {
  return (
    <div className="landing">
      <header className="land-top" id="top">
        <div className="l-wrap">
          <div className="l-head-row">
            <div className="l-head-box">
              <a href="#top" className="l-emb" aria-label={t('app.name')}>
                <img src="/logo.png" alt="MATI Uyole — nembo ya chuo" className="l-emb-img l-emb-mati" />
              </a>

              <div className="l-head-title">
                <span className="l-title-bar">
                  <span className="l-title">CHUO CHA KILIMO UYOLE</span>
                </span>
                <p className="l-title-sub">{t('landing.header.tagline')}</p>
              </div>

              <span className="l-emb" aria-hidden="true">
                <img
                  src="/cortofarm.png"
                  alt=""
                  className="l-emb-img l-emb-arm"
                  loading="eager"
                />
              </span>
            </div>

            <div className="l-util">
              <LangSwitch />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------------------------------------------------- Hero */}
        <section className="hero">
          <div className="l-wrap hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">{t('landing.hero.badge')}</span>
              <h1 className="hero-title">{t('landing.hero.title')}</h1>
              <p className="hero-sub">{t('landing.hero.sub')}</p>
              <p className="hero-help">{t('landing.hero.support')}</p>

              <div className="hero-cta">
                <Link to="/register" className="btn btn-lg">
                  {t('landing.hero.primary')} <ArrowRight size={18} strokeWidth={2} />
                </Link>
                <a href="#maelekezo" className="btn btn-lg btn-ghost">
                  {t('landing.hero.secondary')}
                </a>
              </div>

              <p className="hero-login">
                {t('login.noAccount')}{' '}
                <Link to="/login" className="hero-login-link">
                  {t('login.create')}
                </Link>
              </p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <Sprout className="hv-mark" size={250} strokeWidth={0.7} />
              <div className="hv-inner">
                <div className="hv-head">
                  <span className="hv-eyebrow">{t('landing.how.title')}</span>
                  <span className="hv-year mono">2026/2027</span>
                </div>
                <ul className="hv-list">
                  {STEPS.map((s) => {
                    const Icon = s.icon
                    return (
                      <li key={s.num}>
                        <span className="hv-num mono">{s.num}</span>
                        <Icon size={18} strokeWidth={1.75} />
                        <span>{t(s.key)}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="hv-foot">
                  <span className="hv-mini">{t('application.no')}</span>
                  <span className="hv-appno mono">MATI-2026-XXXXXX</span>
                </div>
              </div>
              <span className="hv-bar" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Admission info */}
        <section className="admission" id="kozi">
          <div className="l-wrap">
            <div className="ad-card">
              <div className="ad-copy">
                <h2 className="sec-title">{t('landing.enroll.title')}</h2>
                <p className="sec-lead">{t('landing.enroll.text')}</p>
              </div>

              <div className="ad-items">
                <div className="ad-item">
                  <span className="ad-icon">
                    <GraduationCap size={20} strokeWidth={1.75} />
                  </span>
                  <span className="ad-k">{t('landing.enroll.i1k')}</span>
                  <span className="ad-v">{t('landing.enroll.i1v')}</span>
                </div>
                <div className="ad-item">
                  <span className="ad-icon">
                    <Globe size={20} strokeWidth={1.75} />
                  </span>
                  <span className="ad-k">{t('landing.enroll.i2k')}</span>
                  <span className="ad-v">{t('landing.enroll.i2v')}</span>
                </div>
                <div className="ad-item">
                  <span className="ad-icon">
                    <Search size={20} strokeWidth={1.75} />
                  </span>
                  <span className="ad-k">{t('landing.enroll.i3k')}</span>
                  <span className="ad-v">{t('landing.enroll.i3v')}</span>
                </div>
              </div>

              <div className="ad-actions">
                <Link to="/register" className="btn btn-lg ad-cta">
                  {t('landing.enroll.cta')} <ArrowRight size={18} strokeWidth={2} />
                </Link>
                <p className="switch-line">
                  {t('login.noAccount')}{' '}
                  <Link to="/login" className="hero-login-link">
                    {t('login.create')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- How to apply */}
        <section className="how" id="maelekezo">
          <div className="l-wrap">
            <h2 className="sec-title sec-center">{t('landing.how.title')}</h2>
            <div className="steps-grid">
              {STEPS.map((s) => {
                const Icon = s.icon
                return (
                  <div className="step-card" key={s.num}>
                    <span className="step-num mono">{s.num}</span>
                    <span className="step-icon">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <h3>{t(s.key)}</h3>
                    <p>{t(s.text)}</p>
                  </div>
                )
              })}
            </div>
            <div className="how-cta">
              <Link to="/register" className="btn btn-lg">
                {t('landing.hero.primary')} <ArrowRight size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Institution */}
        <section className="about __landing-about">
          <div className="l-wrap about-grid">
            <div className="about-copy">
              <h2 className="sec-title">{t('landing.about.title')}</h2>
              <p className="sec-lead">{t('landing.about.text')}</p>
            </div>
            <ul className="feats">
              {FEATS.map((f) => {
                const Icon = f.icon
                return (
                  <li className="feat" key={f.key}>
                    <span className="feat-icon">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <span className="feat-body">
                      <strong>{t(f.key)}</strong>
                      <span>{t(f.text)}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------- Footer */}
      <footer className="land-footer" id="wasiliana">
        <div className="l-wrap">
          <div className="lf-grid">
            <div className="lf-brand">
              <p className="lf-name">MATI UYOLE</p>
              <p className="lf-sub">{t('landing.footer.sub')}</p>
            </div>
            <nav className="lf-links" aria-label={t('landing.nav.label')}>
              {NAV.map((n) => (
                <a key={n.id} href={n.href}>
                  {t(n.key)}
                </a>
              ))}
            </nav>
          </div>
          <div className="lf-bottom">
            <span>{t('app.sub')}</span>
            <span>{t('landing.footer.rights')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}