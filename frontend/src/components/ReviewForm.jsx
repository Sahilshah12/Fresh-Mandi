import React, { useState } from 'react'
import StarRating from './StarRating'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review')
      return
    }
    
    setLoading(true)
    try {
      const res = await API.post('/reviews', {
        productId,
        rating,
        comment,
        photos
      })
      toast.success('Review submitted successfully! ⭐')
      setRating(0)
      setComment('')
      setPhotos([])
      if (onReviewSubmitted) onReviewSubmitted(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <StarRating 
            rating={rating} 
            size="lg" 
            interactive={true}
            onRatingChange={setRating}
          />
        </div>
        
        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="5"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {comment.length}/1000 characters
          </div>
        </div>
        
        {/* Photo Upload Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Note:</strong> Photo upload feature coming soon! For now, you can include image links in your review text.
          </p>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            '✨ Submit Review'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 border-t pt-3">
        <p>✅ You can only review products you've purchased</p>
        <p>✅ One review per product</p>
        <p>✅ Your review will be visible to all users</p>
      </div>
    </div>
  )
}
