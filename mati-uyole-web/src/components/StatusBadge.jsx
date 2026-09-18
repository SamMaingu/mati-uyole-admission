import { t } from '../lib/i18n'

const POSITIVE = new Set(['paid', 'submitted', 'eligible', 'selected', 'admission_completed'])
const NEGATIVE = new Set(['additional_info_required', 'not_eligible', 'not_selected'])

export default function StatusBadge({ status }) {
  let tone = 'neutral'
  if (POSITIVE.has(status)) tone = 'positive'
  else if (NEGATIVE.has(status)) tone = 'negative'
  return <span className={`badge ${tone}`}>{t(`status.${status}`)}</span>
}