-- ==========================================
-- Create Gallery Items Table
-- ==========================================
-- For managing images and videos in the gallery

-- STEP 1: Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  
  -- For images: URL or uploaded image path
  image_url TEXT,
  
  -- For videos: YouTube embed link
  video_url TEXT,
  
  -- For videos: Custom thumbnail URL (optional)
  thumbnail_url TEXT,
  
  -- Metadata
  display_order INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: Either image_url or video_url must be present
  CONSTRAINT url_required CHECK (
    (type = 'image' AND image_url IS NOT NULL) OR
    (type = 'video' AND video_url IS NOT NULL)
  )
);

-- STEP 2: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_type ON gallery_items(type);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON gallery_items(display_order);

-- STEP 3: Enable Row Level Security (RLS)
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- STEP 4: RLS Policy - Everyone can view active items
CREATE POLICY "Anyone can view active gallery items"
ON gallery_items FOR SELECT
USING (is_active = true);

-- STEP 5: RLS Policy - Only authenticated users (admin) can manage
CREATE POLICY "Admin can manage gallery items"
ON gallery_items FOR ALL
USING (auth.uid() IS NOT NULL);

-- STEP 6: Insert some default items (optional)
INSERT INTO gallery_items (type, title, category, image_url, display_order) VALUES
('image', 'خوبصورت پہاڑی مناظر', 'قدرتی', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 1),
('image', 'برفانی چوٹیاں', 'قدرتی', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', 2),
('image', 'قبائلی اجتماع', 'تقریبات', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 3),
('image', 'روایتی جرگہ', 'ثقافتی', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', 4)
ON CONFLICT DO NOTHING;

-- STEP 7: Create function to update timestamp
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 8: Create trigger for auto-updating timestamp
DROP TRIGGER IF EXISTS gallery_items_updated_at ON gallery_items;
CREATE TRIGGER gallery_items_updated_at
BEFORE UPDATE ON gallery_items
FOR EACH ROW
EXECUTE FUNCTION update_gallery_updated_at();

-- STEP 9: Verify setup
SELECT * FROM gallery_items ORDER BY display_order;

/*
==========================================
GALLERY ITEMS FEATURES:
==========================================

✅ Image Support: Upload images or provide URL
✅ Video Support: YouTube embed links
✅ Categories: Organize by category (قدرتی, تقریبات, ثقافتی, etc.)
✅ Display Order: Control the order of items
✅ Active/Inactive: Show/hide items without deleting
✅ Title & Description: Urdu text support
✅ Admin Only: Only authenticated users can manage

==========================================
EXAMPLE: Add Image
==========================================

INSERT INTO gallery_items (type, title, category, image_url, display_order)
VALUES ('image', 'تقریب کی تصویر', 'تقریبات', 'https://example.com/image.jpg', 5);

==========================================
EXAMPLE: Add Video (YouTube)
==========================================

-- YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
-- Embed URL: https://www.youtube.com/embed/VIDEO_ID

INSERT INTO gallery_items (type, title, category, video_url, display_order)
VALUES ('video', 'قومی تقریب', 'ویڈیوز', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 6);

==========================================
EXAMPLE: Update Item
==========================================

UPDATE gallery_items
SET title = 'نیا عنوان', category = 'نئی قسم'
WHERE id = 'uuid-here';

==========================================
EXAMPLE: Deactivate Item
==========================================

UPDATE gallery_items
SET is_active = false
WHERE id = 'uuid-here';

==========================================
EXAMPLE: Change Display Order
==========================================

UPDATE gallery_items SET display_order = 1 WHERE id = 'uuid-1';
UPDATE gallery_items SET display_order = 2 WHERE id = 'uuid-2';

==========================================
CATEGORIES SUGGESTIONS:
==========================================

- قدرتی (Nature)
- تقریبات (Events)
- ثقافتی (Cultural)
- تعلیمی (Educational)
- کھیل (Sports)
- مذہبی (Religious)
- ویڈیوز (Videos)
- تاریخی (Historical)

*/

