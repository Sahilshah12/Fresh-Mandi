import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import API from '../services/api'
import toast from 'react-hot-toast'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
  } = useNotifications()
  
  // Get current user role
  const [userRole, setUserRole] = useState(null)
  
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserRole(user.role)
      } catch (e) {
        console.error('Failed to parse user data')
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id)
    }
    setIsOpen(false)
  }

  const handleOrderAction = async (orderId, action, notificationId, e) => {
    e.stopPropagation()
    e.preventDefault()
    
    try {
      const newStatus = action === 'accept' ? 'confirmed' : 'cancelled'
      await API.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Order ${action === 'accept' ? 'accepted' : 'rejected'}!`)
      
      // Mark notification as read
      markAsRead(notificationId)
      
      // Optionally delete or hide the notification
      deleteNotification(notificationId)
    } catch (err) {
      console.error('Order action error:', err)
      toast.error(`Failed to ${action} order`)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      order_created: '🛒',
      order_status: '📦',
      farmer_registered: '👨‍🌾',
      low_stock: '⚠️',
      product_added: '🌾',
      order_completed: '✅'
    }
    return icons[type] || '🔔'
  }
  
  // Filter notifications based on user role
  const roleBasedNotifications = notifications.filter(notification => {
    if (userRole === 'farmer') {
      // Farmers see: new orders, order status changes on their products
      return ['order_created', 'low_stock', 'product_added'].includes(notification.type)
    } else if (userRole === 'consumer') {
      // Consumers see: order status updates
      return ['order_status', 'order_completed'].includes(notification.type)
    } else if (userRole === 'admin') {
      // Admins see everything
      return true
    }
    return true
  })

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <span className="text-2xl">🔔</span>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        {connected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-green-600">({unreadCount} new)</span>
                )}
              </h3>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={clearReadNotifications}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {roleBasedNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <span className="text-6xl mb-4 block">🔔</span>
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-2">
                  You'll see notifications here when there are updates
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {roleBasedNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={notification.link || '/'}
                            onClick={() => handleNotificationClick(notification)}
                            className="flex-1 min-w-0"
                          >
                            <p className="font-semibold text-sm text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.metadata?.orderId && (
                              <p className="text-xs text-gray-500 mt-1">
                                Order ID: {notification.metadata.orderId.toString().slice(-8)}
                              </p>
                            )}
                            {notification.metadata?.fromUserId && (
                              <p className="text-xs text-blue-600 mt-1 hover:underline">
                                → View Customer Profile
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </Link>

                          {/* Action Buttons */}
                          <div className="flex gap-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification._id)
                                }}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Mark as read"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification._id)
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Quick Accept/Reject Buttons for New Orders */}
                        {notification.type === 'order_created' && notification.metadata?.orderId && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={(e) => handleOrderAction(notification.metadata.orderId, 'accept', notification._id, e)}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all"
                            >
                              ✓ Accept Order
                            </button>
                            <button
                              onClick={(e) => handleOrderAction(notification.metadata.orderId, 'reject', notification._id, e)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition-all"
                            >
                              ✗ Reject Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {roleBasedNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Showing {roleBasedNotifications.length} {userRole} notification{roleBasedNotifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
