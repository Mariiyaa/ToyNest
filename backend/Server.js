const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL, // Allow requests from your frontend
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected to ${process.env.MONGO_URI}`))
  .catch((err) => console.error(`❌ MongoDB connection error:${process.env.MONGO_URI}`, err));

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose connection error:${process.env.MONGO_URI}`, err);
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

const cartRoutes = require('./routes/cart');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/cart', cartRoutes);

// ❌ REMOVE app.listen(PORT) - Vercel doesn’t support this
module.exports = app; // Export Express app
