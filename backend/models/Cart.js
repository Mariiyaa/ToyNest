const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  variant: { type: String, default: null }, // Example: "Red", "Large"
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [CartItemSchema],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart
