-- ==========================================
-- FORCE FIX ALL PHONES - Complete Solution
-- ==========================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- Run it ALL AT ONCE

-- Step 1: Fix NULL and empty phones
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '' OR TRIM(phone) = '';

-- Step 2: Remove ALL special characters except + and numbers
UPDATE fund_persons
SET phone = REGEXP_REPLACE(phone, '[^0-9+]', '', 'g');

-- Step 3: Fix phones that start with '00' (international prefix)
UPDATE fund_persons
SET phone = '+' || SUBSTRING(phone FROM 3)
WHERE phone LIKE '00%';

-- Step 4: Fix phones starting with just '92' (no +)
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone ~ '^92[0-9]{10}$';

-- Step 5: Fix phones starting with '0' (Pakistani format)
UPDATE fund_persons
SET phone = '+92' || SUBSTRING(phone FROM 2)
WHERE phone ~ '^0[0-9]{10}$';

-- Step 6: Fix 10-digit phones (add +92)
UPDATE fund_persons
SET phone = '+92' || phone
WHERE phone ~ '^[3-9][0-9]{9}$';

-- Step 7: Fix if phone has +92 but wrong length (trim or pad)
UPDATE fund_persons
SET phone = SUBSTRING(phone FROM 1 FOR 13)
WHERE phone LIKE '+92%' AND LENGTH(phone) > 13;

-- Step 8: Ensure exactly 13 characters for +92 format
-- If less than 13, it needs manual fixing (will show in next query)

-- Step 9: Show any remaining invalid phones for manual fix
SELECT 
    id, 
    name, 
    phone,
    LENGTH(phone) as length,
    CASE 
        WHEN LENGTH(phone) < 13 THEN 'Too Short - Add digits'
        WHEN LENGTH(phone) > 13 THEN 'Too Long - Already trimmed'
        WHEN NOT phone ~ '^\+92' THEN 'No +92 prefix'
        ELSE 'Unknown issue'
    END as problem
FROM fund_persons
WHERE phone !~ '^\+92[0-9]{10}$';

-- ==========================================
-- MANUAL FIX TEMPLATE (if above query returns rows)
-- ==========================================
-- Copy one of these and update with actual id and phone:

-- UPDATE fund_persons SET phone = '+923001234567' WHERE id = 1;
-- UPDATE fund_persons SET phone = '+923451234567' WHERE id = 2;
-- UPDATE fund_persons SET phone = '+923331234567' WHERE id = 3;

-- ==========================================
-- After manual fixes, verify all are valid:
-- ==========================================
-- This should return 0 rows
SELECT id, name, phone FROM fund_persons 
WHERE phone !~ '^\+92[0-9]{10}$';

-- ==========================================
-- If all valid (0 rows above), add constraint:
-- ==========================================
-- First remove any old constraints
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_length_check;
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_format_check;

-- Make phone NOT NULL
ALTER TABLE fund_persons ALTER COLUMN phone SET NOT NULL;

-- Add the format constraint
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^\+92[0-9]{10}$');

-- ==========================================
-- Final verification - should show all valid
-- ==========================================
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 END) as valid_phones,
    MIN(LENGTH(phone)) as min_length,
    MAX(LENGTH(phone)) as max_length
FROM fund_persons;

-- Show first 10 records to verify
SELECT id, name, phone FROM fund_persons ORDER BY id LIMIT 10;

/*
==========================================
IMPORTANT NOTES:
==========================================
1. Run ALL commands above in one go
2. Check the SELECT query results
3. If any invalid phones remain, use manual fix template
4. Only add constraint after ALL phones are valid
5. Expected format: +923001234567 (exactly 13 characters)

==========================================
Common Manual Fixes Needed:
==========================================
If phone is like "3001234567" (9 digits):
→ UPDATE fund_persons SET phone = '+9203001234567' WHERE id = X;

If phone is like "92300" (too short):
→ UPDATE fund_persons SET phone = '+923001234567' WHERE id = X;
   (Ask user for complete number)

If phone is like "+9230012345" (11 digits):
→ UPDATE fund_persons SET phone = '+923001234567' WHERE id = X;
   (Ask user for complete number)
*/
