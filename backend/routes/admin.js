// /backend/routes/admin.js
const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users
// Admin: list all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.query(
      `SELECT id, college_id, email, is_admin FROM users ORDER BY id`
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/lost
// Admin: get all lost items (with reporter email)
router.get('/lost', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT li.id, li.title, li.description, li.date_lost, li.location, li.date_reported,
              u.email AS reporter_email
       FROM lost_items li
       JOIN users u ON li.user_id = u.id
       ORDER BY li.date_reported DESC`
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/found
// Admin: get all found items (with finder email)
router.get('/found', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT fi.id, fi.title, fi.description, fi.date_found, fi.location, fi.date_reported,
              u.email AS finder_email
       FROM found_items fi
       JOIN users u ON fi.user_id = u.id
       ORDER BY fi.date_reported DESC`
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
