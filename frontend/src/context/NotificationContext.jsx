import React, { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import API from '../services/api'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      setIsAuthenticated(!!(token && user))
    }

    checkAuth()

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth)
    
    // Custom event for same-tab login/logout
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  // Initialize socket connection only when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Clean up if not authenticated
      if (socket) {
        socket.close()
        setSocket(null)
      }
      setConnected(false)
      setNotifications([])
      setUnreadCount(0)
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    const newSocket = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000', {
      autoConnect: false
    })

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected')
      setConnected(true)
      // Authenticate socket
      newSocket.emit('authenticate', token)
    })

    newSocket.on('authenticated', () => {
      console.log('✅ Socket authenticated')
    })

    newSocket.on('authentication_error', () => {
      console.error('❌ Socket authentication failed')
      setConnected(false)
    })

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected')
      setConnected(false)
    })

    // Listen for new notifications
    newSocket.on('notification', (notification) => {
      console.log('🔔 New notification:', notification)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show toast notification
      toast.success(
        <div className="flex items-start">
          <span className="text-2xl mr-2">🔔</span>
          <div>
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
        </div>,
        { duration: 5000 }
      )
    })

    newSocket.connect()
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [isAuthenticated])

  // Fetch initial notifications only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchNotifications = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await API.get('/notifications')
        setNotifications(res.data.notifications)
        setUnreadCount(res.data.unreadCount)
      } catch (err) {
        // Only log error if it's not a 401 (unauthorized)
        if (err.response?.status !== 401) {
          console.error('Failed to fetch notifications:', err)
        }
      }
    }

    fetchNotifications()
  }, [isAuthenticated])

  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (err) {
      console.error('Failed to mark all as read:', err)
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}`)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      const deletedNotif = notifications.find(n => n._id === notificationId)
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
      toast.error('Failed to delete notification')
    }
  }

  const clearReadNotifications = async () => {
    try {
      await API.delete('/notifications/clear-read')
      setNotifications(prev => prev.filter(n => !n.read))
      toast.success('Read notifications cleared')
    } catch (err) {
      console.error('Failed to clear read notifications:', err)
      toast.error('Failed to clear notifications')
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connected,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
