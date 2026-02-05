import React, { useState, useEffect } from 'react'
import API from '../services/api'
import toast from 'react-hot-toast'
import { confirmDelete } from '../components/ConfirmDialog'

export default function FarmerDashboard(){
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [city, setCity] = useState('')
  const [image, setImage] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic', 'Other']
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Jaipur', 'Ahmedabad', 'Kolkata', 'Chennai', 'Hyderabad', 'Lucknow']

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get('/farmers/products')
      setProducts(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await API.get('/orders/farmer-orders')
      const orders = res.data
      const pending = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length
      const completed = orders.filter(o => o.status === 'completed').length
      const revenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.totalPrice, 0)
      
      setStats({
        totalProducts: products.length,
        totalRevenue: revenue,
        pendingOrders: pending,
        completedOrders: completed
      })
    } catch (err) {
      console.error('Stats error:', err)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('category', category)
      fd.append('price', price)
      fd.append('quantity', quantity)
      fd.append('unit', unit)
      fd.append('city', city)
      if (image) fd.append('image', image)

      await API.post('/farmers/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('✅ Product created successfully!')
      
      // Reset form
      setName('')
      setCategory('')
      setPrice('')
      setQuantity('')
      setUnit('kg')
      setCity('')
      setImage(null)
      setImagePreview(null)
      document.querySelector('input[type="file"]').value = ''
      
      fetchProducts()
      fetchStats()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    }
  }

  const deleteProduct = async (id) => {
    confirmDelete('Delete this product?', async () => {
      try {
        await API.delete(`/farmers/products/${id}`)
        toast.success('Product deleted')
        fetchProducts()
        fetchStats()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product')
      }
    })
  }

  const updateProduct = async (id, updates) => {
    try {
      await API.put(`/farmers/products/${id}`, updates)
      toast.success('Product updated')
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product')
    }
  }

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await API.put(`/farmers/products/${id}`, { available: !currentStatus })
      toast.success(currentStatus ? 'Product marked unavailable' : 'Product marked available')
      fetchProducts()
    } catch (err) {
      toast.error('Failed to update availability')
    }
  }

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(p => p.category === filterCategory)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🌾 Farmer Dashboard</h1>
        <p className="text-gray-600">Manage your products and track your sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-green-100 text-sm mb-1">Total Products</p>
          <p className="text-4xl font-bold">{products.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
          <p className="text-4xl font-bold">₹{stats.totalRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-orange-100 text-sm mb-1">Pending Orders</p>
          <p className="text-4xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-purple-100 text-sm mb-1">Completed Orders</p>
          <p className="text-4xl font-bold">{stats.completedOrders}</p>
        </div>
      </div>
      
      {/* Add Product Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-3xl mr-3">➕</span>
          Add New Product
        </h2>
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="e.g., Fresh Tomatoes"
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                required 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                value={category} 
                onChange={(e)=>setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                step="0.01" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="0.00"
                value={price} 
                onChange={(e)=>setPrice(e.target.value)} 
                required 
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="100"
                value={quantity} 
                onChange={(e)=>setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                value={unit} 
                onChange={(e)=>setUnit(e.target.value)}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="piece">Piece</option>
                <option value="dozen">Dozen</option>
                <option value="liter">Liter</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                value={city} 
                onChange={(e)=>setCity(e.target.value)}
                required
              >
                <option value="">Select city</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="flex-1 border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                  onChange={handleImageChange} 
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-green-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button 
              type="submit" 
              className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
            >
              ✨ Create Product
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-3">📦</span>
            My Products ({filteredProducts.length})
          </h2>
          
          {/* Category Filter */}
          <select 
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🌱</p>
            <p className="text-gray-500 text-lg">No products yet. Add your first product above!</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <div key={p._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              {/* Product Image */}
              {p.imageURL ? (
                <img 
                  src={`http://localhost:5000${p.imageURL}`} 
                  alt={p.name} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-6xl">🌾</span>
                </div>
              )}

              {/* Product Details */}
              <div className="p-4">
                {editingId === p._id ? (
                  <div className="space-y-2">
                    <input 
                      className="w-full border p-2 rounded text-sm" 
                      defaultValue={p.name} 
                      onBlur={(e) => e.target.value !== p.name && updateProduct(p._id, { name: e.target.value })}
                    />
                    <input 
                      type="number" 
                      className="w-full border p-2 rounded text-sm" 
                      defaultValue={p.price} 
                      onBlur={(e) => e.target.value !== String(p.price) && updateProduct(p._id, { price: Number(e.target.value) })}
                    />
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="w-full text-blue-600 text-sm font-medium"
                    >
                      ✓ Done Editing
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{p.name}</h3>
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                      {p.category}
                    </span>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₹{p.price}
                      <span className="text-sm text-gray-500 ml-1">/{p.unit || 'kg'}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      📦 Qty: <span className="font-medium">{p.quantity} {p.unit || 'kg'}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      📍 {p.city}
                    </p>

                    {/* Availability Toggle */}
                    <div className="mb-3">
                      <button
                        onClick={() => toggleAvailability(p._id, p.available)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition ${
                          p.available 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {p.available ? '✓ Available' : '✗ Unavailable'}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingId(p._id)} 
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => deleteProduct(p._id)} 
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
