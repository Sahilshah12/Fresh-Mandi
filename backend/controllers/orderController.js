const Order = require('../models/Order');
const User = require('../models/User');
const { notifyNewOrder, notifyOrderStatus } = require('../utils/socketNotifications');

exports.placeOrder = async (req, res) => {
  try {
    const { farmerId, products, totalPrice, productsTotal, deliveryCharge, deliveryDistance, deliveryMode, deliveryAddress, paymentMethod, paymentStatus } = req.body;
    if (!farmerId || !products || !totalPrice) return res.status(400).json({ message: 'Missing fields' });
    
    const order = await Order.create({ 
      consumerId: req.user._id, 
      farmerId, 
      products, 
      totalPrice, 
      productsTotal: productsTotal || totalPrice,
      deliveryCharge: deliveryCharge || 0,
      deliveryDistance: deliveryDistance || 0,
      deliveryMode,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentStatus || 'pending'
    });

    // Populate order for notification
    await order.populate('products.productId', 'name');
    
    // Notify farmer about new order with product details
    await notifyNewOrder(farmerId, order._id, req.user.name, totalPrice, products, paymentMethod, paymentStatus, req.user._id);

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
      .populate('consumerId', 'name email phone address city state pincode')
      .populate('farmerId', 'name email phone address city state pincode mandi')
      .populate('products.productId', 'name category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the farmer who owns the order can mark COD payment as received
    if (order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order payment' });
    }

    if (order.paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Payment status can only be updated for Cash on Delivery orders' });
    }

    order.paymentStatus = 'paid';
    await order.save();

    res.json({ message: 'Payment marked as received', order });
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
