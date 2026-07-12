# 🕌 مجلس شوریٰ Module - Complete Setup Guide

## ✅ Module تیار ہے!

### اب آپ کے پاس یہ نیا module ہے:

1. **Database Table**: `shura_members` (Supabase میں)
2. **Admin Panel**: شوریٰ اراکین کو add/edit/delete کرنے کے لیے
3. **Public Page**: تمام شوریٰ اراکین کو دیکھنے کے لیے
4. **Button**: Leadership section میں جو shura page پر لے جاتا ہے

---

## 🚀 Setup Steps (5 منٹ میں مکمل کریں)

### Step 1: Supabase میں Table بنائیں

1. **Supabase Dashboard** کھولیں: https://supabase.com
2. Project **yqtpro** کھولیں
3. **SQL Editor** کھولیں
4. **New Query** کلک کریں
5. یہ SQL copy paste کر کے **Run** دبائیں:

```sql
-- shura_members table بنائیں
CREATE TABLE shura_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  detail TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS enable کریں
ALTER TABLE shura_members ENABLE ROW LEVEL SECURITY;

-- Policies بنائیں
CREATE POLICY "Allow public read access" 
ON shura_members FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated insert" 
ON shura_members FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update" 
ON shura_members FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete" 
ON shura_members FOR DELETE 
TO authenticated 
USING (true);
```

6. Success message آنا چاہیے! ✅

---

### Step 2: Storage میں Shura Folder بنائیں

1. Supabase Dashboard میں **Storage** کھولیں
2. `images` bucket کھولیں
3. **"Create folder"** کلک کریں
4. Folder name: `shura`
5. **"Create"** کلک کریں

---

### Step 3: Website Test کریں

1. Local server چل رہا ہونا چاہیے: `npm start`
2. Website کھولیں: `http://localhost:3000`
3. نیچے scroll کر کے **"قیادت"** section میں جائیں
4. **"مجلس شوریٰ کے تمام اراکین دیکھیں"** بٹن نظر آنا چاہیے
5. اس پر کلک کریں
6. Shura Members page کھل جائے گا (ابھی خالی ہوگا)

---

### Step 4: Admin Panel سے Shura Members Add کریں

1. **Admin Dashboard** کھولیں: `http://localhost:3000/admin/dashboard`
2. Login کریں
3. اوپر **"🕌 مجلس شوریٰ"** بٹن دکھائی دے گا
4. اس پر کلک کریں
5. **"نیا رکن شامل کریں"** بٹن دبائیں
6. Form بھریں:
   - **نام**: رکن کا نام
   - **پتہ**: ان کا علاقہ/گاؤں
   - **تفصیل**: مختصر تعارف
   - **ترتیب نمبر**: 1, 2, 3, 4... (جس order میں show کرنا ہو)
   - **تصویر**: URL یا file upload
7. **"محفوظ کریں"** دبائیں

---

## 📊 Features

### ✅ Admin Panel Features:
- ✨ شوریٰ اراکین کو add/edit/delete کریں
- 🖼️ تصاویر upload کریں (Supabase Storage میں)
- 🔢 Display order set کریں
- 📋 تمام اراکین کی لسٹ دیکھیں
- ✏️ کسی بھی رکن کو edit کریں
- 🗑️ حذف کریں

### ✅ Public Page Features:
- 🎨 خوبصورت card design
- 📱 Mobile responsive
- 📍 ہر رکن کا نام، پتہ، تفصیل
- 🖼️ تصویر کے ساتھ
- 🔙 واپس ہوم پیج کا بٹن
- 📊 کل اراکین کی تعداد show

---

## 🎯 URLs

### Public Pages:
- **Home**: `http://localhost:3000`
- **Shura Members**: `http://localhost:3000/shura-members`

### Admin Pages:
- **Login**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin/dashboard`
- **Shura Management**: `http://localhost:3000/admin/shura`

---

## 📋 Database Schema

**Table:** `shura_members`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | TEXT | رکن کا نام (required) |
| address | TEXT | پتہ/علاقہ (required) |
| detail | TEXT | تفصیل (required) |
| image_url | TEXT | تصویر کا URL (optional) |
| display_order | INTEGER | ترتیب نمبر (default: 999) |
| created_at | TIMESTAMP | تاریخ (auto-generated) |

---

## 🖼️ Image Upload

### Option 1: Local File Upload
- Admin panel میں file select کریں
- Automatic Supabase Storage میں upload ہوگی
- Path: `images/shura/filename.jpg`

### Option 2: URL استعمال کریں
- ImgBB یا Imgur پر تصویر upload کریں
- URL copy کر کے paste کریں

---

## 💡 Tips

### ترتیب کیسے set کریں؟
- **1** = پہلے نمبر پر
- **2** = دوسرے نمبر پر
- **3** = تیسرے نمبر پر
- وغیرہ...

### اگر 16 اراکین ہیں:
- ہر رکن کو 1 سے 16 تک نمبر دیں
- سب سے اہم رکن کو **1** دیں
- باقی اہمیت کے مطابق

### بہترین Practice:
1. پہلے تمام نام add کریں (بغیر تصویر)
2. پھر ایک ایک کر کے تصاویر update کریں
3. Order numbers بعد میں adjust کریں

---

## ⚠️ Troubleshooting

### مسئلہ 1: "Table not found"
**حل**: Step 1 کا SQL دوبارہ چلائیں

### مسئلہ 2: Image upload نہیں ہو رہی
**حل**: 
- `images` bucket public ہے check کریں
- `shura` folder موجود ہے check کریں
- Storage policies ہیں check کریں

### مسئلہ 3: Shura page خالی دکھ رہا
**حل**: Admin panel سے کچھ اراکین add کریں

### مسئلہ 4: Order صحیح نہیں
**حل**: ہر رکن کو edit کر کے `display_order` ٹھیک کریں

---

## 📁 Files Created

### Components:
- ✅ `src/pages/ShuraMembers.js` - Public page
- ✅ `src/pages/ShuraMembers.css` - Styling
- ✅ `src/pages/ShuraManagement.js` - Admin panel
- ✅ `src/pages/ShuraManagement.css` - Admin styling

### Database:
- ✅ `CREATE_SHURA_TABLE.sql` - Table creation script

### Documentation:
- ✅ `SHURA_SETUP_GUIDE.md` - یہ guide

### Modified Files:
- ✅ `src/App.js` - Routes added
- ✅ `src/components/Leadership.js` - Button added
- ✅ `src/components/Leadership.css` - Button styling
- ✅ `src/pages/AdminDashboard.js` - Shura link added

---

## 🎉 آپ کا Module تیار ہے!

اب آپ:
1. ✅ Admin panel سے شوریٰ اراکین add کر سکتے ہیں
2. ✅ Front-end پر اراکین دیکھ سکتے ہیں
3. ✅ Edit/delete کر سکتے ہیں
4. ✅ Order change کر سکتے ہیں
5. ✅ تصاویر upload کر سکتے ہیں

---

## 📞 Next Steps

اب آپ کو صرف یہ کرنا ہے:
1. **Supabase میں table بنائیں** (Step 1)
2. **16 اراکین کے نام اور تفصیلات بھیجیں**
3. **میں ان کو add کرنے میں مدد کروں گا**

**یا**

آپ خود admin panel سے ایک ایک کر کے add کریں! 🎯

