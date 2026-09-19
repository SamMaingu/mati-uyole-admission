export const PHONE_RE = /^0\d{9}$|^(\+?255)\d{9}$/
export const INDEX_RE = /^[SP]\d{4}\/\d{4}\/\d{4}$/
export const AVN_RE = /^\d{2}[A-Z]{2}\d+[A-Z]{2}$/
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validPhone = (v) => PHONE_RE.test((v ?? '').trim())
export const validIndex = (v) => INDEX_RE.test((v ?? '').trim())
export const validEmail = (v) => !v || EMAIL_RE.test(v.trim())
export const validAvn = (v) => !v || AVN_RE.test(v.trim())

export const MIN_AGE = 15
export const MAX_AGE = 100

export function ageFrom(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
  return age
}

export function validDob(dob) {
  const age = ageFrom(dob)
  return age !== null && age >= MIN_AGE && age <= MAX_AGE
}