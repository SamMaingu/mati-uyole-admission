import { t } from './i18n'

export const NTA_LEVELS = [4, 5, 6]

export const STORAGE_KEY = 'programme_category'

export const CATEGORIES = NTA_LEVELS.map((level) => ({
  level,
  key: `category.nta${level}`,
  sub: `category.nta${level}Sub`,
}))

function readStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveCategory(level) {
  try {
    localStorage.setItem(STORAGE_KEY, String(level))
  } catch {
    /* ignore */
  }
}

export function getCategory() {
  const value = Number(readStorage())
  return NTA_LEVELS.includes(value) ? value : null
}

export function clearCategory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function categoryLabel(level) {
  return t(`category.nta${level}`)
}