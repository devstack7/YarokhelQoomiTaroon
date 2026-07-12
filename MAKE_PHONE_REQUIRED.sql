-- Make phone field required (NOT NULL) in fund_persons table with country code format
-- Run this in Supabase SQL Editor

-- Step 1: First update any existing records with empty phone to a default value
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '';

-- Step 2: Update existing records to add +92 country code if missing
UPDATE fund_persons
SET phone = CASE
  WHEN phone LIKE '+92%' THEN phone
  WHEN phone LIKE '92%' THEN '+' || phone
  WHEN phone LIKE '0%' THEN '+92' || SUBSTRING(phone FROM 2)
  ELSE '+92' || phone
END
WHERE phone IS NOT NULL;

-- Step 3: Now make the phone column NOT NULL
ALTER TABLE fund_persons
ALTER COLUMN phone SET NOT NULL;

-- Step 4: Add a check constraint to ensure phone has correct format (+92 followed by 10 digits)
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check CHECK (phone ~ '^\+92[0-9]{10}$');

-- Verify the changes
SELECT id, name, phone FROM fund_persons ORDER BY name;

/*
NOTES:
------
1. All phone numbers will be in format: +923001234567
2. Country code +92 (Pakistan) is automatically added
3. Format: +92 followed by 10 digits (total 13 characters)
4. Examples:
   - User types: 03001234567  → Saved as: +923001234567
   - User types: 923001234567 → Saved as: +923001234567
   - User types: +923001234567 → Saved as: +923001234567

5. Existing records updated to include +92
6. From now on, phone field is REQUIRED when adding new persons
7. Phone must match format: +92XXXXXXXXXX
8. Manager will see phone numbers with country code
9. Viewer will NOT see phone numbers (hidden in frontend)

After running this SQL:
- Edit persons with '+920000000000' phone and add real numbers
- All new persons MUST have a phone number with +92 country code
- System automatically formats phone numbers
*/
