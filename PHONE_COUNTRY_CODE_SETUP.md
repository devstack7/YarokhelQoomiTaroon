# Quick Setup: Phone Numbers with +92

## Kya Badla?

Phone numbers ab **+92** country code ke saath save honge:
- User type kare: `03001234567`
- System save kare: `+923001234567`

## Features:

### ✅ Auto-Formatting
User kisi bhi format mein type kar sakta hai:
- `03001234567` → `+923001234567`
- `923001234567` → `+923001234567`
- `+923001234567` → `+923001234567`

### ✅ Smart Input
- Jab user field chore (blur) tab auto-format hota hai
- Placeholder: "+923001234567 یا 03001234567"
- Hint: "خودکار +92 شامل ہو جائے گا"

### ✅ Validation
- Must be +92 followed by 10 digits
- Total 13 characters
- Format: `+92XXXXXXXXXX`

## Setup Steps:

### Step 1: Database Update
Supabase SQL Editor mein ye code run karein:

```sql
-- Purane numbers ko +92 format mein convert karein
UPDATE fund_persons
SET phone = CASE
  WHEN phone LIKE '+92%' THEN phone
  WHEN phone LIKE '92%' THEN '+' || phone
  WHEN phone LIKE '0%' THEN '+92' || SUBSTRING(phone FROM 2)
  ELSE '+92' || phone
END
WHERE phone IS NOT NULL;

-- Empty phones ko default value
UPDATE fund_persons 
SET phone = '+920000000000' 
WHERE phone IS NULL OR phone = '';

-- Phone field required
ALTER TABLE fund_persons
ALTER COLUMN phone SET NOT NULL;

-- Format validation
ALTER TABLE fund_persons
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^\+92[0-9]{10}$');
```

### Step 2: Purane Records Update
1. Manager login karein
2. Person Management mein jaaein
3. Jo persons ke paas `+920000000000` hai unko edit karein
4. Real phone number dalein (e.g., `03001234567`)
5. Save karein - automatically `+923001234567` ban jayega

### Step 3: Test Karein

#### Test 1: Naya Person Add
1. Manager dashboard → افراد
2. "نیا شخص" click karein
3. Phone field mein type karein: `03001234567`
4. Field se bahar click karein (blur)
5. Number automatically `+923001234567` ban jayega ✅
6. Save karein

#### Test 2: Different Formats
Try these formats - sab work karenge:
- `03001234567` ✅
- `923001234567` ✅
- `+923001234567` ✅
- `0300 123 4567` ✅ (spaces remove ho jayenge)

#### Test 3: Viewer Privacy
1. Viewer login: funds.viewer@yarukhelqoomi.com
2. Kisi bhi view mein jaaein
3. Phone numbers nahi dikhni chahiye ✅

## Examples:

### User Types:
```
03001234567
```

### After Blur (auto-format):
```
+923001234567
```

### In Database:
```
+923001234567
```

### Manager Dekhe:
```
📱 +923001234567
```

### Viewer Dekhe:
```
(Kuch nahi - hidden)
```

## Benefits:

1. **International Format**: Standard E.164 format
2. **Auto-Formatting**: User ko +92 nahi lagana parta
3. **Future Ready**: WhatsApp, calling links ready
4. **Data Quality**: Sab numbers same format mein
5. **Privacy**: Viewer se hidden

## Format Rules:

✅ **Valid Formats:**
- `+923001234567` (13 characters)
- `+923451234567`
- `+923331234567`

❌ **Invalid Formats:**
- `03001234567` (stored after format ✅)
- `+92300123` (too short)
- `+93001234567` (wrong country)
- `923` (incomplete)

## Files Changed:

1. `src/pages/PersonManagement.js` - Auto-formatting logic
2. `src/pages/PersonManagement.css` - Hint text style
3. `MAKE_PHONE_REQUIRED.sql` - Database migration

## Future Features (Optional):

### Click-to-Call:
```jsx
<a href="tel:+923001234567">📞 Call</a>
```

### WhatsApp:
```jsx
<a href="https://wa.me/923001234567">💬 WhatsApp</a>
```

### SMS:
```jsx
<a href="sms:+923001234567">📱 SMS</a>
```

Ab phone numbers international format mein hain! 🌍📱
