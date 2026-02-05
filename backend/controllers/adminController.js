const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveOrBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body; // { approve: true | false }
    const user = await User.findByIdAndUpdate(id, { approved: !!approve }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveFarmer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { approved: true }, 
      { new: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'farmer') return res.status(400).json({ message: 'User is not a farmer' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('farmerId', 'name mandi')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('consumerId', 'name email')
      .populate('farmerId', 'name mandi')
      .populate('products.productId', 'name category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.analytics = async (req, res) => {
  // Basic analytics stub: counts
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    res.json({ totalUsers, totalFarmers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
