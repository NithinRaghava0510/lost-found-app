-- backend/db_init.sql

-- 1. Create "users" table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  college_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- 2. Create "lost_items" table (now with an image_path column)
CREATE TABLE IF NOT EXISTS lost_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date_lost DATE NOT NULL,
  location VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),              -- stores the relative path to the uploaded image
  date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create "found_items" table (also with image_path)
CREATE TABLE IF NOT EXISTS found_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date_found DATE NOT NULL,
  location VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),              -- stores the relative path to the uploaded image
  date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
