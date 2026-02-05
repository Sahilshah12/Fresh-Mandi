/**
 * Socket.io Notification Helper
 * Centralized functions for emitting notifications
 */

const Notification = require('../models/Notification');

let io = null;

/**
 * Initialize Socket.io instance
 */
const initSocketIO = (socketIO) => {
  io = socketIO;
};

/**
 * Get Socket.io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Create and emit a notification
 */
const createNotification = async (userId, type, title, message, link = null, metadata = {}) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      metadata
    });

    // Emit to specific user's room
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        ...notification.toObject(),
        isNew: true
      });
    }

    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

/**
 * Notify farmer about new order
 */
const notifyNewOrder = async (farmerId, orderId, consumerName, totalPrice) => {
  await createNotification(
    farmerId,
    'order_created',
    '🎉 New Order Received!',
    `${consumerName} placed an order worth ₹${totalPrice.toFixed(2)}`,
    '/orders',
    { orderId }
  );
};

/**
 * Notify consumer about order status change
 */
const notifyOrderStatus = async (consumerId, orderId, newStatus, farmerName) => {
  const statusMessages = {
    confirmed: `${farmerName} confirmed your order`,
    ready: `Your order is ready for pickup/delivery`,
    completed: `Your order has been completed`,
    cancelled: `Your order has been cancelled`
  };

  const statusEmojis = {
    confirmed: '✅',
    ready: '📦',
    completed: '🎊',
    cancelled: '❌'
  };

  await createNotification(
    consumerId,
    'order_status',
    `${statusEmojis[newStatus]} Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    statusMessages[newStatus] || `Order status updated to ${newStatus}`,
    '/orders',
    { orderId }
  );
};

/**
 * Notify admin about new farmer registration
 */
const notifyAdminNewFarmer = async (adminIds, farmerName, farmerId) => {
  for (const adminId of adminIds) {
    await createNotification(
      adminId,
      'farmer_registered',
      '👨‍🌾 New Farmer Registration',
      `${farmerName} registered and needs approval`,
      '/admin',
      { fromUserId: farmerId }
    );
  }
};

/**
 * Notify farmer about low stock
 */
const notifyLowStock = async (farmerId, productName, productId, quantity) => {
  await createNotification(
    farmerId,
    'low_stock',
    '⚠️ Low Stock Alert',
    `${productName} is running low (${quantity} left)`,
    `/farmer`,
    { productId }
  );
};

/**
 * Notify consumer about new product from followed farmer
 */
const notifyNewProduct = async (consumerId, farmerName, productName, productId) => {
  await createNotification(
    consumerId,
    'product_added',
    '🌾 New Product Available',
    `${farmerName} added ${productName}`,
    `/product/${productId}`,
    { productId }
  );
};

module.exports = {
  initSocketIO,
  getIO,
  createNotification,
  notifyNewOrder,
  notifyOrderStatus,
  notifyAdminNewFarmer,
  notifyLowStock,
  notifyNewProduct
};
