-- ==========================================
-- Create Dynamic Fund Categories System
-- SIMPLE VERSION - Run this in Supabase SQL Editor
-- ==========================================

-- STEP 1: Create fund_categories table
CREATE TABLE IF NOT EXISTS fund_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  name_urdu VARCHAR(200) NOT NULL,
  icon VARCHAR(10) DEFAULT '',
  color VARCHAR(7) DEFAULT '#4caf50',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fund_transactions_category 
ON fund_transactions(category);

CREATE INDEX IF NOT EXISTS idx_fund_categories_active 
ON fund_categories(is_active);

-- STEP 3: Drop old constraint if exists
ALTER TABLE fund_transactions 
DROP CONSTRAINT IF EXISTS fund_category_check;

-- STEP 4: Enable Row Level Security
ALTER TABLE fund_categories ENABLE ROW LEVEL SECURITY;

-- STEP 5: RLS Policy - Everyone can view active categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON fund_categories;
CREATE POLICY "Anyone can view active categories"
ON fund_categories FOR SELECT
USING (is_active = true);

-- STEP 6: Create function to get category summary
CREATE OR REPLACE FUNCTION get_category_summary()
RETURNS TABLE (
  category_name VARCHAR,
  category_urdu VARCHAR,
  icon VARCHAR,
  color VARCHAR,
  income NUMERIC,
  expense NUMERIC,
  balance NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fc.name,
    fc.name_urdu,
    fc.icon,
    fc.color,
    COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE 0 END), 0) as income,
    COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as expense,
    COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE -ft.amount END), 0) as balance,
    COUNT(ft.id) as transaction_count
  FROM fund_categories fc
  LEFT JOIN fund_transactions ft ON fc.name = ft.category
  WHERE fc.is_active = true
  GROUP BY fc.name, fc.name_urdu, fc.icon, fc.color, fc.display_order
  ORDER BY fc.display_order;
END;
$$ LANGUAGE plpgsql;

-- SUCCESS! Table created. Now run the next file to add default categories.
