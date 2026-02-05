import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import StarRating from '../components/StarRating'

export default function ConsumerDashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { addToCart } = useCart()
  
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Hyderabad', 'Lucknow']
  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic', 'Other']
  
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load recent searches')
      }
    }
  }, [])

  // Fetch products with all filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (city) params.append('city', city)
      if (selectedCategory) params.append('category', selectedCategory)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (search) params.append('search', search)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
      
      const res = await API.get(`/products?${params.toString()}`)
      setProducts(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [city, selectedCategory, minPrice, maxPrice, search, sortBy, sortOrder])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle search with recent searches
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm)
    setShowSuggestions(false)
    
    if (searchTerm.trim()) {
      // Add to recent searches
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }

  // Get search suggestions
  const suggestions = search.length > 0 
    ? [...new Set([
        ...products.map(p => p.name).filter(name => 
          name.toLowerCase().includes(search.toLowerCase())
        ),
        ...categories.filter(cat => 
          cat.toLowerCase().includes(search.toLowerCase())
        )
      ])].slice(0, 5)
    : []

  // Handle sort change
  const handleSortChange = (value) => {
    const [newSortBy, newSortOrder] = value.split('-')
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setCity('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSearch('')
    setSortBy('createdAt')
    setSortOrder('desc')
    toast.success('All filters cleared')
  }

  // Active filters count
  const activeFiltersCount = [city, selectedCategory, minPrice, maxPrice, search].filter(Boolean).length

  // Remove individual filter
  const removeFilter = (filterName) => {
    switch(filterName) {
      case 'city': setCity(''); break
      case 'category': setSelectedCategory(''); break
      case 'price': setMinPrice(''); setMaxPrice(''); break
      case 'search': setSearch(''); break
      default: break
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 Browse Fresh Produce</h1>
        <p className="text-gray-600">Discover farm-fresh products from local farmers</p>
      </div>
      
      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">🔍 Filters & Search</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search with Autocomplete */}
          <div className="lg:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <span className="absolute left-3 top-3 text-gray-400 text-xl">🔍</span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && (search || recentSearches.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {search && suggestions.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                      Suggestions
                    </div>
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </>
                )}
                {!search && recentSearches.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b flex justify-between items-center">
                      <span>Recent Searches</span>
                      <button
                        onClick={() => {
                          setRecentSearches([])
                          localStorage.removeItem('recentSearches')
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((recent, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(recent)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center"
                      >
                        <span className="mr-2 text-gray-400">🕒</span>
                        {recent}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 City
            </label>
            <select 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏷️ Category
            </label>
            <select 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Price Range & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Min Price (₹)
            </label>
            <input 
              type="number" 
              placeholder="0" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Max Price (₹)
            </label>
            <input 
              type="number" 
              placeholder="1000" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔄 Sort By
            </label>
            <select 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {city && (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              📍 {city}
              <button onClick={() => removeFilter('city')} className="ml-2 font-bold">×</button>
            </div>
          )}
          {selectedCategory && (
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              🏷️ {selectedCategory}
              <button onClick={() => removeFilter('category')} className="ml-2 font-bold">×</button>
            </div>
          )}
          {(minPrice || maxPrice) && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              💰 ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
              <button onClick={() => removeFilter('price')} className="ml-2 font-bold">×</button>
            </div>
          )}
          {search && (
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              🔍 "{search}"
              <button onClick={() => removeFilter('search')} className="ml-2 font-bold">×</button>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : (
              <>
                <span className="text-green-600">{products.length}</span> Product{products.length !== 1 ? 's' : ''} Found
              </>
            )}
          </h2>
        </div>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow bg-white">
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
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900">{p.name}</h3>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                  {p.category}
                </span>
                {/* Rating Display */}
                {p.reviewCount > 0 && (
                  <div className="mb-2">
                    <StarRating rating={p.averageRating} size="sm" />
                    <span className="text-xs text-gray-500 ml-1">
                      ({p.reviewCount})
                    </span>
                  </div>
                )}
                <p className="text-green-600 font-bold text-2xl mb-2">₹{p.price}</p>
                <p className="text-sm text-gray-600 mb-1">📦 Qty: {p.quantity || 'N/A'} {p.unit || 'kg'}</p>
                <p className="text-sm text-gray-600 mb-3">📍 {p.city || 'N/A'}</p>
                {p.farmerId && (
                  <div className="text-xs text-gray-600 border-t pt-2 mb-3">
                    <p className="font-medium text-gray-900">{p.farmerId.name}</p>
                    {p.farmerId.mandi && <p className="text-gray-500">{p.farmerId.mandi}</p>}
                  </div>
                )}
                <div className="flex gap-2">
                  <Link 
                    to={`/product/${p._id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(p)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
