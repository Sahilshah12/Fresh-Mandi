import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

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
      const orderPromises = Object.entries(ordersByFarmer).map(([farmerId, products]) => {
        const orderTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
        return API.post('/orders', {
          farmerId,
          products,
          totalPrice: orderTotal,
          deliveryMode,
          deliveryAddress: deliveryMode === 'delivery' ? address : undefined
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Delivery Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryMode === 'pickup'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="mr-2"
                    />
                    <span>Pickup from Mandi</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryMode === 'delivery'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="mr-2"
                    />
                    <span>Home Delivery</span>
                  </label>
                </div>
              </div>

              {deliveryMode === 'delivery' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                    required={deliveryMode === 'delivery'}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} × {item.cartQuantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.price * item.cartQuantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>• Orders will be grouped by farmer</p>
              <p>• Payment on delivery/pickup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
