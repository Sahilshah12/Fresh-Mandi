import React, { useState, useEffect } from 'react'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('consumer') // 'consumer' or 'farmer'
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'consumer' 
        ? '/orders/my-orders'
        : '/orders/farmer-orders'
      
      const res = await API.get(endpoint)
      setOrders(res.data)
    } catch (err) {
      console.error('Fetch orders error:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } catch (err) {
      console.error('Update status error:', err)
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Tabs */}
      {user.role === 'farmer' && (
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('consumer')}
            className={`px-4 py-2 rounded ${
              activeTab === 'consumer'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            My Purchases
          </button>
          <button
            onClick={() => setActiveTab('farmer')}
            className={`px-4 py-2 rounded ${
              activeTab === 'farmer'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Orders Received
          </button>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600 mb-4">
            {activeTab === 'consumer' ? 'You haven\'t placed any orders yet' : 'No orders received yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-mono">{order._id.slice(-8)}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {activeTab === 'consumer' && order.farmerId && (
                    <p className="text-sm text-gray-700 mt-1">
                      Farmer: <span className="font-medium">{order.farmerId.name}</span>
                      {order.farmerId.mandi && (
                        <span className="text-gray-500"> • {order.farmerId.mandi}</span>
                      )}
                    </p>
                  )}
                  {activeTab === 'farmer' && order.consumerId && (
                    <p className="text-sm text-gray-700 mt-1">
                      Customer: <span className="font-medium">{order.consumerId.name}</span>
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Products */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.productId?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t mt-4 pt-4 text-sm text-gray-600">
                <p>Delivery: <span className="font-medium">{order.deliveryMode === 'pickup' ? 'Pickup from Mandi' : 'Home Delivery'}</span></p>
                {order.deliveryAddress && (
                  <p className="mt-1">Address: <span className="font-medium">{order.deliveryAddress}</span></p>
                )}
              </div>

              {/* Actions for Farmer */}
              {activeTab === 'farmer' && order.status !== 'completed' && order.status !== 'cancelled' && (
                <div className="border-t mt-4 pt-4 flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'ready')}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      Mark Ready for Pickup/Delivery
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
