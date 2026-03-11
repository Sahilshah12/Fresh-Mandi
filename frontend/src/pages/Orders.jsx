import React, { useState, useEffect } from 'react'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function Orders() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(user.role === 'farmer' ? 'farmer' : 'consumer') // 'consumer' or 'farmer'
  const [expandedFarmer, setExpandedFarmer] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let endpoint
      if (user.role === 'admin') {
        endpoint = '/admin/orders'
      } else if (activeTab === 'consumer') {
        endpoint = '/orders/my-orders'
      } else {
        endpoint = '/orders/farmer-orders'
      }
      const res = await API.get(endpoint)
      setOrders(res.data)
    } catch (err) {
      console.error('Fetch orders error:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Group orders by farmer for admin view
  const getFarmerGroups = () => {
    const groups = {}
    orders.forEach(order => {
      const fid = order.farmerId?._id || 'unknown'
      if (!groups[fid]) {
        groups[fid] = {
          farmer: order.farmerId,
          orders: [],
          totalRevenue: 0,
          completedRevenue: 0,
          orderCount: 0,
          pendingCount: 0,
          completedCount: 0,
        }
      }
      groups[fid].orders.push(order)
      groups[fid].totalRevenue += order.totalPrice || 0
      groups[fid].orderCount += 1
      if (order.status === 'completed') {
        groups[fid].completedRevenue += order.totalPrice || 0
        groups[fid].completedCount += 1
      }
      if (order.status === 'pending' || order.status === 'confirmed') {
        groups[fid].pendingCount += 1
      }
    })
    // Sort by total revenue descending
    return Object.values(groups).sort((a, b) => b.totalRevenue - a.totalRevenue)
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

  const markPaymentReceived = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/payment`)
      toast.success(
        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <p className="font-bold text-gray-900">Payment Received!</p>
            <p className="text-xs text-gray-500">COD payment marked as paid</p>
          </div>
        </div>,
        { duration: 2000, style: { minWidth: '240px' } }
      )
      fetchOrders()
    } catch (err) {
      console.error('Payment update error:', err)
      toast.error(err.response?.data?.message || 'Failed to update payment status')
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
      <h1 className="text-3xl font-bold mb-6">{user.role === 'farmer' ? 'View Orders' : user.role === 'admin' ? 'Check Orders' : 'My Orders'}</h1>

      {/* ── ADMIN: Farmer-wise transaction view ── */}
      {user.role === 'admin' && (
        <>
          {loading ? (
            <p className="text-center text-gray-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white p-8 rounded shadow text-center">
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (() => {
            const groups = getFarmerGroups()
            const maxRevenue = groups[0]?.totalRevenue || 1
            return (
              <div className="space-y-4">
                {/* Summary bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
                    <p className="text-green-100 text-xs mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
                    <p className="text-blue-100 text-xs mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">₹{orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(0)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
                    <p className="text-purple-100 text-xs mb-1">Farmers Active</p>
                    <p className="text-3xl font-bold">{groups.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow">
                    <p className="text-orange-100 text-xs mb-1">Top Farmer</p>
                    <p className="text-lg font-bold truncate">{groups[0]?.farmer?.name || '—'}</p>
                  </div>
                </div>

                {/* Farmer cards */}
                {groups.map((group, idx) => (
                  <div key={group.farmer?._id || idx} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    {/* Farmer header */}
                    <div
                      className="p-5 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => setExpandedFarmer(expandedFarmer === (group.farmer?._id) ? null : group.farmer?._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {idx === 0 && (
                            <span className="text-2xl" title="Top Farmer">🏆</span>
                          )}
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              {group.farmer?.name || 'Unknown Farmer'}
                              {idx === 0 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">Highest Revenue</span>}
                            </h2>
                            {group.farmer?.mandi && (
                              <p className="text-sm text-gray-500">📍 {group.farmer.mandi}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-400 text-xl">{expandedFarmer === group.farmer?._id ? '▲' : '▼'}</span>
                      </div>

                      {/* Stats row */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">Total Revenue</p>
                          <p className="text-xl font-bold text-green-700">₹{group.totalRevenue.toFixed(0)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">Total Orders</p>
                          <p className="text-xl font-bold text-blue-700">{group.orderCount}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">Completed</p>
                          <p className="text-xl font-bold text-purple-700">{group.completedCount}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">Pending</p>
                          <p className="text-xl font-bold text-orange-700">{group.pendingCount}</p>
                        </div>
                      </div>

                      {/* Revenue bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((group.totalRevenue / maxRevenue) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{((group.totalRevenue / maxRevenue) * 100).toFixed(1)}% of top farmer revenue</p>
                      </div>
                    </div>

                    {/* Expanded order list */}
                    {expandedFarmer === group.farmer?._id && (
                      <div className="border-t border-gray-200">
                        <div className="p-4 bg-gray-50">
                          <h3 className="font-semibold text-gray-700 mb-3">All Transactions ({group.orders.length})</h3>
                          <div className="space-y-3">
                            {group.orders.map(order => (
                              <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8)}</p>
                                    <p className="text-xs text-gray-500">🕒 {new Date(order.createdAt).toLocaleString()}</p>
                                    {order.consumerId && (
                                      <p className="text-sm text-gray-700 mt-1">
                                        Customer: <span className="font-medium">{order.consumerId.name}</span>
                                        {order.consumerId.email && <span className="text-gray-400 ml-1">({order.consumerId.email})</span>}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>
                                <div className="mt-2 space-y-1">
                                  {order.products.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm text-gray-600">
                                      <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
                                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                  <span className="text-xs text-gray-500">{order.paymentMethod === 'cod' ? '💵 COD' : '📱 Online'} · {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</span>
                                  <span className="font-bold text-green-700">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}
        </>
      )}

      {/* ── FARMER / CONSUMER view ── */}
      {user.role !== 'admin' && (
        <>
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
                        🕒 Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.updatedAt && order.updatedAt !== order.createdAt && (
                        <p className="text-sm text-gray-500">
                          🔄 Updated: {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      )}
                      {activeTab === 'consumer' && order.farmerId && (
                        <p className="text-sm text-gray-700 mt-1">
                          Farmer: <span className="font-medium">{order.farmerId.name}</span>
                          {order.farmerId.mandi && (
                            <span className="text-gray-500"> • {order.farmerId.mandi}</span>
                          )}
                        </p>
                      )}
                      {activeTab === 'consumer' && order.farmerId?.address && (
                        <p className="text-xs text-gray-600 mt-1">
                          📍 {order.farmerId.address}
                          {order.farmerId.city && `, ${order.farmerId.city}`}
                          {order.farmerId.pincode && ` - ${order.farmerId.pincode}`}
                        </p>
                      )}
                      {activeTab === 'consumer' && order.farmerId?.phone && (
                        <p className="text-xs text-gray-600 mt-1">
                          📱 {order.farmerId.phone}
                        </p>
                      )}
                      {activeTab === 'farmer' && order.consumerId && (
                        <p className="text-sm text-gray-700 mt-1">
                          Customer: <span className="font-medium">{order.consumerId.name}</span>
                        </p>
                      )}
                      {activeTab === 'farmer' && order.consumerId?.address && (
                        <p className="text-xs text-gray-600 mt-1">
                          📍 {order.consumerId.address}
                          {order.consumerId.city && `, ${order.consumerId.city}`}
                          {order.consumerId.pincode && ` - ${order.consumerId.pincode}`}
                        </p>
                      )}
                      {activeTab === 'farmer' && order.consumerId?.phone && (
                        <p className="text-xs text-gray-600 mt-1">
                          📱 {order.consumerId.phone}
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
                    <div className="border-t mt-3 pt-3 space-y-1.5">
                      {order.deliveryCharge > 0 && (
                        <>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Products Subtotal</span>
                            <span>₹{(order.productsTotal || (order.totalPrice - order.deliveryCharge)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-orange-600">
                            <span className="flex items-center gap-1">
                              🚚 Delivery Charge
                              {order.deliveryDistance > 0 && (
                                <span className="text-xs text-gray-400">({order.deliveryDistance} km)</span>
                              )}
                            </span>
                            <span>₹{order.deliveryCharge.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-dashed border-gray-200 pt-1.5"></div>
                        </>
                      )}
                      <div className="flex justify-between font-bold">
                        <span>Grand Total</span>
                        <span className="text-green-600">₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="border-t mt-4 pt-4 text-sm text-gray-600">
                    <p>Delivery: <span className="font-medium">{order.deliveryMode === 'pickup' ? '🏪 Pickup from Mandi' : '🚚 Home Delivery'}</span>
                      {order.deliveryMode === 'delivery' && order.deliveryDistance > 0 && (
                        <span className="ml-2 text-orange-600 font-medium">({order.deliveryDistance} km · ₹{order.deliveryCharge?.toFixed(2)})</span>
                      )}
                      {order.deliveryMode === 'pickup' && (
                        <span className="ml-2 text-green-600 font-medium">(FREE)</span>
                      )}
                    </p>
                    {order.deliveryAddress && (
                      <p className="mt-1">Address: <span className="font-medium">{order.deliveryAddress}</span></p>
                    )}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium">{order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 Online Payment'}</span>
                      {order.paymentStatus && (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      )}
                      {/* Farmer: mark COD payment received */}
                      {activeTab === 'farmer'
                        && order.paymentMethod === 'cod'
                        && order.paymentStatus === 'pending'
                        && (order.status === 'completed' || order.status === 'ready') && (
                        <button
                          onClick={() => markPaymentReceived(order._id)}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
                        >
                          💰 Mark Payment Received
                        </button>
                      )}
                    </div>
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
        </>
      )}
    </div>
  )
}
