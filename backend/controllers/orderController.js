const Order = require('../models/Order');
const User = require('../models/User');
const { notifyNewOrder, notifyOrderStatus } = require('../utils/socketNotifications');

exports.placeOrder = async (req, res) => {
  try {
    const { farmerId, products, totalPrice, deliveryMode, deliveryAddress } = req.body;
    if (!farmerId || !products || !totalPrice) return res.status(400).json({ message: 'Missing fields' });
    
    const order = await Order.create({ 
      consumerId: req.user._id, 
      farmerId, 
      products, 
      totalPrice, 
      deliveryMode,
      deliveryAddress 
    });

    // Notify farmer about new order
    await notifyNewOrder(farmerId, order._id, req.user.name, totalPrice);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const { role } = req.user;
    let filter = {};
    if (role === 'consumer') filter.consumerId = req.user._id;
    if (role === 'farmer') filter.farmerId = req.user._id;
    const orders = await Order.find(filter)
      .populate('consumerId', 'name email')
      .populate('farmerId', 'name mandi')
      .populate('products.productId', 'name category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('farmerId', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only farmer can update their own orders
    if (req.user.role === 'farmer' && order.farmerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    // Notify consumer about status change
    await notifyOrderStatus(order.consumerId, order._id, status, order.farmerId.name);
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
