import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, UserRound, LogOut, X, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { t } from '../lib/i18n'
import { useAuth } from '../context/AuthContext'
import Stepper from './Stepper'
import Sidebar from './Sidebar'
import LangSwitch from './LangSwitch'

export default function AppShell({ children, stepper, currentStep }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const menuRef = useRef(null)
  const avatarRef = useRef(null)
  const dropRef = useRef(null)

  const closeMenu = () => setMenuOpen(false)
  const closeSide = () => setSideOpen(false)

  useEffect(() => {
    function onOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        avatarRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    dropRef.current?.querySelector('[role="menuitem"]')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (!sideOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setSideOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [sideOpen])

  const initial = (user?.first_name?.[0] ?? 'M').toUpperCase()

  async function onLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="app">
      {user && (
        <>
          <div className={`sidebar-scrim ${sideOpen ? 'show' : ''}`} onClick={closeSide} />
          <aside
            id="app-sidebar"
            className={`app-sidebar ${sideOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}
            aria-label={t('sidebar.app')}
          >
            <div className="aside-top">
              <Link to="/dashboard" className="aside-brand" onClick={closeSide}>
                <span className="brand-logo">
                  <img src="/logo.png" alt="" className="logo-img" />
                </span>
                <span className="brand-text">
                  <span className="brand-name">{t('app.name')}</span>
                  <span className="brand-sub aside-sub">{t('app.headerSub')}</span>
                </span>
              </Link>
              <button
                type="button"
                className="side-col-btn"
                aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed((c) => !c)}
              >
                {collapsed ? <ChevronsRight size={16} strokeWidth={2} /> : <ChevronsLeft size={16} strokeWidth={2} />}
              </button>
            </div>

            <nav className="aside-nav" onClick={closeSide}>
              <Sidebar />
            </nav>

            <div className="aside-foot">
              <Link to="/profile" className="aside-link" onClick={closeSide}>
                <UserRound size={15} strokeWidth={1.75} />
                <span className="aside-link-txt">{t('profile.title')}</span>
              </Link>
              <button type="button" className="aside-link" onClick={onLogout}>
                <LogOut size={15} strokeWidth={1.75} />
                <span className="aside-link-txt">{t('logout')}</span>
              </button>
            </div>
          </aside>
        </>
      )}

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              {user && (
                <button
                  type="button"
                  className="icon-btn menu-btn"
                  aria-label={t('sidebar.open')}
                  aria-controls="app-sidebar"
                  aria-expanded={sideOpen}
                  onClick={() => setSideOpen((o) => !o)}
                >
                  {sideOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
                </button>
              )}
              <Link to={user ? '/dashboard' : '/'} className="brand topbar-brand">
                <span className="brand-logo">
                  <img src="/logo.png" alt="" className="logo-img" />
                </span>
                <span className="brand-text">
                  <span className="brand-name">{t('app.name')}</span>
                  <span className="brand-sub">{t('app.headerSub')}</span>
                </span>
              </Link>
            </div>

            {user && (
              <div className="topbar-right">
                <LangSwitch />
                {user.application_number && (
                  <span className="mono-badge">{user.application_number}</span>
                )}
                <div className={`umenu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
                  <button
                    ref={avatarRef}
                    className="avatar"
                    aria-label={t('profile.menu')}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    {user.photo_url ? (
                      <img src={user.photo_url} alt="" className="avatar-img" />
                    ) : (
                      initial
                    )}
                  </button>
                  {menuOpen && (
                    <div className="umenu-drop" role="menu" ref={dropRef}>
                      <div className="umenu-id">
                        <span className="umenu-name">
                          {user.first_name} {user.last_name ?? ''}
                        </span>
                        <span className="umenu-phone mono">{user.application_number}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="umenu-item"
                        role="menuitem"
                        onClick={closeMenu}
                      >
                        <UserRound size={15} strokeWidth={1.75} />
                        {t('profile.title')}
                      </Link>
                      <button className="umenu-item" role="menuitem" onClick={onLogout}>
                        <LogOut size={15} strokeWidth={1.75} />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="main">
          {stepper && <Stepper current={currentStep} />}
          {children}
        </main>
      </div>
    </div>
  )
}