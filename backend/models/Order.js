const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalPrice: { type: Number, required: true },
  productsTotal: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  deliveryDistance: { type: Number, default: 0 },
  deliveryMode: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  deliveryAddress: { type: String },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  status: { type: String, enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
