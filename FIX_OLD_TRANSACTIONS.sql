-- ==========================================
-- Fix Old Transactions - Add Category
-- Update all NULL/empty category transactions
-- ==========================================

-- Step 1: Check current status
SELECT 
  CASE 
    WHEN category IS NULL THEN 'NULL'
    WHEN category = '' THEN 'EMPTY'
    ELSE category
  END as category_status,
  COUNT(*) as count,
  SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense
FROM fund_transactions
GROUP BY category_status;

-- Step 2: Update all NULL categories to 'genealogy_group'
UPDATE fund_transactions
SET category = 'genealogy_group'
WHERE category IS NULL;

-- Step 3: Update all empty string categories to 'genealogy_group'
UPDATE fund_transactions
SET category = 'genealogy_group'
WHERE category = '';

-- Step 4: Verify update
SELECT 
  category,
  COUNT(*) as transaction_count,
  SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN type='income' THEN amount ELSE -amount END) as balance
FROM fund_transactions
GROUP BY category
ORDER BY category;

-- Step 5: Check if all transactions now have categories
SELECT COUNT(*) as transactions_without_category
FROM fund_transactions
WHERE category IS NULL OR category = '';

-- SUCCESS! All transactions should now have 'genealogy_group' category
