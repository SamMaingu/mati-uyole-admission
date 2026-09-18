export function formatTZS(amount) {
  const n = Number(amount)
  if (Number.isNaN(n)) return 'TZS 0'
  return 'TZS ' + n.toLocaleString('en-TZ', { maximumFractionDigits: 0 })
}