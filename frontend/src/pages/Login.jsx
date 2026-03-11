import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    const demos = {
      consumer: { email: 'ankit123@gmail.com', password: 'ankit123' },
      farmer: { email: 'suraj123@gmail.com', password: 'suraj123' }
    }
    setEmail(demos[role].email)
    setPassword(demos[role].password)
    toast.success(`Demo ${role} credentials filled!`)
  }

  const submit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      setUser(res.data.user)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('auth-change'))
      
      const roleIcon = res.data.user.role === 'farmer' ? '🚜' : res.data.user.role === 'admin' ? '⚙️' : '🛒'
      const roleLabel = res.data.user.role.charAt(0).toUpperCase() + res.data.user.role.slice(1)
      toast.success(
        <div className="flex items-center gap-3">
          <span className="text-3xl">{roleIcon}</span>
          <div>
            <p className="font-bold text-gray-900">Welcome back, {res.data.user.name}!</p>
            <p className="text-xs text-gray-500">Logged in as {roleLabel}</p>
          </div>
        </div>,
        { duration: 2000, style: { minWidth: '260px' } }
      )
      
      // Redirect based on role
      setTimeout(() => {
        if (res.data.user.role === 'farmer') {
          navigate('/farmer')
        } else if (res.data.user.role === 'admin') {
          navigate('/admin')
        } else if (res.data.user.role === 'consumer') {
          navigate('/consumer')
        } else {
          navigate('/')
        }
      }, 500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome Back to<br/>🌾 FreshMandi</h1>
              <p className="text-xl mb-8 text-green-50 leading-relaxed">
                Connect directly with local farmers and get fresh produce delivered to your doorstep
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start group hover:translate-x-2 transition-transform duration-300">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">🌾</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Direct from Farms</h3>
                  <p className="text-green-50 text-sm opacity-90">Skip the middleman, support local farmers</p>
                </div>
              </div>
              <div className="flex items-start group hover:translate-x-2 transition-transform duration-300">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">💰</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Fair Prices</h3>
                  <p className="text-green-50 text-sm opacity-90">Best value for farmers and consumers</p>
                </div>
              </div>
              <div className="flex items-start group hover:translate-x-2 transition-transform duration-300">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">🚚</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Quick Delivery</h3>
                  <p className="text-green-50 text-sm opacity-90">Fresh produce at your doorstep</p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-10 pt-8 border-t border-green-500/30">
              <p className="text-sm text-green-50 mb-3">Trusted by farmers and consumers</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-xs text-white font-bold">+1k</div>
                </div>
                <div className="text-yellow-300 text-sm flex items-center gap-1">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span className="text-green-50">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to Continue</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input 
                type="email"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                placeholder="your.email@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xl"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline transition">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>Login to FreshMandi</span>
                </span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">⚡ Quick Demo Login</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('consumer')}
                className="px-3 py-3 text-sm font-medium border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                <div className="text-xl mb-1">🛒</div>
                <div className="text-xs">Consumer</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('farmer')}
                className="px-3 py-3 text-sm font-medium border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                <div className="text-xl mb-1">🚜</div>
                <div className="text-xs">Farmer</div>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-bold hover:underline transition">
                Create one now →
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <span>🛡️</span>
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Branding */}
      <div className="lg:hidden mt-8 text-center text-gray-600">
        <p className="text-sm">© 2025 FreshMandi. Connecting farmers and consumers.</p>
      </div>
    </div>
  )
}
