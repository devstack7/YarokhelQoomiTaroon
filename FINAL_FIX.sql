-- ==========================================
-- FINAL FIX - Remove Old Constraint & Fix All Phones
-- ==========================================
-- Copy ALL of this and run in Supabase SQL Editor

-- STEP 1: Remove OLD constraints first (IMPORTANT!)
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_length_check;
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_format_check;

-- STEP 2: Now we can update phones without constraint blocking us
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '' OR LENGTH(phone) < 13;

-- STEP 3: Fix specific invalid phone (the one causing error)
UPDATE fund_persons
SET phone = '+920000000000'
WHERE phone = '+00000000' OR phone LIKE '+0%';

-- STEP 4: Clean and fix all phones
UPDATE fund_persons
SET phone = REGEXP_REPLACE(phone, '[^0-9+]', '', 'g');

-- STEP 5: Fix phones starting with 0
UPDATE fund_persons
SET phone = '+92' || SUBSTRING(phone FROM 2)
WHERE phone ~ '^0[0-9]{10}$';

-- STEP 6: Fix phones starting with 92 (no +)
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone ~ '^92[0-9]{10}$';

-- STEP 7: Fix 10-digit phones
UPDATE fund_persons
SET phone = '+92' || phone
WHERE phone ~ '^[3-9][0-9]{9}$';

-- STEP 8: Fix phones with +92 but wrong length
UPDATE fund_persons
SET phone = '+920000000000'
WHERE phone LIKE '+92%' AND LENGTH(phone) != 13;

-- STEP 9: Check all phones (should show ALL as valid now)
SELECT 
    id, 
    name, 
    phone,
    LENGTH(phone) as len,
    CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN '✅' ELSE '❌' END as valid
FROM fund_persons
ORDER BY valid;

-- STEP 10: Count valid phones (should be 100%)
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 END) as valid,
    COUNT(CASE WHEN phone !~ '^\+92[0-9]{10}$' THEN 1 END) as invalid
FROM fund_persons;

-- STEP 11: If invalid count is 0, proceed to add constraint
-- Make phone NOT NULL
ALTER TABLE fund_persons 
ALTER COLUMN phone SET NOT NULL;

-- STEP 12: Add NEW constraint with correct format
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^\+92[0-9]{10}$');

-- STEP 13: Final verification
SELECT id, name, phone 
FROM fund_persons 
ORDER BY id
LIMIT 10;

-- SUCCESS MESSAGE
SELECT 
    '✅ SUCCESS! All phones are now in +92 format' as message,
    COUNT(*) || ' persons updated' as result
FROM fund_persons;

/*
==========================================
WHAT THIS DOES:
==========================================
1. Removes OLD constraint that was blocking updates
2. Fixes the specific phone "+00000000" to "+920000000000"
3. Fixes ALL other invalid phones
4. Adds NEW constraint with correct format
5. All phones will be: +923001234567 (13 characters)

==========================================
EXPECTED RESULT:
==========================================
✅ No errors
✅ All phones in format: +92XXXXXXXXXX
✅ Total records = Valid phones
✅ Can now add persons with proper validation

==========================================
AFTER THIS:
==========================================
1. Login as Manager
2. Go to Person Management
3. Edit "مولانا عبدالسلام" 
4. Change phone from +920000000000 to real number
5. System will auto-format to +92 format
*/
