// /backend/routes/found.js
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// POST /api/found
// Create a new found item (with optional image upload)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, description, date_found, location } = req.body;
  if (!title || !description || !date_found || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let imagePath = null;
  if (req.file && req.file.filename) {
    imagePath = `uploads/${req.file.filename}`;
  }

  try {
    const newItem = await db.query(
      `INSERT INTO found_items (user_id, title, description, date_found, location, image_path)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, description, date_found, location, image_path, date_reported`,
      [req.user.id, title, description, date_found, location, imagePath]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/found
// Get all found items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT fi.id,
              fi.title,
              fi.description,
              fi.date_found,
              fi.location,
              fi.image_path,
              fi.date_reported,
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

// GET /api/found/mine
// Get found items reported by the logged-in user
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const items = await db.query(
      `SELECT id, title, description, date_found, location, image_path, date_reported
       FROM found_items
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
