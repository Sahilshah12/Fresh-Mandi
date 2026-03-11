import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api' })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      const currentPath = window.location.pathname
      // Only clear auth and redirect if not already on login/register pages
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('auth-change'))
        
        // Optional: Show a message
        // import toast from 'react-hot-toast'
        // toast.error('Your session has expired. Please login again.')
        
        // Redirect to login
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API
