import { getLang, setLang } from '../lib/i18n'

export default function LangSwitch() {
  const lang = getLang()
  const next = lang === 'sw' ? 'EN' : 'SW'

  return (
    <button
      type="button"
      className="lang-switch"
      onClick={() => setLang(lang === 'sw' ? 'en' : 'sw')}
      aria-label={`Switch to ${next}`}
    >
      {next}
    </button>
  )
}