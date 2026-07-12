-- ================================================
-- 🔥 STORAGE PERMISSIONS FIX
-- یہ SQL Supabase SQL Editor میں چلائیں
-- ================================================

-- Step 1: پہلے سے موجود policies remove کریں (اگر ہوں)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users full access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated write access" ON storage.objects;

-- Step 2: نئی policies بنائیں (مکمل access)

-- Public users images دیکھ سکتے ہیں
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Authenticated users upload کر سکتے ہیں
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Authenticated users update کر سکتے ہیں
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Authenticated users delete کر سکتے ہیں
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Step 3: Verify کریں
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename = 'objects';

-- ✅ اگر 4 policies show ہوں تو کامیاب!
