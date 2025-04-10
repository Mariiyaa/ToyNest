const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload } = require('../middleware/upload');
const mongoose = require('mongoose');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("productdetails")
    const product = await Product.findOne({"_id": new mongoose.Types.ObjectId(req.params.id) });
    console.log("product detail",product)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({error });
  }
});

// Create a new product with images
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    
    // Add uploaded images URLs to the product data
    const imageUrls = req.files.map(file => file.path);
    
    // If there are variants without images, assign the uploaded images to them
    if (productData.variants && productData.variants.length > 0) {
      const variantsWithoutImages = productData.variants.filter(variant => !variant.image);
      const variantsWithImages = productData.variants.filter(variant => variant.image);
      
      // Assign new images to variants that don't have images
      variantsWithoutImages.forEach((variant, index) => {
        if (index < imageUrls.length) {
          variant.image = imageUrls[index];
        }
      });
      
      // Combine all variants
      productData.variants = [...variantsWithImages, ...variantsWithoutImages];
    }
    
    // Set the remaining images as product images
    productData.images = imageUrls;

    // Ensure variants have the correct structure
    if (productData.variants) {
      productData.variants = productData.variants.map(variant => ({
        size: variant.size || '',
        color: variant.color || '',
        available: variant.available !== undefined ? variant.available : true,
        image: variant.image || ''
      }));
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    
    // Handle newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      
      // If there are variants without images, assign the uploaded images to them
      if (productData.variants && productData.variants.length > 0) {
        const variantsWithoutImages = productData.variants.filter(variant => !variant.image);
        const variantsWithImages = productData.variants.filter(variant => variant.image);
        
        // Assign new images to variants that don't have images
        variantsWithoutImages.forEach((variant, index) => {
          if (index < newImageUrls.length) {
            variant.image = newImageUrls[index];
          }
        });
        
        // Combine all variants
        productData.variants = [...variantsWithImages, ...variantsWithoutImages];
      }
      
      // Add any remaining new images to the product images
      productData.images = [...(productData.images || []), ...newImageUrls];
    }

    // Ensure variants have the correct structure
    if (productData.variants) {
      productData.variants = productData.variants.map(variant => ({
        size: variant.size || '',
        color: variant.color || '',
        available: variant.available !== undefined ? variant.available : true,
        image: variant.image || ''
      }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 