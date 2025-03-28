const mongoose = require('mongoose');
const CouponSchema = new mongoose.Schema({
    code: String,
    discount: Number,
    minPurchase: Number,
    expiryDate: Date
  });
  module.exports = mongoose.model('Coupon', CouponSchema);