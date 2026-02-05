import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Browse products and add items to your cart</p>
        <Link to="/consumer" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 inline-block">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded shadow mb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart ({cart.length} items)</h1>
          <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700">
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex gap-4 border-b pb-4">
              {item.imageURL && (
                <img 
                  src={`http://localhost:5000${item.imageURL}`} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-green-600 font-bold">₹{item.price} each</p>
                {item.farmerId && (
                  <p className="text-xs text-gray-500 mt-1">From: {item.farmerId.name}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{item.cartQuantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-lg">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-green-600">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Proceed to Checkout
          </button>
          <Link to="/consumer" className="block text-center mt-3 text-green-600 hover:text-green-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
