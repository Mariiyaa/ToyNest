const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  ageGroup: String,
  category: { type: [String], enum: ['playset', 'control', 'educational', 'eco-friendly', 'stuffed', ''], default: null },    
  images: [String],
  stock: Number,
  variants: [{ 
    size: String, 
    color: String, 
    available: Boolean,
    image: String 
  }],
  rating: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Product', ProductSchema);
  