import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    const demos = {
      consumer: { email: 'ankit123@gmail.com', password: 'ankit123' },
      farmer: { email: 'suraj123@gmail.com', password: 'suraj123' },
      admin: { email: 'sahil123@gmail.com', password: 'sahil123' }
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
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`)
      
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-12 text-white shadow-2xl">
            <h1 className="text-5xl font-bold mb-6">Welcome to FreshMandi</h1>
            <p className="text-xl mb-8 text-green-100">
              Connect directly with local farmers and get fresh produce delivered to your doorstep
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🌾</div>
                <div>
                  <h3 className="font-semibold text-lg">Direct from Farms</h3>
                  <p className="text-green-100 text-sm">Skip the middleman, support local farmers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">💰</div>
                <div>
                  <h3 className="font-semibold text-lg">Fair Prices</h3>
                  <p className="text-green-100 text-sm">Best value for farmers and consumers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">🚚</div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Delivery</h3>
                  <p className="text-green-100 text-sm">Fresh produce at your doorstep</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to Continue</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="your.email@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                '🚀 Login'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Login</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('consumer')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                🛒 Consumer
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('farmer')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                🚜 Farmer
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                👔 Admin
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Create one now
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured with SSL encryption
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
