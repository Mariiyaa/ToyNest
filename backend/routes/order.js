const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Get all orders (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      products,
      shippingDetails,
      payment,
      totalPrice,
      shippingCost
    } = req.body;

    console.log("Received products:", products); // Log received products

    // Create the order
    const order = new Order({
      userId,
      products,
      shippingDetails,
      payment,
      totalPrice,
      shippingCost
    });

    // Update product stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // Remove only the ordered products from the cart
    const orderedProductIds = products.map(item => item.productId);
    console.log("Ordered Product IDs:", orderedProductIds); // Log ordered product IDs
    
    // First, get the cart to check its current state
    const cart = await Cart.findOne({ userId });
    if (cart) {
      console.log("Current cart items:", cart.items); // Log current cart items
      
      // Remove items that match the ordered product IDs
      cart.items = cart.items.filter(item => {
        console.log("Comparing:", {
          cartItemId: item.id.toString(),
          orderedIds: orderedProductIds
        });
        return !orderedProductIds.includes(item.id.toString());
      });
      
      console.log("Cart items after filter:", cart.items); // Log filtered cart items
      await cart.save();
    }

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    console.log(req.params.userId)
    const orders = await Order.find({"userId": new mongoose.Types.ObjectId(req.params.userId) })
      .sort({ createdAt: -1 });
      console.log(orders)
    res.json(orders);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router; 