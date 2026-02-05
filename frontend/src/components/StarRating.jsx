import React from 'react'

export default function StarRating({ rating, size = 'md', interactive = false, onRatingChange }) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl'
  }
  
  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          className={`${sizes[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
        >
          {star <= rating ? (
            <span className="text-yellow-400">⭐</span>
          ) : (
            <span className="text-gray-300">☆</span>
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 font-medium">
        {rating > 0 ? rating.toFixed(1) : 'No ratings yet'}
      </span>
    </div>
  )
}
