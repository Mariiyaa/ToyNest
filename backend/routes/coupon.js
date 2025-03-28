const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Coupon = require('../models/Coupon');

router.post('/', authMiddleware, async (req, res) => {
  const coupon = new Coupon(req.body);
  await coupon.save();
  res.json({ message: 'Coupon created' });
});
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code });
  if (!coupon) return res.status(400).json({ message: 'Invalid coupon' });
  res.json({ discount: coupon.discount });
});
module.exports = router;
