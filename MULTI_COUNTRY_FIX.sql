-- ==========================================
-- MULTI-COUNTRY PHONE SUPPORT
-- Pakistan (+92), Saudi Arabia (+966), UAE (+971)
-- ==========================================

-- STEP 1: Remove OLD constraints
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_length_check;
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_format_check;

-- STEP 2: Fix empty/null phones to default Pakistan
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '' OR TRIM(phone) = '';

-- STEP 3: Fix invalid phones like '+00000000'
UPDATE fund_persons
SET phone = '+920000000000'
WHERE phone LIKE '+0%' AND phone NOT LIKE '+9%';

-- STEP 4: Clean phones - remove spaces, dashes, etc
UPDATE fund_persons
SET phone = REGEXP_REPLACE(phone, '[^0-9+]', '', 'g');

-- STEP 5: Fix Pakistan numbers (starting with 0)
UPDATE fund_persons
SET phone = '+92' || SUBSTRING(phone FROM 2)
WHERE phone ~ '^0[0-9]{10}$';

-- STEP 6: Fix Pakistan numbers (starting with 92, no +)
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone ~ '^92[0-9]{10}$' AND phone NOT LIKE '+%';

-- STEP 7: Fix Saudi numbers (starting with 966, no +)
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone ~ '^966[0-9]{9}$' AND phone NOT LIKE '+%';

-- STEP 8: Fix UAE numbers (starting with 971, no +)
UPDATE fund_persons
SET phone = '+' || phone
WHERE phone ~ '^971[0-9]{8,9}$' AND phone NOT LIKE '+%';

-- STEP 9: Fix 10-digit Pakistan numbers (assume Pakistan if 10 digits)
UPDATE fund_persons
SET phone = '+92' || phone
WHERE phone ~ '^[3-9][0-9]{9}$' AND LENGTH(phone) = 10;

-- STEP 10: Check current phones status
SELECT 
    id, 
    name, 
    phone,
    LENGTH(phone) as len,
    CASE 
        WHEN phone ~ '^\+92[0-9]{10}$' THEN '✅ Pakistan'
        WHEN phone ~ '^\+966[0-9]{9}$' THEN '✅ Saudi Arabia'
        WHEN phone ~ '^\+971[0-9]{8,9}$' THEN '✅ UAE'
        ELSE '❌ Invalid: ' || phone
    END as status
FROM fund_persons
ORDER BY status, name;

-- STEP 11: Count by country
SELECT 
    CASE 
        WHEN phone ~ '^\+92[0-9]{10}$' THEN 'Pakistan (+92)'
        WHEN phone ~ '^\+966[0-9]{9}$' THEN 'Saudi Arabia (+966)'
        WHEN phone ~ '^\+971[0-9]{8,9}$' THEN 'UAE (+971)'
        ELSE 'Invalid/Other'
    END as country,
    COUNT(*) as count
FROM fund_persons
GROUP BY 
    CASE 
        WHEN phone ~ '^\+92[0-9]{10}$' THEN 'Pakistan (+92)'
        WHEN phone ~ '^\+966[0-9]{9}$' THEN 'Saudi Arabia (+966)'
        WHEN phone ~ '^\+971[0-9]{8,9}$' THEN 'UAE (+971)'
        ELSE 'Invalid/Other'
    END
ORDER BY count DESC;

-- STEP 12: Make phone NOT NULL
ALTER TABLE fund_persons 
ALTER COLUMN phone SET NOT NULL;

-- STEP 13: Add NEW constraint supporting multiple countries
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (
    phone ~ '^\+92[0-9]{10}$' OR    -- Pakistan: +92XXXXXXXXXX (13 chars)
    phone ~ '^\+966[0-9]{9}$' OR    -- Saudi: +966XXXXXXXXX (13 chars)
    phone ~ '^\+971[0-9]{8,9}$'     -- UAE: +971XXXXXXXX or +971XXXXXXXXX (12-13 chars)
);

-- STEP 14: Final verification
SELECT 
    COUNT(*) as total_persons,
    COUNT(CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 END) as pakistan,
    COUNT(CASE WHEN phone ~ '^\+966[0-9]{9}$' THEN 1 END) as saudi,
    COUNT(CASE WHEN phone ~ '^\+971[0-9]{8,9}$' THEN 1 END) as uae
FROM fund_persons;

-- STEP 15: Show sample records
SELECT id, name, phone FROM fund_persons ORDER BY phone LIMIT 10;

/*
==========================================
SUPPORTED FORMATS:
==========================================
✅ Pakistan: +923001234567 (13 characters)
   Format: +92 followed by 10 digits
   Example: +923001234567

✅ Saudi Arabia: +966501234567 (13 characters)
   Format: +966 followed by 9 digits
   Example: +966501234567

✅ UAE/Dubai: +971501234567 (13 characters) or +97142345678 (12 characters)
   Format: +971 followed by 8-9 digits
   Example: +971501234567 (mobile) or +97142345678 (landline)

==========================================
EXAMPLES:
==========================================
Pakistan:
  Input: 03001234567     → Output: +923001234567
  Input: 923001234567    → Output: +923001234567

Saudi Arabia:
  Input: 966501234567    → Output: +966501234567
  Input: 0501234567      → Needs manual fix to +966501234567

UAE:
  Input: 971501234567    → Output: +971501234567
  Input: 0501234567      → Needs manual fix to +971501234567

==========================================
MANUAL FIX IF NEEDED:
==========================================
-- Saudi number
UPDATE fund_persons SET phone = '+966501234567' WHERE id = X;

-- UAE number
UPDATE fund_persons SET phone = '+971501234567' WHERE id = Y;

-- Pakistan number
UPDATE fund_persons SET phone = '+923001234567' WHERE id = Z;
*/
