const express = require('express');
const User = require('../models/User');
const mongoose=require('mongoose')

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    console.log("Requested User ID:", req.params.id);
    
    const user = await User.findById({"_id": new mongoose.Types.ObjectId(req.params.id) }).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req.body)

    // Validate and extract only allowed fields from req.body
    const updatedFields = {};
    
    if (req.body.formData.name) updatedFields.name = req.body.formData.name;
    if (req.body.formData.phone) updatedFields.phone = req.body.formData.phone;

    if (req.body.formData.address) {
      updatedFields.address = {
        street: req.body.formData.address.street || "",
        apartment: req.body.formData.address.apartment || "",
        houseNo: req.body.formData.address.houseNo || "",
        city: req.body.formData.address.city || "",
        state: req.body.formData.address.state || "",
        country: req.body.formData.address.country || "",
        postalCode: req.body.formData.address.postalCode || "",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    console.log(updatedFields)
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
