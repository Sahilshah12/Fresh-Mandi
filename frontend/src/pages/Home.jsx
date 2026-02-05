import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌾 FreshMandi
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            City-Based Farmer–Consumer Marketplace
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Connecting local farmers with consumers for fresh, quality produce
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-12">
            <Link 
              to="/register" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Get Started
            </Link>
            <Link 
              to="/consumer" 
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🚜</div>
            <h3 className="text-xl font-bold mb-2">For Farmers</h3>
            <p className="text-gray-600">
              List your produce, manage inventory, and connect directly with consumers
            </p>
            <Link to="/register" className="text-green-600 hover:underline mt-2 inline-block">
              Register as Farmer →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-2">For Consumers</h3>
            <p className="text-gray-600">
              Browse fresh produce by city, place orders, and support local farmers
            </p>
            <Link to="/consumer" className="text-green-600 hover:underline mt-2 inline-block">
              Start Shopping →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
            <p className="text-gray-600">
              Manage users, approve farmers, and view analytics dashboard
            </p>
            <Link to="/login" className="text-green-600 hover:underline mt-2 inline-block">
              Admin Login →
            </Link>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                1
              </div>
              <h4 className="font-bold mb-2">Register</h4>
              <p className="text-sm text-gray-600">Create your account as farmer or consumer</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                2
              </div>
              <h4 className="font-bold mb-2">Browse</h4>
              <p className="text-sm text-gray-600">Filter products by city and category</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                3
              </div>
              <h4 className="font-bold mb-2">Order</h4>
              <p className="text-sm text-gray-600">Add to cart and place your order</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                4
              </div>
              <h4 className="font-bold mb-2">Deliver</h4>
              <p className="text-sm text-gray-600">Choose pickup or home delivery</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Registered Farmers</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Consumers</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2025 FreshMandi. Connecting farmers and consumers.</p>
          <p className="text-gray-400 text-sm">
            Built with React, Node.js, MongoDB, and ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}
