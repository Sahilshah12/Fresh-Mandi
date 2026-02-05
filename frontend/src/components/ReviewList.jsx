import React, { useState } from 'react'
import StarRating from './StarRating'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function ReviewList({ reviews, currentUser, productOwnerId, onReviewDeleted, onReviewUpdated }) {
  const [sortBy, setSortBy] = useState('recent')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loadingReply, setLoadingReply] = useState(false)
  
  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest') return a.rating - b.rating
    return 0
  })
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Handle vote
  const handleVote = async (reviewId, voteType) => {
    if (!currentUser) {
      toast.error('Please login to vote')
      return
    }
    
    try {
      const res = await API.post(`/reviews/${reviewId}/vote`, { voteType })
      toast.success('Vote recorded!')
      if (onReviewUpdated) onReviewUpdated(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote')
    }
  }
  
  // Handle delete
  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await API.delete(`/reviews/${reviewId}`)
      toast.success('Review deleted successfully')
      if (onReviewDeleted) onReviewDeleted(reviewId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review')
    }
  }
  
  // Handle farmer reply
  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Please write a reply')
      return
    }
    
    setLoadingReply(true)
    try {
      const res = await API.post(`/reviews/${reviewId}/reply`, { comment: replyText })
      toast.success('Reply posted successfully!')
      setReplyingTo(null)
      setReplyText('')
      if (onReviewUpdated) onReviewUpdated(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply')
    } finally {
      setLoadingReply(false)
    }
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-5xl mb-3">⭐</p>
        <p className="text-gray-600 text-lg">No reviews yet</p>
        <p className="text-gray-500 text-sm">Be the first to review this product!</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">
          💬 Customer Reviews ({reviews.length})
        </h3>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => {
          const isOwnReview = currentUser && review.userId._id === currentUser.id
          const isAdmin = currentUser && currentUser.role === 'admin'
          const isProductOwner = currentUser && currentUser.id === productOwnerId
          const canDelete = isOwnReview || isAdmin
          const canReply = isProductOwner && !review.farmerReply
          
          return (
            <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {/* Review Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{review.userId.name}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                </div>
                
                {canDelete && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
              
              {/* Review Comment */}
              <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
              
              {/* Helpful Votes */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleVote(review._id, 'helpful')}
                  className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1"
                  disabled={!currentUser}
                >
                  👍 Helpful ({review.helpfulVotes?.length || 0})
                </button>
                <button
                  onClick={() => handleVote(review._id, 'unhelpful')}
                  className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1"
                  disabled={!currentUser}
                >
                  👎 Not Helpful ({review.unhelpfulVotes?.length || 0})
                </button>
              </div>
              
              {/* Farmer Reply */}
              {review.farmerReply && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-blue-900">🚜 Farmer's Response</span>
                    <span className="text-xs text-blue-600">
                      {formatDate(review.farmerReply.repliedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-900">{review.farmerReply.comment}</p>
                </div>
              )}
              
              {/* Reply Button for Farmer */}
              {canReply && (
                <div className="mt-4">
                  {replyingTo === review._id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
                        rows="3"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(review._id)}
                          disabled={loadingReply}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {loadingReply ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(review._id)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      💬 Reply to this review
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
