// Backend: server.js (Main Entry Point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // Optional, based on use case
  next();
});

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL, // Allow requests from your frontend
    
  }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const couponRoutes = require('./routes/coupon');
const cartRoutes = require('./routes/cart');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
