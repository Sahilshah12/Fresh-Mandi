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
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="p-4 bg-white shadow">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex gap-4">
            <Link to="/" className="hover:text-green-600 font-medium">Home</Link>
            <Link to="/consumer" className="hover:text-green-600">Browse Products</Link>
            {user && <Link to="/orders" className="hover:text-green-600">Orders</Link>}
            {!user && (
              <>
                <Link to="/login" className="hover:text-green-600">Login</Link>
                <Link to="/register" className="hover:text-green-600">Register</Link>
              </>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Cart Icon */}
              <Link to="/cart" className="relative hover:text-green-600">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <span className="text-sm text-gray-600">Hello, <span className="font-medium text-gray-900">{user.name}</span></span>
              {user.role === 'farmer' && (
                <Link to="/farmer" className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  My Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">
                Logout
              </button>
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
        <Toaster position="top-right" />
      </main>
    </div>
  )
}
