import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { t } from '../lib/i18n'
import { CATEGORIES, saveCategory } from '../lib/categories'
import AuthLayout from '../components/AuthLayout'

export default function ProgramCategory() {
  const navigate = useNavigate()

  function choose(level) {
    saveCategory(level)
    navigate('/register')
  }

  return (
    <AuthLayout
      title={t('category.title')}
      note={t('category.note')}
      badge={t('landing.hero.badge')}
      switchTo="/login"
      switchLabel={t('login.submit')}
    >
      <div className="card">
        <span className="card-label">{t('category.title')}</span>
        <div className="cat-list">
          {CATEGORIES.map((c, i) => (
            <button
              type="button"
              className="cat-card"
              key={c.level}
              onClick={() => choose(c.level)}
            >
              <span className="step-num mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="cat-body">
                <b>{t(c.key)}</b>
                <span className="cat-sub">{t(c.sub)}</span>
              </span>
              <span className="cat-arrow">
                <span>{t('category.apply')}</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}