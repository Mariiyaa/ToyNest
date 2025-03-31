// Backend: server.js (Main Entry Point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Set timeout for all routes
app.use((req, res, next) => {
  res.setTimeout(30000); // 30 second timeout
  next();
});

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // 5 second timeout for MongoDB connection
  socketTimeoutMS: 45000, // 45 second timeout for MongoDB operations
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }
  
  next();
});

console.log("CORS Configured for:", process.env.CLIENT_URL);


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
