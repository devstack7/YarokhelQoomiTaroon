-- Fix Phone Format Error: Step-by-Step Solution
-- Run each section ONE BY ONE in Supabase SQL Editor

-- ==========================================
-- STEP 1: Check current phone numbers
-- ==========================================
-- See what phone numbers exist in the table
SELECT id, name, phone, LENGTH(phone) as phone_length
FROM fund_persons
ORDER BY id;

-- ==========================================
-- STEP 2: Fix empty or NULL phones
-- ==========================================
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '' OR TRIM(phone) = '';

-- ==========================================
-- STEP 3: Fix phones that don't have country code
-- ==========================================
-- Fix phones starting with 0 (Pakistani format)
UPDATE fund_persons
SET phone = '+92' || SUBSTRING(phone FROM 2)
WHERE phone LIKE '0%' AND phone NOT LIKE '+92%';

-- Fix phones starting with 92 but no +
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone LIKE '92%' AND phone NOT LIKE '+92%';

-- Fix phones with spaces or dashes (clean them first)
UPDATE fund_persons
SET phone = REGEXP_REPLACE(phone, '[^0-9+]', '', 'g')
WHERE phone ~ '[^0-9+]';

-- Fix any remaining phones without +92
UPDATE fund_persons
SET phone = '+92' || phone
WHERE phone ~ '^[0-9]' AND phone NOT LIKE '+92%' AND LENGTH(phone) = 10;

-- ==========================================
-- STEP 4: Verify all phones are in correct format
-- ==========================================
-- This should show all phones in +92XXXXXXXXXX format
SELECT id, name, phone, 
       LENGTH(phone) as length,
       phone ~ '^\+92[0-9]{10}$' as is_valid
FROM fund_persons
ORDER BY is_valid, id;

-- ==========================================
-- STEP 5: Check for invalid phones (should return 0 rows)
-- ==========================================
-- If this returns any rows, those need manual fixing
SELECT id, name, phone, LENGTH(phone) as length
FROM fund_persons
WHERE phone !~ '^\+92[0-9]{10}$'
ORDER BY id;

-- ==========================================
-- STEP 6: Manually fix any problematic phones
-- ==========================================
-- If STEP 5 showed any records, fix them manually like this:
-- UPDATE fund_persons SET phone = '+923001234567' WHERE id = 1;
-- UPDATE fund_persons SET phone = '+923451234567' WHERE id = 2;
-- (Replace with actual IDs and phone numbers)

-- ==========================================
-- STEP 7: Make phone NOT NULL (if not already)
-- ==========================================
ALTER TABLE fund_persons
ALTER COLUMN phone SET NOT NULL;

-- ==========================================
-- STEP 8: Add the format check constraint
-- ==========================================
-- First remove old constraints if they exist
ALTER TABLE fund_persons 
DROP CONSTRAINT IF EXISTS phone_length_check;

ALTER TABLE fund_persons 
DROP CONSTRAINT IF EXISTS phone_format_check;

-- Now add the new constraint
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^\+92[0-9]{10}$');

-- ==========================================
-- STEP 9: Final verification
-- ==========================================
-- All should be valid now
SELECT 
  COUNT(*) as total_persons,
  COUNT(CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 END) as valid_phones,
  COUNT(CASE WHEN phone !~ '^\+92[0-9]{10}$' THEN 1 END) as invalid_phones
FROM fund_persons;

-- Show all records
SELECT id, name, phone FROM fund_persons ORDER BY name;

/*
==========================================
NOTES:
==========================================
1. Run each STEP one by one
2. Check results after each step
3. If STEP 5 returns any rows, manually fix those phones in STEP 6
4. Only proceed to STEP 8 when STEP 5 returns 0 rows
5. Format: +92 followed by 10 digits (total 13 characters)
6. Example: +923001234567

==========================================
COMMON ISSUES & FIXES:
==========================================
Issue: Phone like "3001234567" (9 digits)
Fix: UPDATE fund_persons SET phone = '+9203001234567' WHERE id = X;

Issue: Phone like "00923001234567" (international prefix)
Fix: UPDATE fund_persons SET phone = '+923001234567' WHERE id = X;

Issue: Phone like "92-300-1234567" (with dashes)
Fix: Already handled in STEP 3 (removes dashes)

Issue: Phone like "+92 300 1234567" (with spaces)
Fix: Already handled in STEP 3 (removes spaces)
*/
