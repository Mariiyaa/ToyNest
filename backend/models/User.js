const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  token:{type: String},
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String,  },
  phone: { type: String, }, // Added phone number
  address: { 
    street: { type: String, },
    apartment: { type: String }, // Optional
    houseNo: { type: String, },
    city: { type: String, },
    state: { type: String, },
    country: { type: String, },
    postalCode: { type: String, }
  },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
