// /backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lostRoutes = require('./routes/lost');
const foundRoutes = require('./routes/found');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// 1) Serve uploaded files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Base route to check server health
app.get('/', (req, res) => {
  res.send('Lost/Found API is running');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/lost', lostRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
