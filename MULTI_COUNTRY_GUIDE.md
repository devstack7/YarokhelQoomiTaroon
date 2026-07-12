# Multi-Country Phone Support Guide

## Supported Countries:

### 🇵🇰 Pakistan (+92)
- **Format**: +92 followed by 10 digits
- **Length**: 13 characters
- **Example**: +923001234567
- **Input formats**:
  - `03001234567` → `+923001234567`
  - `923001234567` → `+923001234567`
  - `+923001234567` → `+923001234567`

### 🇸🇦 Saudi Arabia (+966)
- **Format**: +966 followed by 9 digits  
- **Length**: 13 characters
- **Example**: +966501234567
- **Input formats**:
  - `966501234567` → `+966501234567`
  - `+966501234567` → `+966501234567`
  - Manual: Type `+966501234567` directly

### 🇦🇪 UAE / Dubai (+971)
- **Format**: +971 followed by 8-9 digits
- **Length**: 12-13 characters
- **Examples**: 
  - Mobile: `+971501234567` (13 chars)
  - Landline: `+97142345678` (12 chars)
- **Input formats**:
  - `971501234567` → `+971501234567`
  - `+971501234567` → `+971501234567`
  - Manual: Type `+971501234567` directly

## Database Setup:

### Run This SQL:

Open **MULTI_COUNTRY_FIX.sql** file and run entire content in Supabase SQL Editor.

**OR** copy-paste this:

```sql
-- Remove old constraints
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_length_check;
ALTER TABLE fund_persons DROP CONSTRAINT IF EXISTS phone_format_check;

-- Fix empty phones
UPDATE fund_persons SET phone = '+920000000000' WHERE phone IS NULL OR phone = '';

-- Clean phones
UPDATE fund_persons SET phone = REGEXP_REPLACE(phone, '[^0-9+]', '', 'g');

-- Fix Pakistan numbers
UPDATE fund_persons SET phone = '+92' || SUBSTRING(phone FROM 2) WHERE phone ~ '^0[0-9]{10}$';
UPDATE fund_persons SET phone = '+' || phone WHERE phone ~ '^92[0-9]{10}$' AND phone NOT LIKE '+%';

-- Fix Saudi numbers
UPDATE fund_persons SET phone = '+' || phone WHERE phone ~ '^966[0-9]{9}$' AND phone NOT LIKE '+%';

-- Fix UAE numbers
UPDATE fund_persons SET phone = '+' || phone WHERE phone ~ '^971[0-9]{8,9}$' AND phone NOT LIKE '+%';

-- Make phone required
ALTER TABLE fund_persons ALTER COLUMN phone SET NOT NULL;

-- Add multi-country constraint
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (
    phone ~ '^\+92[0-9]{10}$' OR 
    phone ~ '^\+966[0-9]{9}$' OR 
    phone ~ '^\+971[0-9]{8,9}$'
);

-- Verify
SELECT id, name, phone FROM fund_persons LIMIT 10;
```

## Form Usage (Manager):

### Adding Person with Different Countries:

#### Pakistan Number:
```
Type: 03001234567
Auto-formats to: +923001234567 ✅
```

#### Saudi Number:
```
Type: +966501234567
Stays as: +966501234567 ✅
```

#### UAE Number:
```
Type: +971501234567
Stays as: +971501234567 ✅
```

## Validation Rules:

### Valid Formats:
✅ `+923001234567` (Pakistan)
✅ `+923451234567` (Pakistan)
✅ `+966501234567` (Saudi)
✅ `+966541234567` (Saudi)
✅ `+971501234567` (UAE mobile)
✅ `+97142345678` (UAE landline)

### Invalid Formats:
❌ `03001234567` (will auto-format to +92)
❌ `0501234567` (ambiguous - defaults to Pakistan)
❌ `+1234567890` (unsupported country)
❌ `+92300` (too short)

## Auto-Formatting Logic:

### Pakistan (Default):
- Starts with `0` → Add `+92`, remove `0`
- Starts with `92` → Add `+`
- Starts with `3-9` (10 digits) → Add `+92`

### Saudi Arabia:
- Starts with `966` → Add `+`
- Must type full `+966` for proper detection

### UAE:
- Starts with `971` → Add `+`
- Must type full `+971` for proper detection

## Manual Fix Examples:

### If auto-format doesn't work:

```sql
-- Fix Saudi number
UPDATE fund_persons 
SET phone = '+966501234567' 
WHERE id = 'person-id-here';

-- Fix UAE number
UPDATE fund_persons 
SET phone = '+971501234567' 
WHERE id = 'person-id-here';

-- Fix Pakistan number
UPDATE fund_persons 
SET phone = '+923001234567' 
WHERE id = 'person-id-here';
```

## Country Detection Tips:

### For Manager Adding Persons:

**Pakistan Numbers (Default):**
- Just type: `03001234567`
- Auto-formats: `+923001234567` ✅

**Saudi Numbers:**
- Type complete: `+966501234567`
- Or: `966501234567` (will add +)

**UAE Numbers:**
- Type complete: `+971501234567`
- Or: `971501234567` (will add +)

**Pro Tip:** Always include country code (+966 or +971) for Saudi/UAE numbers to avoid confusion.

## Display Format:

### Manager View:
```
Person Card:
━━━━━━━━━━━━━━━━━━━
احمد علی
📱 +923001234567 🇵🇰
━━━━━━━━━━━━━━━━━━━

عبداللہ
📱 +966501234567 🇸🇦
━━━━━━━━━━━━━━━━━━━

محمد
📱 +971501234567 🇦🇪
━━━━━━━━━━━━━━━━━━━
```

### Viewer View:
```
(No phone numbers visible)
```

## Country Statistics Query:

```sql
SELECT 
    CASE 
        WHEN phone ~ '^\+92' THEN '🇵🇰 Pakistan'
        WHEN phone ~ '^\+966' THEN '🇸🇦 Saudi Arabia'
        WHEN phone ~ '^\+971' THEN '🇦🇪 UAE'
    END as country,
    COUNT(*) as persons
FROM fund_persons
GROUP BY country
ORDER BY persons DESC;
```

## Testing Checklist:

### ✅ Pakistan Numbers:
- [ ] Add person with `03001234567`
- [ ] Should save as `+923001234567`
- [ ] Should pass validation

### ✅ Saudi Numbers:
- [ ] Add person with `+966501234567`
- [ ] Should save as `+966501234567`
- [ ] Should pass validation

### ✅ UAE Numbers:
- [ ] Add person with `+971501234567`
- [ ] Should save as `+971501234567`
- [ ] Should pass validation

### ✅ Privacy:
- [ ] Manager can see all phones
- [ ] Viewer cannot see any phones

## Files Modified:

1. **src/pages/PersonManagement.js**
   - Updated formatPhoneNumber() for multi-country
   - Updated placeholder text
   - Updated pattern validation
   - Updated hint text

2. **Database**
   - New constraint supports 3 countries
   - Validates Pakistan, Saudi, UAE formats

3. **MULTI_COUNTRY_FIX.sql** (NEW)
   - Complete migration script
   - Fixes all existing numbers
   - Adds multi-country constraint

## Future: Click-to-Call

```jsx
<a href={`tel:${person.phone}`}>
  {person.phone.startsWith('+92') && '🇵🇰'}
  {person.phone.startsWith('+966') && '🇸🇦'}
  {person.phone.startsWith('+971') && '🇦🇪'}
  {person.phone}
</a>
```

## Summary:

| Country | Code | Digits | Length | Example |
|---------|------|--------|--------|---------|
| 🇵🇰 Pakistan | +92 | 10 | 13 | +923001234567 |
| 🇸🇦 Saudi | +966 | 9 | 13 | +966501234567 |
| 🇦🇪 UAE | +971 | 8-9 | 12-13 | +971501234567 |

Now supports international donors! 🌍📱
