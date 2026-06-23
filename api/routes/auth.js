// api/routes/auth.js
// Authentication routes: register and login, returning JWTs

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validatePhone } = require('../utils/phoneValidator');
const config = require('../config');

// Register a new user (requires name, email, phone with country code, password)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Validate and normalise phone number (E.164)
    const phoneE164 = validatePhone(phone);
    // Create user record (password hashed, phone encrypted inside model)
    const user = await User.createUser({ name, email, phone: phoneE164, password, role: 'user' });
    // Issue JWT
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name, email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login existing user (email + password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const userRow = await User.findByEmail(email);
    if (!userRow) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: userRow.id, role: userRow.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
