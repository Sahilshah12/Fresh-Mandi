import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'consumer', 
    city: '', 
    mandi: '' 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Validation function
  const validateForm = () => {
    const newErrors = {}
    
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (form.name.length < 3) newErrors.name = 'Name must be at least 3 characters'
    
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'
    
    if (!form.password) newErrors.password = 'Password is required'
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    if (!form.city.trim()) newErrors.city = 'City is required'
    
    if (form.role === 'farmer' && !form.mandi.trim()) {
      newErrors.mandi = 'Mandi location is required for farmers'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...submitData } = form
      await API.post('/auth/register', submitData)
      toast.success('🎉 Registered successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join FreshMandi and start your journey</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selection Cards */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I want to register as:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setForm({...form, role: 'consumer'})}
                className={`p-4 rounded-lg border-2 transition-all ${
                  form.role === 'consumer' 
                    ? 'border-green-600 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-semibold">Consumer</div>
                <div className="text-xs text-gray-600">Buy fresh produce</div>
              </button>
              
              <button
                type="button"
                onClick={() => setForm({...form, role: 'farmer'})}
                className={`p-4 rounded-lg border-2 transition-all ${
                  form.role === 'farmer' 
                    ? 'border-green-600 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">🚜</div>
                <div className="font-semibold">Farmer</div>
                <div className="text-xs text-gray-600">Sell your produce</div>
              </button>
              
              <button
                type="button"
                onClick={() => setForm({...form, role: 'admin'})}
                className={`p-4 rounded-lg border-2 transition-all ${
                  form.role === 'admin' 
                    ? 'border-green-600 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">👔</div>
                <div className="font-semibold">Admin</div>
                <div className="text-xs text-gray-600">Manage platform</div>
              </button>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                value={form.name} 
                onChange={(e) => {
                  setForm({...form, name: e.target.value})
                  setErrors({...errors, name: ''})
                }}
                required 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
                value={form.email} 
                onChange={(e) => {
                  setForm({...form, email: e.target.value})
                  setErrors({...errors, email: ''})
                }}
                required 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Min. 6 characters"
                  value={form.password} 
                  onChange={(e) => {
                    setForm({...form, password: e.target.value})
                    setErrors({...errors, password: ''})
                  }}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
                value={form.confirmPassword} 
                onChange={(e) => {
                  setForm({...form, confirmPassword: e.target.value})
                  setErrors({...errors, confirmPassword: ''})
                }}
                required 
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                value={form.city} 
                onChange={(e) => {
                  setForm({...form, city: e.target.value})
                  setErrors({...errors, city: ''})
                }}
                required
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Mandi Location (Only for Farmers) */}
            {form.role === 'farmer' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mandi/Market Location <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white ${
                    errors.mandi ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., APMC Market, Vashi"
                  value={form.mandi} 
                  onChange={(e) => {
                    setForm({...form, mandi: e.target.value})
                    setErrors({...errors, mandi: ''})
                  }}
                  required={form.role === 'farmer'}
                />
                {errors.mandi && <p className="text-red-500 text-xs mt-1">{errors.mandi}</p>}
                <p className="text-xs text-gray-600 mt-2">
                  ℹ️ This will be visible to consumers when they view your products
                </p>
              </div>
            )}

            {/* Submit Button */}
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
                  Creating Account...
                </span>
              ) : (
                '✨ Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm font-semibold">Secure Platform</div>
            <div className="text-xs text-gray-600">Your data is safe with us</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-semibold">Quick Setup</div>
            <div className="text-xs text-gray-600">Start buying or selling instantly</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-semibold">Fair Prices</div>
            <div className="text-xs text-gray-600">Direct farmer-consumer trade</div>
          </div>
        </div>
      </div>
    </div>
  )
}
