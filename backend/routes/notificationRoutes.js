const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} = require('../controllers/notificationController');

// All routes require authentication
router.use(auth);

// GET /api/notifications - Get all notifications
router.get('/', getNotifications);

// PUT /api/notifications/read-all - Mark all as read (must be before /:id routes)
router.put('/read-all', markAllAsRead);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', markAsRead);

// DELETE /api/notifications/clear-read - Clear all read notifications (must be before /:id)
router.delete('/clear-read', clearReadNotifications);

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
