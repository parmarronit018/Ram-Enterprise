const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/orders/create — logged in user
router.post('/create', protect, async (req, res) => {
  const { items, total, address, phone, paymentMethod } = req.body;

  if (!items || !total || !address || !phone) {
    return res.status(400).json({ message: "Saari details bharo bhai" });
  }

  try {
    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
      address,
      phone,
      paymentMethod: paymentMethod || "COD"
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/my-orders/:userId — apne orders dekho
router.get('/my-orders/:userId', protect, async (req, res) => {
  try {
    // User sirf apne orders dekhe, admin sab dekh sakta
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Tumhare apne orders nahi hain ye" });
    }
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/all — admin only
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/update-status/:orderId — admin only
router.put('/update-status/:orderId', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status sirf in mein se hona chahiye: ${validStatuses.join(', ')}` });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order nahi mila" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;