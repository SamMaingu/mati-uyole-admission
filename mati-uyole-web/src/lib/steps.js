import { t } from './i18n'

export const APP_STEPS = [
  { id: 'account', labelKey: 'stepper.account' },
  { id: 'personal', labelKey: 'stepper.personal' },
  { id: 'kin', labelKey: 'stepper.kin' },
  { id: 'academic', labelKey: 'stepper.academic' },
  { id: 'payment', labelKey: 'stepper.payment' },
  { id: 'programme', labelKey: 'stepper.programme' },
  { id: 'review', labelKey: 'stepper.review' },
]

export const WIZARD_STEPS = APP_STEPS.filter((s) => s.id !== 'kin')

const labelOf = Object.fromEntries(APP_STEPS.map((s) => [s.id, s.labelKey]))

export function stepLabel(id) {
  return labelOf[id] ? t(labelOf[id]) : id
}