-- ==========================================
-- Fix Categories RLS Policies
-- Allow authenticated users to read categories
-- ==========================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view active categories" ON fund_categories;
DROP POLICY IF EXISTS "Managers can manage categories" ON fund_categories;

-- Policy 1: All authenticated users can SELECT (read) categories
CREATE POLICY "Authenticated users can view categories"
ON fund_categories FOR SELECT
TO authenticated
USING (true);

-- Policy 2: All authenticated users can INSERT categories
CREATE POLICY "Authenticated users can insert categories"
ON fund_categories FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: All authenticated users can UPDATE categories
CREATE POLICY "Authenticated users can update categories"
ON fund_categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: All authenticated users can DELETE categories
CREATE POLICY "Authenticated users can delete categories"
ON fund_categories FOR DELETE
TO authenticated
USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'fund_categories';

-- Test: View all categories
SELECT * FROM fund_categories ORDER BY display_order;
