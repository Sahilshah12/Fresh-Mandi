import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FarmerDashboard from './pages/FarmerDashboard'
import ConsumerDashboard from './pages/ConsumerDashboard'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import NotificationBell from './components/NotificationBell'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useCart } from './context/CartContext'

export default function App() {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { cartCount } = useCart()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        // Invalid user data
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth-change'))
    
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Modern Professional Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  FreshMandi
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Farm to Table</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 relative group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {(!user || (user.role !== 'farmer' && user.role !== 'admin')) && (
                <Link 
                  to="/consumer" 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 relative group"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <span>🛒</span>
                    <span>Browse Products</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              {user && (
                <Link 
                  to="/orders" 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 relative group"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <span>📦</span>
                    <span>{user.role === 'farmer' ? 'View Orders' : user.role === 'admin' ? 'Check Orders' : 'My Orders'}</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {!user ? (
                /* Not Logged In */
                <div className="hidden md:flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="px-5 py-2.5 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-50 font-semibold transition-all duration-200 border border-gray-200 hover:border-green-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                /* Logged In User */
                <div className="hidden md:flex items-center gap-4">
                  {/* Notification Bell */}
                  <NotificationBell />
                  
                  {/* Cart Icon */}
                  <Link to="/cart" className="relative hover:text-green-600 transition-colors group">
                    <div className="relative p-2 rounded-lg hover:bg-green-50 transition-all">
                      <span className="text-2xl group-hover:scale-110 transform transition-transform inline-block">🛒</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* User Info & Dashboard */}
                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {/* Role-based Dashboard Button */}
                    {user.role === 'farmer' && (
                      <Link 
                        to="/farmer" 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <span>🚜</span>
                        <span className="hidden xl:inline">Dashboard</span>
                      </Link>
                    )}
                    {user.role === 'consumer' && (
                      <Link 
                        to="/consumer" 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <span>🛍️</span>
                        <span className="hidden xl:inline">Shop</span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <span>⚙️</span>
                        <span className="hidden xl:inline">Admin</span>
                      </Link>
                    )}
                    
                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout} 
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all flex items-center gap-2"
                      title="Logout"
                    >
                      <span>🚪</span>
                      <span className="hidden xl:inline">Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium transition-all"
                >
                  🏠 Home
                </Link>
                {(!user || (user.role !== 'farmer' && user.role !== 'admin')) && (
                  <Link 
                    to="/consumer" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium transition-all"
                  >
                    🛒 Browse Products
                  </Link>
                )}
                {user && (
                  <Link 
                    to="/orders" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium transition-all"
                  >
                    📦 {user.role === 'farmer' ? 'View Orders' : user.role === 'admin' ? 'Check Orders' : 'My Orders'}
                  </Link>
                )}
                
                {!user ? (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-all border border-gray-200"
                    >
                      🔑 Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-center"
                    >
                      🚀 Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {user.role === 'farmer' && (
                      <Link 
                        to="/farmer" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg font-semibold text-center"
                      >
                        🚜 Farmer Dashboard
                      </Link>
                    )}
                    {user.role === 'consumer' && (
                      <Link 
                        to="/consumer" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold text-center"
                      >
                        🛍️ Shop Now
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold text-center"
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-center"
                    >
                      🚪 Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/farmer" element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/consumer" element={<ConsumerDashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
            },
          }}
        />
      </main>
    </div>
  )
}
