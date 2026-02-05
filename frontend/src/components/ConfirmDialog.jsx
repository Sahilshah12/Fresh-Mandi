import React from 'react'
import toast from 'react-hot-toast'

// Custom confirm function using react-hot-toast
export const confirmDelete = (message, onConfirm) => {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id)
              resolve(false)
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              resolve(true)
              onConfirm()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    })
  })
}
