// /backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { college_id, email, password } = req.body;
  if (!college_id || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE college_id = $1 OR email = $2',
      [college_id, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Default new users to non-admin
    const newUser = await db.query(
      'INSERT INTO users (college_id, email, password) VALUES ($1, $2, $3) RETURNING id, college_id, email, is_admin',
      [college_id, email, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = jwt.sign(
      { id: user.id, college_id: user.college_id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({ token, user: { id: user.id, college_id: user.college_id, email: user.email, is_admin: user.is_admin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { college_id, password } = req.body;
  if (!college_id || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find user by college_id
    const userRes = await db.query('SELECT * FROM users WHERE college_id = $1', [college_id]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, college_id: user.college_id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, college_id: user.college_id, email: user.email, is_admin: user.is_admin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
