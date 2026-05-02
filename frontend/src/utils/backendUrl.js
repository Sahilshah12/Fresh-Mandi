const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export const backendOrigin = apiBase.replace(/\/api\/?$/, '')

export const getBackendUrl = (path = '') => {
  if (!path) return backendOrigin
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${backendOrigin}${path.startsWith('/') ? path : `/${path}`}`
}