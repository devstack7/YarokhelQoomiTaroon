-- ================================================
-- 🕌 Majlis-e-Shura (شوریٰ اراکین) Table
-- Supabase SQL Editor میں یہ چلائیں
-- ================================================

-- Step 1: shura_members table بنائیں
CREATE TABLE shura_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  detail TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Row Level Security enable کریں
ALTER TABLE shura_members ENABLE ROW LEVEL SECURITY;

-- Step 3: Public read access
CREATE POLICY "Allow public read access" 
ON shura_members FOR SELECT 
TO public 
USING (true);

-- Step 4: Authenticated users can insert
CREATE POLICY "Allow authenticated insert" 
ON shura_members FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Step 5: Authenticated users can update
CREATE POLICY "Allow authenticated update" 
ON shura_members FOR UPDATE 
TO authenticated 
USING (true);

-- Step 6: Authenticated users can delete
CREATE POLICY "Allow authenticated delete" 
ON shura_members FOR DELETE 
TO authenticated 
USING (true);

-- Step 7: Verify کریں
SELECT * FROM shura_members ORDER BY display_order;

-- ✅ Success! Table تیار ہے
