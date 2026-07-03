const STORAGE_KEY = 'mockTest'

export const mockTestProgress = {
  init(testId) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ testId, results: {} }))
  },
  saveResult(module, data) {
    try {
      const p = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      p.results[module] = data
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    } catch {}
  },
  setSessionId(sessionId) {
    try {
      const p = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      p.currentSessionId = sessionId
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    } catch {}
  },
  getSessionId() {
    try {
      const p = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      return p.currentSessionId
    } catch {
      return null
    }
  },
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  },
  clear() {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
