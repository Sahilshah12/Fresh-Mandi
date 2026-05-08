const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export const backendOrigin = apiBase.replace(/\/api\/?$/, '')

export const getBackendUrl = (path = '') => {
  if (!path) return backendOrigin
  const normalizedPath = String(path).trim().replace(/\\+/g, '/')
  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) return normalizedPath
  return `${backendOrigin}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`
}

export const getProductImageUrl = (product = {}) => {
  const rawPath = product.imageURL || product.imageUrl || product.image || ''
  return rawPath ? getBackendUrl(rawPath) : ''
}