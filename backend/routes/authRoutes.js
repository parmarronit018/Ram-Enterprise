const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// HARDCODED ADMIN CREDENTIALS
const ADMIN_EMAIL    = 'admin@ramenterprise.com';
const ADMIN_PASSWORD = 'admin@123';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Naam, email aur password zaroori hain" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Yeh email already registered hai" });

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, user.isAdmin);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email aur password dono chahiye" });
  }

  try {
    // Admin hardcoded check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken('admin', true);
      return res.json({
        token,
        user: { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, isAdmin: true }
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email ya password galat hai" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Email ya password galat hai" });

    const token = generateToken(user._id, user.isAdmin);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;