export function loadDraft(key) {
  try {
    const raw = localStorage.getItem(`draft:${key}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDraft(key, value) {
  try {
    localStorage.setItem(`draft:${key}`, JSON.stringify(value))
  } catch {
    localStorage.removeItem(`draft:${key}`)
  }
}

export function clearDraft(key) {
  localStorage.removeItem(`draft:${key}`)
}