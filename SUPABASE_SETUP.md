# 🚀 Supabase Setup Guide - یارُوخیل قومی تڑون

## ✅ Step 1: Supabase Account بنائیں

1. **supabase.com** پر جائیں
2. **"Start your project"** پر کلک کریں
3. GitHub account سے Sign in کریں (یا email سے)
4. **مفت** - کوئی credit card نہیں چاہیے! ✅

---

## Step 2: نیا Project بنائیں

1. **"New Project"** پر کلک کریں
2. Organization بنائیں (پہلی بار)
3. Project details:
   - **Name:** YarukhelQoomi
   - **Database Password:** مضبوط password بنائیں (یاد رکھیں!)
   - **Region:** South Asia (Mumbai) - پاکستان کے قریب
   - **Pricing Plan:** **Free** منتخب کریں

4. **"Create new project"** کلک کریں
5. انتظار کریں (2-3 منٹ)

---

## Step 3: Database Table بنائیں

### 3.1 SQL Editor کھولیں

1. بائیں menu میں **"SQL Editor"** کلک کریں
2. **"New query"** کلک کریں

### 3.2 یہ SQL Code چلائیں:

```sql
-- Leaders table بنائیں
CREATE TABLE leaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security enable کریں
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" 
ON leaders FOR SELECT 
TO public 
USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated insert" 
ON leaders FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow authenticated update" 
ON leaders FOR UPDATE 
TO authenticated 
USING (true);

-- Authenticated users can delete
CREATE POLICY "Allow authenticated delete" 
ON leaders FOR DELETE 
TO authenticated 
USING (true);
```

3. **"Run"** بٹن دبائیں
4. Success message آئے گا! ✅

---

## Step 4: Storage Bucket بنائیں

### 4.1 Storage کھولیں

1. بائیں menu میں **"Storage"** کلک کریں
2. **"Create a new bucket"** کلک کریں

### 4.2 Bucket Settings:

- **Name:** `images` (exactly یہی نام)
- **Public bucket:** ✅ **YES** (checkbox check کریں - بہت ضروری!)
- **File size limit:** 5 MB
- **Allowed MIME types:** `image/*`

3. **"Create bucket"** کلک کریں

### 4.3 Folder بنائیں:

1. `images` bucket کھولیں
2. **"Create folder"** کلک کریں
3. **Name:** `leaders`
4. **"Create"** کلک کریں

### 4.4 🔥 Storage Policies بنائیں (بہت ضروری!):

Bucket `images` کو select کریں، پھر **"Policies"** tab پر کلک کریں۔

**Option 1: UI سے (آسان طریقہ):**

1. **"New Policy"** کلک کریں
2. **"For full customization"** منتخب کریں
3. **Policy name:** `Public Access for Images`
4. **Allowed operation:** تمام check کریں (SELECT, INSERT, UPDATE, DELETE)
5. **Target roles:** `public` منتخب کریں
6. **USING expression:** `true` لکھیں
7. **WITH CHECK expression:** `true` لکھیں
8. **"Review"** پھر **"Save policy"** کلک کریں

**Option 2: SQL سے (تیز طریقہ):**

SQL Editor میں یہ چلائیں:

```sql
-- Storage objects کے لیے public policy
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Authenticated users مکمل access
CREATE POLICY "Authenticated users full access"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
```

### 4.5 ✅ Verify کریں:

1. Storage → `images` bucket → Configuration tab
2. **"Public"** کے سامنے ✅ green چیک ہونا چاہیے
3. Policies tab میں کم از کم 1 policy show ہونی چاہیے

---

## Step 5: API Keys لیں

### 5.1 Settings کھولیں

1. بائیں menu میں **⚙️ Settings** کلک کریں
2. **"API"** section پر کلک کریں

### 5.2 کی ملیں گی:

1. **Project URL:** 
   - مثال: `https://xxxxx.supabase.co`
   - یہ copy کریں 📋

2. **anon / public key:**
   - `eyJhbG...` سے شروع ہوگی
   - یہ copy کریں 📋

---

## Step 6: Configuration Code لگائیں

### 6.1 فائل کھولیں:

`src/config/supabase.js`

### 6.2 اپنی values paste کریں:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';  // ← یہاں paste کریں
const supabaseAnonKey = 'eyJhbG...YOUR_KEY';              // ← یہاں paste کریں

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Save کریں!** 💾

---

## Step 7: پہلا Admin User بنائیں

### 7.1 Authentication enable کریں:

1. بائیں menu میں **"Authentication"** کلک کریں
2. **"Policies"** → پہلے سے enabled ہے ✅

### 7.2 User بنائیں:

1. **"Users"** tab کلک کریں
2. **"Add user"** → **"Create new user"**
3. **Email:** admin@yarukhelqoomi.com (یا اپنی)
4. **Password:** کم از کم 6 حروف
5. **Auto Confirm User:** ✅ Check کریں
6. **"Create user"** کلک کریں

---

## ✅ Step 8: Testing کریں

### 8.1 Local server چلائیں:

```bash
npm start
```

### 8.2 Admin login کریں:

1. Browser میں: **http://localhost:3000/admin/login**
2. اپنی email/password ڈالیں
3. Dashboard کھل جائے گا! 🎉

---

## 🎯 Admin Panel استعمال کریں

### Leader Add کرنا:

1. **"نیا اضافہ کریں"** بٹن
2. **نام** (مثال: صاحب خان عاجز)
3. **عہدہ** (مثال: صدر)
4. **تفصیل**
5. **تصویر** منتخب کریں
6. **"محفوظ کریں"**

### Edit/Delete:

- ✏️ Edit
- 🗑️ Delete

---

## 🚀 Vercel پر Deploy

```bash
git add .
git commit -m "Added Supabase admin panel"
git push origin main
```

Vercel automatically deploy کر دے گا!

---

## 📊 Free Plan Limits:

✅ **500 MB Database**  
✅ **1 GB File Storage**  
✅ **2 GB Bandwidth**  
✅ **50,000 Users**  
✅ **Unlimited API requests**

**آپ کے project کے لیے کافی ہے!** 🎉

---

## ⚠️ اگر 403 Error آئے (RLS Policy Violation):

### Fix 1: RLS مکمل طور پر بند کریں

SQL Editor میں یہ command چلائیں:

```sql
ALTER TABLE leaders DISABLE ROW LEVEL SECURITY;
```

### Fix 2: Storage Bucket Policies Check کریں

1. **Storage** → **images** bucket → **Policies** tab
2. اگر کوئی policy نہیں تو یہ SQL چلائیں:

```sql
-- Storage bucket policy (public read/write)
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'images');
```

### Fix 3: Authentication Token Check کریں

Browser Console (F12) کھول کر یہ چلائیں:

```javascript
supabase.auth.getUser().then(console.log)
```

اگر `user: null` آئے تو login دوبارہ کریں۔

### Fix 4: Direct Insert Test (بغیر Image کے)

Admin panel میں:
- صرف **Name**, **Position**, **Description** بھریں
- **Image upload نہ کریں** (اسے blank چھوڑ دیں)
- Save کریں

اگر یہ کام کرے تو issue **Storage** میں ہے، Database میں نہیں۔

---

## 🔒 Security Tips:

1. ✅ Strong password رکھیں
2. ✅ Admin email secure رکھیں
3. ✅ API keys public ہیں (safe ہے, Row Level Security سے محفوظ)
4. ✅ Database policies already set ہیں

---

## 📞 مدد چاہیے؟

اگر مسئلہ ہو:
1. Supabase Dashboard → Logs دیکھیں
2. Browser Console (F12) check کریں
3. SQL queries دوبارہ run کریں

---

## 🎉 مکمل!

اب آپ کی website **مکمل admin panel** کے ساتھ تیار ہے!

**Access URLs:**
- Website: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

**بہت مبارک ہو! 🎊**
