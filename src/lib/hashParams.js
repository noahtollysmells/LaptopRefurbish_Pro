// Helper to read query params when using HashRouter
export function getHashQueryParams() {
  const hash = window.location.hash || ''
  const qIndex = hash.indexOf('?')
  const search = qIndex >= 0 ? hash.slice(qIndex + 1) : ''
  return new URLSearchParams(search)
}

export default getHashQueryParams
