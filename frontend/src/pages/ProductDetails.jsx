/**
 * ProductDetails Component
 * Displays detailed information about a specific product including:
 * - Product image, name, category, price, quantity
 * - Farmer information and location
 * - QR code for quick sharing
 * - Add to cart functionality
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { QRCodeSVG } from 'qrcode.react'
import StarRating from '../components/StarRating'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
    loadCurrentUser()
  }, [id])

  /**
   * Fetch product details from backend API
   */
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`)
      setProduct(res.data)
    } catch (err) {
      console.error('Fetch product error:', err)
      toast.error('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch product reviews
   */
  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/product/${id}`)
      setReviews(res.data)
    } catch (err) {
      console.error('Fetch reviews error:', err)
    }
  }

  /**
   * Load current user from localStorage
   */
  const loadCurrentUser = () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error('Failed to parse user')
      }
    }
  }

  /**
   * Handle review submitted
   */
  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews])
    setShowReviewForm(false)
    fetchProduct() // Refresh product to get updated rating
  }

  /**
   * Handle review deleted
   */
  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(r => r._id !== reviewId))
    fetchProduct() // Refresh product to get updated rating
  }

  /**
   * Handle review updated
   */
  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(r => r._id === updatedReview._id ? updatedReview : r))
  }

  /**
   * Handle add to cart with specified quantity
   */
  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    navigate('/cart')
  }

  /**
   * Download QR code as image
   */
  const downloadQR = () => {
    const svg = document.getElementById('product-qr')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${product.name}-QR.png`
        link.href = url
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <p className="text-center text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Link to="/consumer" className="text-green-600 hover:text-green-700">
          Browse Products
        </Link>
      </div>
    )
  }

  // Generate product URL for QR code
  const productURL = `${window.location.origin}/product/${product._id}`

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-green-600">Home</Link>
        {' > '}
        <Link to="/consumer" className="hover:text-green-600">Products</Link>
        {' > '}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left Column - Image */}
          <div>
            {product.imageURL ? (
              <img 
                src={`http://localhost:5000${product.imageURL}`}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">No image available</span>
              </div>
            )}

            {/* QR Code Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-3">Share this product</p>
              <QRCodeSVG 
                id="product-qr"
                value={productURL}
                size={150}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
              <button
                onClick={downloadQR}
                className="mt-3 text-sm text-green-600 hover:text-green-700"
              >
                Download QR Code
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Average Rating */}
            {product.reviewCount > 0 && (
              <div className="mb-3">
                <StarRating rating={product.averageRating} size="md" />
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            {/* Category Badge */}
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {product.category}
            </span>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-green-600">
                ₹{product.price}
                <span className="text-lg text-gray-500 ml-2">/ {product.unit || 'kg'}</span>
              </p>
            </div>

            {/* Availability */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Available Quantity</p>
              <p className="text-2xl font-bold text-blue-600">
                {product.quantity} {product.unit || 'kg'}
              </p>
              {product.available ? (
                <span className="inline-block mt-2 text-sm text-green-600 font-medium">
                  ✓ In Stock
                </span>
              ) : (
                <span className="inline-block mt-2 text-sm text-red-600 font-medium">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-medium text-gray-900">📍 {product.city}</p>
            </div>

            {/* Farmer Information */}
            {product.farmerId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Farmer Details</p>
                <p className="text-lg font-bold text-gray-900">{product.farmerId.name}</p>
                {product.farmerId.mandi && (
                  <p className="text-sm text-gray-600 mt-1">
                    Mandi: {product.farmerId.mandi}
                  </p>
                )}
                {product.farmerId.city && (
                  <p className="text-sm text-gray-600">
                    City: {product.farmerId.city}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            {product.available && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.quantity}
                    className="w-20 text-center border rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600">
                    (Max: {product.quantity})
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {product.available ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product, quantity)
                      navigate('/checkout')
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fresh produce directly from local farmers</li>
                <li>• Support local agriculture and sustainable farming</li>
                <li>• Quality assured products</li>
                <li>• Home delivery or pickup available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews & Ratings</h2>
        
        {/* Review Summary */}
        {product.reviewCount > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {product.averageRating.toFixed(1)}
                </div>
                <StarRating rating={product.averageRating} size="md" />
                <p className="text-sm text-gray-600 mt-2">
                  Based on {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {currentUser && currentUser.role === 'consumer' && (
          <div className="mb-6">
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition"
              >
                ✍️ Write a Review
              </button>
            )}
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm 
              productId={product._id}
              onReviewSubmitted={handleReviewSubmitted}
            />
            <button
              onClick={() => setShowReviewForm(false)}
              className="mt-3 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Reviews List */}
        <ReviewList 
          reviews={reviews}
          currentUser={currentUser}
          productOwnerId={product.farmerId._id}
          onReviewDeleted={handleReviewDeleted}
          onReviewUpdated={handleReviewUpdated}
        />
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/consumer')}
          className="text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          ← Back to Products
        </button>
      </div>
    </div>
  )
}
