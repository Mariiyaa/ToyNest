const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      variant: String,
    }],
    totalPrice: Number,
    status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' }
  });
  module.exports = mongoose.model('Order', OrderSchema);
  