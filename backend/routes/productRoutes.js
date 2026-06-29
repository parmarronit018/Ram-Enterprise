const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Product Schema (same as pehle tha)
const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: [true, "Product ka naam hona zaroori hai"] },
  description: { type: String, required: [true, "Description dena padega"] },
  price:       { type: Number, required: [true, "Price likhna zaroori hai"] },
  image:       { type: String, required: [true, "Image URL chahiye"] },
  category:    { type: String, default: "General" },
  stock:       { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// GET /api/products — sabko dikhao (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/add — admin only
router.post('/add', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/update/:id — admin only
router.put('/update/:id', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product nahi mila" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/delete/:id — admin only
router.delete('/delete/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product nahi mila" });
    res.json({ message: "Product delete ho gaya" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;