-- ==========================================
-- Add thumbnail_url column to gallery_items
-- ==========================================
-- This allows custom thumbnails for videos

-- Add the column if it doesn't exist
ALTER TABLE gallery_items 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Verify the column was added (optional - just to confirm)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'gallery_items';

/*
==========================================
USAGE:
==========================================

When adding a video, you can now optionally provide a thumbnail:

INSERT INTO gallery_items (type, title, video_url, thumbnail_url, display_order)
VALUES (
  'video', 
  'یوٹیوب شارٹس', 
  'https://www.youtube.com/embed/Xt-ZrAZ6atQ',
  'https://example.com/custom-thumbnail.jpg',
  1
);

Or update existing video with thumbnail:

UPDATE gallery_items
SET thumbnail_url = 'https://example.com/thumbnail.jpg'
WHERE id = 'uuid-here';

*/
