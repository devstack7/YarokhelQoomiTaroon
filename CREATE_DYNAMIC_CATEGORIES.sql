-- ==========================================
-- Create Dynamic Fund Categories System
-- ==========================================
-- This allows Manager to add unlimited categories dynamically

-- STEP 1: Create fund_categories table
CREATE TABLE IF NOT EXISTS fund_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  name_urdu VARCHAR(200) NOT NULL,
  icon VARCHAR(10) DEFAULT '📁',
  color VARCHAR(7) DEFAULT '#4caf50',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Add default categories
INSERT INTO fund_categories (name, name_urdu, icon, color, display_order) VALUES
('genealogy_group', 'شجرنسب اور گروپ', '📚', '#4caf50', 1),
('event', 'ایونٹ', '🎉', '#9c27b0', 2)
ON CONFLICT (name) DO NOTHING;

-- STEP 3: Drop old constraint from fund_transactions
ALTER TABLE fund_transactions 
DROP CONSTRAINT IF EXISTS fund_category_check;

-- STEP 4: Update category column to allow any value
-- (Remove check constraint, will validate against fund_categories table instead)

-- STEP 5: Add foreign key to fund_categories (optional, for referential integrity)
-- First, ensure all existing categories exist in fund_categories table
-- Then add foreign key
ALTER TABLE fund_transactions
ADD CONSTRAINT fk_fund_category
FOREIGN KEY (category) REFERENCES fund_categories(name)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- STEP 6: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_fund_transactions_category 
ON fund_transactions(category);

CREATE INDEX IF NOT EXISTS idx_fund_categories_active 
ON fund_categories(is_active);

-- STEP 7: Enable Row Level Security (RLS) for fund_categories
ALTER TABLE fund_categories ENABLE ROW LEVEL SECURITY;

-- STEP 8: RLS Policy - Everyone can read active categories
CREATE POLICY "Anyone can view active categories"
ON fund_categories FOR SELECT
USING (is_active = true);

-- STEP 9: RLS Policy - Only managers can insert/update/delete categories
CREATE POLICY "Managers can manage categories"
ON fund_categories FOR ALL
USING (
  auth.uid() IN (
    SELECT auth.uid() FROM fund_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND role = 'manager'
  )
);

-- STEP 10: Create function to get category summary
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

-- STEP 11: Verify setup
SELECT * FROM fund_categories ORDER BY display_order;

-- STEP 12: Test the summary function
SELECT * FROM get_category_summary();

/*
==========================================
DYNAMIC CATEGORIES FEATURES:
==========================================

✅ Unlimited Categories: Manager can add as many as needed
✅ Customizable: Each category has name, icon, color
✅ Order Control: Set display order for categories
✅ Active/Inactive: Can temporarily disable categories
✅ Safe Deletion: Cannot delete category with transactions
✅ Automatic Updates: Foreign key CASCADE updates

==========================================
CATEGORY FIELDS:
==========================================

- id: Unique identifier (UUID)
- name: English name (unique, used in database)
- name_urdu: Urdu display name
- icon: Emoji icon (📚, 🎉, 💰, etc.)
- color: Hex color code (#4caf50, #9c27b0, etc.)
- description: Optional description
- display_order: Sort order (1, 2, 3...)
- is_active: Active/Inactive flag
- created_at: Creation timestamp
- updated_at: Last update timestamp

==========================================
EXAMPLE: Add New Category
==========================================

INSERT INTO fund_categories (name, name_urdu, icon, color, display_order)
VALUES ('medical', 'طبی امداد', '🏥', '#f44336', 3);

INSERT INTO fund_categories (name, name_urdu, icon, color, display_order)
VALUES ('education', 'تعلیمی', '📖', '#2196f3', 4);

INSERT INTO fund_categories (name, name_urdu, icon, color, display_order)
VALUES ('sports', 'کھیلوں کے لیے', '⚽', '#ff9800', 5);

==========================================
EXAMPLE: Update Category
==========================================

UPDATE fund_categories
SET name_urdu = 'نیا نام', icon = '🆕', color = '#00bcd4'
WHERE name = 'genealogy_group';

==========================================
EXAMPLE: Deactivate Category
==========================================

UPDATE fund_categories
SET is_active = false
WHERE name = 'old_category';

==========================================
EXAMPLE: Change Display Order
==========================================

UPDATE fund_categories SET display_order = 1 WHERE name = 'event';
UPDATE fund_categories SET display_order = 2 WHERE name = 'genealogy_group';

==========================================
BENEFITS:
==========================================

✅ No code changes needed to add categories
✅ Manager controls everything from UI
✅ Categories can be added anytime
✅ Old transactions stay linked
✅ Easy to reorganize (display_order)
✅ Can temporarily disable without deleting
✅ Color-coded for visual distinction
✅ Icons for quick identification

*/
