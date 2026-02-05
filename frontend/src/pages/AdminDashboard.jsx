/**
 * AdminDashboard Component
 * Comprehensive admin panel for managing FreshMandi platform
 * Features:
 * - User management (view, approve, delete)
 * - Product management (view, delete)
 * - Order management and monitoring
 * - Analytics dashboard with charts
 * - Real-time statistics
 */

import React, { useState, useEffect } from 'react'
import API from '../services/api'
import toast from 'react-hot-toast'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

// Color palette for charts
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalConsumers: 0,
    pendingApprovals: 0,
    totalProducts: 0,
    totalOrders: 0
  })
  const [chartData, setChartData] = useState({
    usersByRole: [],
    ordersByStatus: [],
    productsByCategory: [],
    ordersOverTime: []
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  useEffect(() => {
    if (users.length > 0 || products.length > 0 || orders.length > 0) {
      prepareChartData()
    }
  }, [users, products, orders])

  /**
   * Fetch data based on active tab
   */
  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'analytics' || activeTab === 'users') {
        const res = await API.get('/admin/users')
        setUsers(res.data)
        calculateStats(res.data, products, orders)
      }
      if (activeTab === 'analytics' || activeTab === 'products') {
        const res = await API.get('/admin/products')
        setProducts(res.data)
        calculateStats(users, res.data, orders)
      }
      if (activeTab === 'analytics' || activeTab === 'orders') {
        const res = await API.get('/admin/orders')
        setOrders(res.data)
        calculateStats(users, products, res.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate statistics from data
   */
  const calculateStats = (usersData, productsData, ordersData) => {
    const farmers = usersData.filter(u => u.role === 'farmer')
    const consumers = usersData.filter(u => u.role === 'consumer')
    const pending = farmers.filter(f => !f.approved).length
    
    setStats({
      totalUsers: usersData.length,
      totalFarmers: farmers.length,
      totalConsumers: consumers.length,
      pendingApprovals: pending,
      totalProducts: productsData.length,
      totalOrders: ordersData.length
    })
  }

  /**
   * Prepare data for charts
   */
  const prepareChartData = () => {
    // Users by role
    const roleCount = {}
    users.forEach(u => {
      roleCount[u.role] = (roleCount[u.role] || 0) + 1
    })
    const usersByRole = Object.entries(roleCount).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count
    }))

    // Orders by status
    const statusCount = {}
    orders.forEach(o => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1
    })
    const ordersByStatus = Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count: count
    }))

    // Products by category
    const categoryCount = {}
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })
    const productsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      count: count
    }))

    // Orders over time (last 7 days)
    const ordersOverTime = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const count = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate.toDateString() === date.toDateString()
      }).length
      ordersOverTime.push({ date: dateStr, orders: count })
    }

    setChartData({
      usersByRole,
      ordersByStatus,
      productsByCategory,
      ordersOverTime
    })
  }

  /**
   * Approve a farmer account
   */

  const handleApprove = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/approve`)
      toast.success('Farmer approved successfully')
      fetchData()
    } catch (err) {
      console.error('Approve error:', err)
      toast.error('Failed to approve farmer')
    }
  }

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return

    try {
      await API.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchData()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete user')
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    try {
      await API.delete(`/admin/products/${productId}`)
      toast.success('Product deleted successfully')
      fetchData()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Farmers</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalFarmers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Consumers</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalConsumers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Pending Approvals</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Products</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-2xl font-bold text-red-600">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Users Management
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded shadow">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Analytics Dashboard</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Users by Role - Pie Chart */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Users by Role</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData.usersByRole}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {chartData.usersByRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Orders by Status - Bar Chart */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Orders by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.ordersByStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Products by Category - Bar Chart */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Products by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData.productsByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Orders Over Time - Line Chart */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Orders Over Time (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData.ordersOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="orders" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b">
                      <tr>
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">City</th>
                        <th className="pb-2">Mandi</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3">{user.name}</td>
                          <td className="py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'farmer' ? 'bg-green-100 text-green-800' : 
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-sm">{user.city || 'N/A'}</td>
                          <td className="py-3 text-sm">{user.mandi || 'N/A'}</td>
                          <td className="py-3">
                            {user.role === 'farmer' && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.approved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.approved ? 'Approved' : 'Pending'}
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              {user.role === 'farmer' && !user.approved && (
                                <button
                                  onClick={() => handleApprove(user._id)}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                  Approve
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(product => (
                    <div key={product._id} className="border rounded-lg p-4">
                      {product.imageURL && (
                        <img 
                          src={`http://localhost:5000${product.imageURL}`} 
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-green-600 font-bold mt-1">₹{product.price}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      <p className="text-sm text-gray-500">City: {product.city}</p>
                      {product.farmerId && (
                        <p className="text-xs text-gray-600 mt-2">
                          By: {product.farmerId.name}
                        </p>
                      )}
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="w-full mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-4">All Orders</h2>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order ID: <span className="font-mono">{order._id.slice(-8)}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          {order.consumerId && (
                            <p className="text-sm mt-1">
                              Consumer: <span className="font-medium">{order.consumerId.name}</span>
                            </p>
                          )}
                          {order.farmerId && (
                            <p className="text-sm">
                              Farmer: <span className="font-medium">{order.farmerId.name}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'ready' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold text-green-600 mt-2">
                            ₹{order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Delivery: {order.deliveryMode === 'pickup' ? 'Pickup' : 'Home Delivery'}</p>
                        {order.deliveryAddress && (
                          <p>Address: {order.deliveryAddress}</p>
                        )}
                        <p className="mt-1">
                          Items: {order.products.length} product(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
