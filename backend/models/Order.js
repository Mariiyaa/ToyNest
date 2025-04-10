const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      variant: String,
      price: Number,
      name: String
    }],
    shippingDetails: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      orderNotes: String
    },
    payment: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
    },
    totalPrice: Number,
    shippingCost: { type: Number, default: 0 },
    status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
    orderDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
  