import { Check } from 'lucide-react'
import { WIZARD_STEPS } from '../lib/steps'
import { t } from '../lib/i18n'

export default function Stepper({ current }) {
  return (
    <ol className="steps">
      {WIZARD_STEPS.map((step, i) => {
        const cls = i < current ? 'done' : i === current ? 'active' : ''
        return (
          <li key={step.id} className={`steps-i ${cls}`.trim()}>
            <span className="steps-dot">
              {i < current ? <Check size={13} strokeWidth={2.5} /> : i + 1}
            </span>
            <span className="steps-label">{t(step.labelKey)}</span>
          </li>
        )
      })}
    </ol>
  )
}