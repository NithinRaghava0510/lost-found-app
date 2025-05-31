// /backend/routes/lost.js
const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 1) Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2) Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // e.g. “image-1627389142918.jpg”
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max (adjust if needed)
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// POST /api/lost
// Create a new lost item (with optional image upload)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, description, date_lost, location } = req.body;
  if (!title || !description || !date_lost || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let imagePath = null;
  if (req.file && req.file.filename) {
    // Store only the relative path (so that URL on frontend is e.g. http://localhost:5000/uploads/...)
    imagePath = `uploads/${req.file.filename}`;
  }

  try {
    const newItem = await db.query(
      `INSERT INTO lost_items (user_id, title, description, date_lost, location, image_path)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, description, date_lost, location, image_path, date_reported`,
      [req.user.id, title, description, date_lost, location, imagePath]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/lost
// Get all lost items (with reporter email and image_path)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT li.id,
              li.title,
              li.description,
              li.date_lost,
              li.location,
              li.image_path,
              li.date_reported,
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

// GET /api/lost/mine
// Get lost items reported by the logged-in user
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT id, title, description, date_lost, location, image_path, date_reported
       FROM lost_items
       WHERE user_id = $1
       ORDER BY date_reported DESC`,
      [req.user.id]
    );
    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
