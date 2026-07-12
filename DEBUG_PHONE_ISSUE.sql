-- ==========================================
-- DEBUG: Find Invalid Phone Numbers
-- ==========================================
-- Run this FIRST to see what's wrong

-- Check ALL current phones
SELECT 
    id, 
    name, 
    phone,
    LENGTH(phone) as length,
    CASE 
        WHEN phone IS NULL THEN '❌ NULL'
        WHEN phone = '' THEN '❌ EMPTY'
        WHEN phone ~ '^\+92[0-9]{10}$' THEN '✅ VALID'
        ELSE '❌ INVALID: ' || phone
    END as status
FROM fund_persons
ORDER BY 
    CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 ELSE 0 END,
    id;

-- ==========================================
-- Show ONLY invalid phones that need fixing
-- ==========================================
SELECT 
    id, 
    name, 
    phone,
    LENGTH(phone) as length,
    '❌ Invalid Format' as issue
FROM fund_persons
WHERE phone !~ '^\+92[0-9]{10}$' OR phone IS NULL OR phone = ''
ORDER BY id;

-- ==========================================
-- Count valid vs invalid
-- ==========================================
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN phone ~ '^\+92[0-9]{10}$' THEN 1 END) as valid,
    COUNT(CASE WHEN phone !~ '^\+92[0-9]{10}$' OR phone IS NULL THEN 1 END) as invalid
FROM fund_persons;
