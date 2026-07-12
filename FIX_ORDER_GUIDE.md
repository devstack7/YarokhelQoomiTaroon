# 🔢 Leaders کی ترتیب ٹھیک کرنے کا طریقہ

## مسئلہ:
مصطفیٰ کمال یوسف زئی آخر میں add ہوئے تھے، اس لیے آخر میں show ہو رہے ہیں۔
لیکن ہم چاہتے ہیں کہ وہ پیرزادہ حسن زئی کے بعد (4th position) show ہوں۔

---

## ✅ حل: Step by Step

### Step 1: Database میں `display_order` Column Add کریں

1. **Supabase Dashboard** کھولیں: https://supabase.com
2. اپنا project **yqtpro** کھولیں
3. بائیں menu میں **SQL Editor** کلک کریں
4. **New Query** کلک کریں
5. یہ SQL paste کریں:

```sql
-- display_order column add کریں
ALTER TABLE leaders 
ADD COLUMN display_order INTEGER DEFAULT 999;

-- موجودہ leaders کو order assign کریں (نام سے)
UPDATE leaders SET display_order = 1 WHERE name LIKE '%صاحب خان%';
UPDATE leaders SET display_order = 2 WHERE name LIKE '%شاہد حسین%';
UPDATE leaders SET display_order = 3 WHERE name LIKE '%حسن زئی%' AND name NOT LIKE '%مصطفیٰ%';
UPDATE leaders SET display_order = 4 WHERE name LIKE '%مصطفیٰ کمال%';
UPDATE leaders SET display_order = 5 WHERE name LIKE '%منیر%';
UPDATE leaders SET display_order = 6 WHERE name LIKE '%شمروز%';

-- Check کریں
SELECT name, position, display_order 
FROM leaders 
ORDER BY display_order;
```

6. **Run** بٹن دبائیں
7. نیچے results میں check کریں - صحیح order میں show ہونا چاہیے!

---

### Step 2: Website Refresh کریں

1. اپنی website کھولیں: `http://localhost:3000`
2. **Ctrl + Shift + R** دبائیں (hard refresh)
3. نیچے scroll کر کے **"قیادت"** section دیکھیں
4. اب leaders **صحیح order** میں ہونے چاہیئیں:
   - 1️⃣ صاحب خان عاجز (صدر)
   - 2️⃣ شاہد حسین (نائب صدر)
   - 3️⃣ پیرزادہ حسن زئی (سیکرٹری جنرل)
   - 4️⃣ مصطفیٰ کمال یوسف زئی (ڈپٹی سیکرٹری جنرل) ✅
   - 5️⃣ منیر یوسف زئی (سیکرٹری خزانہ)
   - 6️⃣ شمروز خان (سیکرٹری اطلاعات)

---

## 🎯 اب آئندہ کے لیے

اگر نیا leader add کرنا ہو:

1. **Admin Dashboard** کھولیں
2. **"نیا اضافہ کریں"** دبائیں
3. Form میں اب **"ترتیب نمبر"** کی field بھی ہے
4. جس position پر چاہیں، وہ نمبر دیں:
   - **1** = سب سے پہلے
   - **2** = دوسرے نمبر پر
   - **3** = تیسرے نمبر پر
   - وغیرہ...

5. Save کریں - وہ leader اسی position پر show ہوگا!

---

## ✏️ موجودہ Leader کی Order Change کرنا

1. **Admin Dashboard** کھولیں
2. جس leader کی position change کرنی ہے، اس کے سامنے **✏️ Edit** دبائیں
3. **"ترتیب نمبر"** field میں نیا نمبر ڈالیں
4. **"محفوظ کریں"** دبائیں
5. Front-end پر refresh کریں - نئی ترتیب show ہوگی!

---

## 💡 مثالیں

### مثال 1: نیا Vice President 2nd position پر add کرنا
- Name: نیا نائب صدر
- Position: نائب صدر
- **Display Order: 2**
- Save کریں
- Result: شاہد حسین اور باقی سب ایک نمبر نیچے shift ہو جائیں گے

### مثال 2: کسی کو سب سے اوپر لانا
- اس leader کو edit کریں
- **Display Order: 1** کر دیں
- پرانا #1 خود بخود #2 بن جائے گا

---

## ⚠️ Important Notes

1. **دو leaders کا same number نہ دیں** - ورنہ confusion ہوگی
2. **1, 2, 3, 4... sequence بہتر ہے** - gaps نہ چھوڑیں
3. **999 default value ہے** - اگر آپ order نہ دیں تو 999 assign ہوگا (آخر میں)

---

## 🔍 Verify کرنے کا آسان طریقہ

Supabase SQL Editor میں:

```sql
-- موجودہ order دیکھیں
SELECT display_order, name, position 
FROM leaders 
ORDER BY display_order;
```

یہ run کریں اور check کریں کہ order صحیح ہے!

---

## ✅ Done!

اب آپ کی website پر leaders **آپ کی مرضی کی ترتیب** میں show ہوں گے! 🎉

