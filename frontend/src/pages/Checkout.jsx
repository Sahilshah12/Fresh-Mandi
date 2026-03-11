import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../services/api'
import toast from 'react-hot-toast'

const DELIVERY_RATE_PER_KM = 3 // ₹3 per km

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState('')
  const [distance, setDistance] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const deliveryCharge = deliveryMode === 'delivery' && parseFloat(distance) > 0
    ? parseFloat((parseFloat(distance) * DELIVERY_RATE_PER_KM).toFixed(2))
    : 0
  const grandTotal = parseFloat((cartTotal + deliveryCharge).toFixed(2))

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (deliveryMode === 'delivery' && !address.trim()) {
      toast.error('Please enter your delivery address')
      return
    }

    if (deliveryMode === 'delivery' && (!distance || parseFloat(distance) <= 0)) {
      toast.error('Please enter a valid delivery distance')
      return
    }

    // If online payment, show QR code first
    if (paymentMethod === 'online' && !paymentConfirmed) {
      setShowQRCode(true)
      return
    }

    setLoading(true)
    try {
      // Group products by farmer
      const ordersByFarmer = {}
      cart.forEach(item => {
        const farmerId = item.farmerId?._id || item.farmerId
        if (!ordersByFarmer[farmerId]) {
          ordersByFarmer[farmerId] = []
        }
        ordersByFarmer[farmerId].push({
          productId: item._id,
          quantity: item.cartQuantity,
          price: item.price
        })
      })

      // Create separate orders for each farmer
      const farmerCount = Object.keys(ordersByFarmer).length
      // Split delivery charge evenly across farmers
      const perFarmerDeliveryCharge = farmerCount > 0
        ? parseFloat((deliveryCharge / farmerCount).toFixed(2))
        : 0

      const orderPromises = Object.entries(ordersByFarmer).map(([farmerId, products]) => {
        const productsTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
        const orderTotal = parseFloat((productsTotal + perFarmerDeliveryCharge).toFixed(2))
        return API.post('/orders', {
          farmerId,
          products,
          totalPrice: orderTotal,
          deliveryCharge: perFarmerDeliveryCharge,
          productsTotal,
          deliveryMode,
          deliveryAddress: deliveryMode === 'delivery' ? address : undefined,
          deliveryDistance: deliveryMode === 'delivery' ? parseFloat(distance) : 0,
          paymentMethod,
          paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending'
        })
      })

      await Promise.all(orderPromises)
      
      clearCart()
      toast.success(`Order${orderPromises.length > 1 ? 's' : ''} placed successfully!`)
      navigate('/orders')
    } catch (err) {
      console.error('Order error:', err)
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/consumer')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">🛒 Checkout</h1>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">💳 Complete Payment</h2>
            <p className="text-gray-600 text-center mb-6">Scan QR code to pay ₹{grandTotal.toFixed(2)} via PhonePe/UPI</p>
            
            {/* PhonePe QR Code */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl mb-6 border-2 border-purple-200">
              <div className="bg-white p-3 rounded-xl shadow-inner flex items-center justify-center">
                <img
                  src="/phonepe-qr.png"
                  alt="PhonePe QR Code"
                  className="w-56 h-56 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-56 h-56 hidden items-center justify-center bg-gray-100 rounded-lg text-center p-4">
                  <div>
                    <p className="text-4xl mb-2">📱</p>
                    <p className="text-sm text-gray-500">Place <code className="bg-gray-200 px-1 rounded">phonepe-qr.png</code> in <code className="bg-gray-200 px-1 rounded">frontend/public/</code></p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 space-y-1">
                <p className="text-sm font-semibold text-purple-700">Scan with PhonePe / GPay / Paytm / Any UPI App</p>
                <p className="text-lg font-bold text-green-700">Amount: ₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setPaymentConfirmed(true)
                  setShowQRCode(false)
                  toast.success('Payment confirmed! Placing order...')
                  // Trigger order placement
                  setTimeout(() => {
                    handlePlaceOrder({ preventDefault: () => {} })
                  }, 500)
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
              >
                ✓ I've Completed Payment
              </button>
              <button
                onClick={() => {
                  setShowQRCode(false)
                  setPaymentConfirmed(false)
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="text-2xl mr-2">📍</span>
              Delivery Details
            </h2>
            <form onSubmit={handlePlaceOrder}>
              {/* Delivery Mode */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    deliveryMode === 'pickup' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryMode === 'pickup'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">🏪 Pickup from Mandi</div>
                      <div className="text-xs text-gray-500 mt-1">Collect from farmer's location</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    deliveryMode === 'delivery' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryMode === 'delivery'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">🚚 Home Delivery</div>
                      <div className="text-xs text-gray-500 mt-1">Delivered to your doorstep</div>
                    </div>
                  </label>
                </div>
              </div>

              {deliveryMode === 'delivery' && (
                <div className="mb-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📮 Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your complete address with landmark"
                      rows={3}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required={deliveryMode === 'delivery'}
                    />
                  </div>

                  {/* Delivery Distance Input */}
                  <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📏 Distance from Farmer (in km) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-40 border-2 border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-lg font-semibold"
                        required={deliveryMode === 'delivery'}
                      />
                      <span className="text-gray-600 font-medium">km</span>
                      {parseFloat(distance) > 0 && (
                        <span className="ml-auto bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                          🚚 ₹{(parseFloat(distance) * DELIVERY_RATE_PER_KM).toFixed(2)} delivery charge
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">📌 Delivery rate: ₹{DELIVERY_RATE_PER_KM}/km</p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">💳 Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">💵 Cash on Delivery</div>
                      <div className="text-xs text-gray-500 mt-1">Pay when you receive</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'online' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">📱 Online Payment</div>
                      <div className="text-xs text-gray-500 mt-1">PhonePe/UPI QR Code</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </span>
                ) : paymentMethod === 'online' ? (
                  '💳 Proceed to Payment'
                ) : (
                  '📦 Place Order'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm pb-3 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.cartQuantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-200 pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Product Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  🚚 Delivery Charges
                  {deliveryMode === 'delivery' && parseFloat(distance) > 0 && (
                    <span className="text-xs text-gray-400">({distance} km × ₹{DELIVERY_RATE_PER_KM})</span>
                  )}
                </span>
                {deliveryMode === 'pickup' ? (
                  <span className="text-green-600 font-medium">FREE (Pickup)</span>
                ) : deliveryCharge > 0 ? (
                  <span className="text-orange-600 font-semibold">₹{deliveryCharge.toFixed(2)}</span>
                ) : (
                  <span className="text-gray-400 italic">Enter distance</span>
                )}
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-dashed border-gray-300 pt-3 mt-2">
                <span>Grand Total</span>
                <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <p className="text-xs text-gray-600 mb-2 flex items-center">
                <span className="text-lg mr-2">ℹ️</span>
                <span className="font-semibold">Important Information</span>
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-7">
                <li>• Orders grouped by farmer</li>
                <li>• {paymentMethod === 'cod' ? 'Pay on delivery/pickup' : 'Payment required before order'}</li>
                <li>• Fresh products guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
