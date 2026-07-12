-- ==========================================
-- Add Fund Categories to Transaction System
-- ==========================================
-- Two categories:
-- 1. شجرنسب کی ترتیب کے لیے اور باقی گروپ کے لیے (Genealogy & Group)
-- 2. ایونٹ کے لیے (Events)

-- STEP 1: Add category column to fund_transactions table
ALTER TABLE fund_transactions
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- STEP 2: Set default category for existing records
UPDATE fund_transactions
SET category = 'genealogy_group'
WHERE category IS NULL;

-- STEP 3: Make category required for future records
ALTER TABLE fund_transactions
ALTER COLUMN category SET NOT NULL;

-- STEP 4: Add check constraint for valid categories
ALTER TABLE fund_transactions
ADD CONSTRAINT fund_category_check
CHECK (category IN ('genealogy_group', 'event'));

-- STEP 5: Verify the changes
SELECT 
    category,
    type,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM fund_transactions
GROUP BY category, type
ORDER BY category, type;

-- STEP 6: Show sample records
SELECT 
    id,
    name,
    type,
    category,
    amount,
    purpose,
    date
FROM fund_transactions
ORDER BY date DESC
LIMIT 10;

/*
==========================================
CATEGORY DEFINITIONS:
==========================================

1. genealogy_group (شجرنسب کی ترتیب کے لیے اور باقی گروپ کے لیے)
   - For genealogy documentation
   - For general group expenses
   - Regular organizational costs

2. event (ایونٹ کے لیے)
   - For specific events
   - Event-based fundraising
   - Event-specific expenses

==========================================
USAGE:
==========================================

Add Income (Genealogy):
INSERT INTO fund_transactions (name, type, category, amount, purpose, date, person_id)
VALUES ('احمد', 'income', 'genealogy_group', 5000, 'شجرنسب کے لیے', '2026-01-15', 'person-id');

Add Income (Event):
INSERT INTO fund_transactions (name, type, category, amount, purpose, date, person_id)
VALUES ('علی', 'income', 'event', 3000, 'سالانہ تقریب', '2026-01-20', 'person-id');

Add Expense (Genealogy):
INSERT INTO fund_transactions (name, type, category, amount, purpose, date, description)
VALUES ('شجرنسب پرنٹنگ', 'expense', 'genealogy_group', 2000, 'پرنٹنگ', '2026-01-25', 'شجرنسب کی کتاب');

Add Expense (Event):
INSERT INTO fund_transactions (name, type, category, amount, purpose, date, description)
VALUES ('ہال رینٹ', 'expense', 'event', 1500, 'ہال', '2026-01-30', 'سالانہ تقریب کا ہال');

==========================================
REPORTING QUERIES:
==========================================

-- Category-wise summary
SELECT 
    category,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
FROM fund_transactions
GROUP BY category;

-- Detailed report by category
SELECT 
    CASE 
        WHEN category = 'genealogy_group' THEN 'شجرنسب اور گروپ'
        WHEN category = 'event' THEN 'ایونٹ'
    END as category_name,
    type,
    COUNT(*) as transactions,
    SUM(amount) as total
FROM fund_transactions
GROUP BY category, type
ORDER BY category, type;
*/
