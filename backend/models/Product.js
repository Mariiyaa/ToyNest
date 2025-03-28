const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    price: Number,
    ageGroup: String,
    category: String,
    images: [String],
    stock: Number,
    variants: [{ size: String, color: String, available: Boolean }]
  });
  module.exports = mongoose.model('Product', ProductSchema);
  