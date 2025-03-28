const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose=require('mongoose')
router.get('/', async (req, res) => {
  const products = await Product.find();
  console.log("product get called ")
  res.json(products);
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
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: 'Product added successfully' });
});
router.put('/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Product updated' });
});
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});
module.exports = router;