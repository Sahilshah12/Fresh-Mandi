import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        // Invalid user data
      }
    }
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Farmer from Mumbai",
      image: "🧑‍🌾",
      text: "FreshMandi helped me reach thousands of customers directly. My income has increased by 40% since joining!"
    },
    {
      name: "Priya Sharma",
      role: "Consumer from Delhi",
      image: "👩",
      text: "I love getting fresh vegetables directly from farmers. The quality is amazing and prices are fair!"
    },
    {
      name: "Amit Patel",
      role: "Farmer from Gujarat",
      image: "👨‍🌾",
      text: "No more middlemen taking huge cuts. FreshMandi gave me the platform to sell directly and fairly."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className={`max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="inline-block animate-float mb-6">
              <span className="text-7xl md:text-8xl">🌾</span>
            </div>
            
            {/* Personalized Welcome for Logged-in Users */}
            {user ? (
              <>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                  Welcome Back, <span className="text-yellow-300">{user.name}!</span>
                </h1>
                <p className="text-xl md:text-2xl text-green-50 mb-4 max-w-3xl mx-auto">
                  {user.role === 'farmer' && "Manage your products and reach thousands of customers"}
                  {user.role === 'consumer' && "Discover fresh produce from local farmers"}
                  {user.role === 'admin' && "Monitor and manage the FreshMandi platform"}
                </p>
                <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                  Ready to continue your journey with FreshMandi?
                </p>
                
                {/* Quick Action Buttons for Logged-in Users */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  {user.role === 'farmer' && (
                    <>
                      <Link 
                        to="/farmer" 
                        className="bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                      >
                        🚜 Go to Dashboard
                      </Link>
                      <Link 
                        to="/orders" 
                        className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
                      >
                        📦 View Orders
                      </Link>
                    </>
                  )}
                  {user.role === 'consumer' && (
                    <>
                      <Link 
                        to="/consumer" 
                        className="bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                      >
                        🛒 Browse Products
                      </Link>
                      <Link 
                        to="/orders" 
                        className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
                      >
                        📦 My Orders
                      </Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Link 
                        to="/admin" 
                        className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                      <Link 
                        to="/consumer" 
                        className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
                      >
                        🛒 Browse as Viewer
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Default Welcome for Non-logged-in Users */
              <>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                  Welcome to <span className="text-yellow-300">FreshMandi</span>
                </h1>
                <p className="text-xl md:text-2xl text-green-50 mb-4 max-w-3xl mx-auto">
                  India's First City-Based Farmer–Consumer Marketplace
                </p>
                <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                  Connecting local farmers with consumers for fresh, quality produce. No middlemen, fair prices, happy farmers!
                </p>
                
                {/* CTA Buttons for Non-logged-in Users */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link 
                    to="/register" 
                    className="bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                  >
                    🚀 Get Started Free
                  </Link>
                  <Link 
                    to="/consumer" 
                    className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
                  >
                    🛒 Browse Products
                  </Link>
                </div>
              </>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-green-50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>1000+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose FreshMandi?</h2>
          <p className="text-xl text-gray-600">Everything you need for fresh farm-to-table produce</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Farmers */}
          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100 hover:border-green-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🚜</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Farmers</h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>List unlimited products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Manage inventory easily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Direct connection with consumers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>No middlemen, better prices</span>
              </li>
            </ul>
            {!user ? (
              <Link 
                to="/register" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
              >
                Register as Farmer →
              </Link>
            ) : user.role === 'farmer' ? (
              <Link 
                to="/farmer" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <div className="inline-block bg-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                ✓ Logged In
              </div>
            )}
          </div>

          {/* For Consumers */}
          <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🛒</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Consumers</h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Fresh produce from local farms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Filter by city and category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Easy online ordering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span>Support local farmers</span>
              </li>
            </ul>
            {!user || user.role === 'consumer' ? (
              <Link 
                to="/consumer" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Start Shopping →
              </Link>
            ) : (
              <div className="inline-block bg-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                ✓ Logged In
              </div>
            )}
          </div>

          {/* Admin Panel */}
          <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-100 hover:border-purple-300">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Admin Panel</h3>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Manage all users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Approve farmer registrations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>View analytics dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Monitor platform activity</span>
              </li>
            </ul>
            {!user ? (
              <div className="inline-block bg-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                🔒 Contact Admin
              </div>
            ) : user.role === 'admin' ? (
              <Link 
                to="/admin" 
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                Admin Dashboard →
              </Link>
            ) : (
              <div className="inline-block bg-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                ✓ Logged In
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "1", icon: "✍️", title: "Register", desc: "Create your account as farmer or consumer" },
              { num: "2", icon: "🔍", title: "Browse", desc: "Filter fresh products by city and category" },
              { num: "3", icon: "🛍️", title: "Order", desc: "Add to cart and place your order easily" },
              { num: "4", icon: "🚚", title: "Deliver", desc: "Choose pickup or home delivery option" }
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold text-gray-900 shadow-lg">
                    {step.num}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h4>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600">Real stories from real people</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100">
            <div className="text-6xl mb-6 text-center">{testimonials[activeTestimonial].image}</div>
            <p className="text-xl text-gray-700 italic mb-6 text-center leading-relaxed">
              "{testimonials[activeTestimonial].text}"
            </p>
            <div className="text-center">
              <p className="font-bold text-lg text-gray-900">{testimonials[activeTestimonial].name}</p>
              <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
            </div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activeTestimonial ? 'bg-green-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-green-100">Growing together with our community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "500+", label: "Registered Farmers", icon: "🧑‍🌾" },
              { num: "2000+", label: "Fresh Products", icon: "🥬" },
              { num: "5000+", label: "Happy Consumers", icon: "😊" },
              { num: "50+", label: "Cities Covered", icon: "🏙️" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center transform hover:scale-110 transition-transform">
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.num}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        {!user ? (
          /* Call to Action for Non-logged-in Users */
          <>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of farmers and consumers on FreshMandi today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                🚀 Join FreshMandi Now
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-100 text-gray-900 border-2 border-gray-300 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                Already a Member? Login
              </Link>
            </div>
          </>
        ) : (
          /* Personalized CTA for Logged-in Users */
          <>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Continue Your Journey
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              {user.role === 'farmer' && "Manage your products and grow your business"}
              {user.role === 'consumer' && "Explore fresh products from local farmers"}
              {user.role === 'admin' && "Keep the platform running smoothly"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'farmer' && (
                <>
                  <Link 
                    to="/farmer" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    🚜 Manage Products
                  </Link>
                  <Link 
                    to="/orders" 
                    className="bg-gray-100 text-gray-900 border-2 border-gray-300 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-200 transition-all transform hover:scale-105"
                  >
                    📦 View Orders
                  </Link>
                </>
              )}
              {user.role === 'consumer' && (
                <>
                  <Link 
                    to="/consumer" 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    🛒 Shop Now
                  </Link>
                  <Link 
                    to="/orders" 
                    className="bg-gray-100 text-gray-900 border-2 border-gray-300 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-200 transition-all transform hover:scale-105"
                  >
                    📦 My Orders
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin" 
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    ⚙️ Admin Dashboard
                  </Link>
                  <Link 
                    to="/consumer" 
                    className="bg-gray-100 text-gray-900 border-2 border-gray-300 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-200 transition-all transform hover:scale-105"
                  >
                    🛒 Browse Products
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🌾 FreshMandi</h3>
              <p className="text-gray-400">
                Connecting farmers and consumers for a better, fresher tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Connect With Us</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:text-green-400 transition">📘</a>
                <a href="#" className="hover:text-green-400 transition">📸</a>
                <a href="#" className="hover:text-green-400 transition">🐦</a>
                <a href="#" className="hover:text-green-400 transition">💼</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="mb-2">© 2026 FreshMandi. All rights reserved.</p>
            <p className="text-sm">
              Built with React, Node.js, MongoDB, and ❤️ | Making farmers and consumers happy!
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
