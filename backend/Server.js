// Backend: server.js (Main Entry Point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

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
