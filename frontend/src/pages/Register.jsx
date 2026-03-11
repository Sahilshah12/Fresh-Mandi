import React, { useState, useEffect } from 'react'
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
    state: '',
    city: '', 
    customCity: '',
    address: '',
    pincode: '',
    phone: '',
    mandi: '' 
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

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
    
    if (!form.state.trim()) newErrors.state = 'State is required'
    
    if (form.city === 'Other') {
      if (!form.customCity.trim()) newErrors.customCity = 'Please enter your city'
    } else {
      if (!form.city.trim()) newErrors.city = 'City is required'
    }
    
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
      const { confirmPassword, customCity, ...submitData } = form
      // Use customCity if city is "Other"
      if (form.city === 'Other') {
        submitData.city = form.customCity
      }
      await API.post('/auth/register', submitData)
      toast.success('🎉 Registered successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statesAndCities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Delhi': ['New Delhi', 'Delhi'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam']
  }

  const cities = form.state ? statesAndCities[form.state] || [] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-2xl mx-auto relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl mb-4 transform hover:scale-110 transition-transform">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Join FreshMandi</h1>
          <p className="text-lg text-gray-600">Create your account and start your journey with us</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Role Selection Cards */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
              ✨ Choose Your Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setForm({...form, role: 'consumer'})}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  form.role === 'consumer' 
                    ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">🛒</div>
                <div className="font-bold text-lg">Consumer</div>
                <div className="text-xs text-gray-600 mt-1">Buy fresh produce</div>
              </button>
              
              <button
                type="button"
                onClick={() => setForm({...form, role: 'farmer'})}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  form.role === 'farmer' 
                    ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">🚜</div>
                <div className="font-bold text-lg">Farmer</div>
                <div className="text-xs text-gray-600 mt-1">Sell your produce</div>
              </button>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your full name"
                value={form.name} 
                onChange={(e) => {
                  setForm({...form, name: e.target.value})
                  setErrors({...errors, name: ''})
                }}
                required 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email"
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="your.email@example.com"
                value={form.email} 
                onChange={(e) => {
                  setForm({...form, email: e.target.value})
                  setErrors({...errors, email: ''})
                }}
                required 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Confirm Password <span className="text-red-500">*</span>
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Re-enter your password"
                value={form.confirmPassword} 
                onChange={(e) => {
                  setForm({...form, confirmPassword: e.target.value})
                  setErrors({...errors, confirmPassword: ''})
                }}
                required 
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.confirmPassword}</p>}
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🗺️ State <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 bg-white ${
                  errors.state ? 'border-red-500' : 'border-gray-200'
                }`}
                value={form.state} 
                onChange={(e) => {
                  setForm({...form, state: e.target.value, city: '', customCity: ''})
                  setErrors({...errors, state: '', city: '', customCity: ''})
                }}
                required
              >
                <option value="">Select your state</option>
                {Object.keys(statesAndCities).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.state}</p>}
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 City <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300 bg-white ${
                  errors.city ? 'border-red-500' : 'border-gray-200'
                }`}
                value={form.city} 
                onChange={(e) => {
                  setForm({...form, city: e.target.value, customCity: ''})
                  setErrors({...errors, city: '', customCity: ''})
                }}
                disabled={!form.state}
                required
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="Other">Other (Write your own)</option>
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.city}</p>}
            </div>

            {/* Custom City Input (When "Other" is selected) */}
            {form.city === 'Other' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ✍️ Enter Your City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white ${
                    errors.customCity ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your city name"
                  value={form.customCity} 
                  onChange={(e) => {
                    setForm({...form, customCity: e.target.value})
                    setErrors({...errors, customCity: ''})
                  }}
                  required
                />
                {errors.customCity && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.customCity}</p>}
              </div>
            )}

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏠 Full Address
              </label>
              <textarea 
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                placeholder="Enter your complete address"
                rows={3}
                value={form.address} 
                onChange={(e) => {
                  setForm({...form, address: e.target.value})
                }}
              />
            </div>

            {/* Phone and Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📱 Phone Number
                </label>
                <input 
                  type="tel"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="10-digit mobile number"
                  value={form.phone} 
                  onChange={(e) => {
                    setForm({...form, phone: e.target.value})
                  }}
                  maxLength={10}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📮 Pincode
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="6-digit pincode"
                  value={form.pincode} 
                  onChange={(e) => {
                    setForm({...form, pincode: e.target.value})
                  }}
                  maxLength={6}
                />
              </div>
            </div>

            {/* Mandi Location (Only for Farmers) */}
            {form.role === 'farmer' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏪 Mandi/Market Location <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white ${
                    errors.mandi ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., APMC Market, Vashi"
                  value={form.mandi} 
                  onChange={(e) => {
                    setForm({...form, mandi: e.target.value})
                    setErrors({...errors, mandi: ''})
                  }}
                  required={form.role === 'farmer'}
                />
                {errors.mandi && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠️</span>{errors.mandi}</p>}
                <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                  <span>ℹ️</span>
                  <span>This will be visible to consumers when they view your products</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
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
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Create Account</span>
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline transition">
                Login here →
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-sm font-bold mb-1">Secure Platform</div>
            <div className="text-xs text-gray-600">Your data is safe with us</div>
          </div>
          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-sm font-bold mb-1">Quick Setup</div>
            <div className="text-xs text-gray-600">Start buying or selling instantly</div>
          </div>
          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm font-bold mb-1">Fair Prices</div>
            <div className="text-xs text-gray-600">Direct farmer-consumer trade</div>
          </div>
        </div>
      </div>
    </div>
  )
}
