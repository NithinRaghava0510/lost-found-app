-- backend/db_alter_add_image.sql

ALTER TABLE lost_items
  ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);

ALTER TABLE found_items
  ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);
