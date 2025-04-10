const express=require('express')
const Cart=require('../models/Cart')// Create a Cart model


const router = express.Router();

// Get user cart
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body; 
    console.log("userId",userId)
    const cart = await Cart.findOne({ userId });
   
    res.json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add to cart
router.post("/add", async (req, res) => {
    const { userId, product, selectedVariant } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const existingItem = cart.items.find(
        (item) => item.id === product.id && item.variant === selectedVariant?.color
      );
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: selectedVariant?.image || product.images[0],
          variant: selectedVariant?.color || null,
          quantity: 1,
        });
      }
   
  
      await cart.save();
      res.json(cart.items);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error});
    }
  });

  router.post("/update", async (req, res) => {
    const { userId, id, variant, quantity } = req.body;
  
    if (!userId || !id) {
      return res.status(400).json({ message: "Invalid request" });
    }
  
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId, "items.id": id, "items.variant": variant },
        { $set: { "items.$.quantity": quantity } }, // Update only the quantity of the matched item
        { new: true }
      );
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });
  

// Remove from cart
router.post("/remove", async (req, res) => {
    const { userId, productId, variant } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { id: productId, variant: variant } } }, // Remove item where both id and variant match
            { new: true } // Return updated cart
        );
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        res.json(cart.items);
    } catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ message: "Error removing item" });
    }
});
  
module.exports=router
