# 🖼️ Gallery Management System - مکمل رہنمائی

## ✅ مکمل ہو گیا!

Gallery Management کا مکمل نظام تیار ہے۔ اب آپ images اور videos دونوں کو admin panel سے handle کر سکتے ہیں۔

---

## 🎯 خصوصیات

### Images (تصاویر):
- ✅ تصویر URL دے سکتے ہیں
- ✅ تصویر فائل اپ لوڈ کر سکتے ہیں (جیسے Shura میں)
- ✅ عنوان، قسم، تفصیل شامل کریں
- ✅ ترتیب نمبر سے order control کریں
- ✅ فعال/غیر فعال کر سکتے ہیں

### Videos (ویڈیوز):
- ✅ YouTube video کا link دیں
- ✅ خودکار طور پر embed link بن جاتی ہے
- ✅ عنوان، قسم، تفصیل شامل کریں
- ✅ ترتیب نمبر سے order control کریں
- ✅ فعال/غیر فعال کر سکتے ہیں

---

## 🚀 استعمال کی رہنمائی

### STEP 1: Database Setup

پہلے یہ SQL چلائیں:
```sql
-- Supabase SQL Editor میں چلائیں
```

**File**: `CREATE_GALLERY_TABLE.sql`

یہ SQL چلانے سے:
- `gallery_items` table بن جائے گی
- Default items add ہو جائیں گی
- RLS policies set ہو جائیں گی

---

### STEP 2: Admin Panel سے Gallery Management

#### Login:
```
URL: http://localhost:3000/yqt-admin/login
Email: admin@yarukhelqoomi.com
Password: YQT@Admin2024
```

#### Dashboard پر جائیں:
Dashboard پر **"🖼️ گیلری"** بٹن نظر آئے گا

#### Gallery Management URL:
```
http://localhost:3000/yqt-admin/gallery
```

---

## 📸 تصویر کیسے شامل کریں

### قدم بہ قدم:

1. **Gallery Management** کھولیں
2. **"➕ نیا اضافہ کریں"** دبائیں
3. فارم بھریں:
   - **قسم**: 🖼️ تصویر (منتخب کریں)
   - **عنوان**: مثال: `قومی تقریب 2026`
   - **قسم**: مثال: `تقریبات`
   - **تفصیل**: اختیاری
   - **تصویر**:
     - **Option 1**: URL دیں: `https://example.com/image.jpg`
     - **Option 2**: فائل اپ لوڈ کریں (Browse سے)
   - **ترتیب نمبر**: 1, 2, 3... (چھوٹا نمبر پہلے)
4. **"محفوظ کریں"** دبائیں

---

## 🎥 ویڈیو کیسے شامل کریں

### YouTube Video URL کہاں سے لیں:

1. YouTube پر video کھولیں
2. Address bar سے URL copy کریں
3. مثال URLs (سب کام کریں گے):
   - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `https://youtu.be/dQw4w9WgXcQ`
   - `https://www.youtube.com/embed/dQw4w9WgXcQ`

### قدم بہ قدم:

1. **Gallery Management** کھولیں
2. **"➕ نیا اضافہ کریں"** دبائیں
3. فارم بھریں:
   - **قسم**: 🎥 ویڈیو (منتخب کریں)
   - **عنوان**: مثال: `قومی اجتماع کی ویڈیو`
   - **قسم**: مثال: `ویڈیوز`
   - **تفصیل**: اختیاری
   - **YouTube URL**: `https://www.youtube.com/watch?v=VIDEO_ID`
   - **ترتیب نمبر**: 1, 2, 3...
4. **Preview** دیکھیں (form میں خودکار دکھائی دے گا)
5. **"محفوظ کریں"** دبائیں

**نوٹ**: خودکار طور پر YouTube URL کو embed link میں convert ہو جائے گا۔

---

## 📊 Gallery Management Features

### Filter By Type:
- **تمام**: سب کچھ دیکھیں
- **🖼️ تصاویر**: صرف images
- **🎥 ویڈیوز**: صرف videos

### ہر Item پر Actions:
- **✏️ ترمیم**: Edit کریں
- **⊗/✓ فعال/غیر فعال**: چھپائیں/دکھائیں (بغیر حذف کیے)
- **🗑️ حذف**: مستقل حذف کریں

---

## 🌐 Public Gallery View

Front-end website پر Gallery section میں:
- ✅ صرف **فعال** items دکھائی دیں گی
- ✅ Display order کے مطابق ترتیب
- ✅ Category filter buttons (اگر categories ہیں)
- ✅ Images: Click پر lightbox میں کھلیں گی
- ✅ Videos: Click پر player میں کھلیں گی
- ✅ Mobile responsive

---

## 📁 Categories کی مثالیں

Common categories:
- `قدرتی` - Nature images
- `تقریبات` - Events
- `ثقافتی` - Cultural
- `تعلیمی` - Educational
- `کھیل` - Sports
- `مذہبی` - Religious
- `ویڈیوز` - Videos
- `تاریخی` - Historical

**اپنی مرضی کی category بنا سکتے ہیں!**

---

## 🔧 تکنیکی تفصیلات

### Database Table: `gallery_items`
```sql
- id (uuid)
- type (image/video)
- title (text)
- category (text)
- description (text)
- image_url (text) - for images
- video_url (text) - for videos
- display_order (integer)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### Files Created:
1. ✅ `CREATE_GALLERY_TABLE.sql` - Database schema
2. ✅ `src/pages/GalleryManagement.js` - Admin panel
3. ✅ `src/pages/GalleryManagement.css` - Styling
4. ✅ `src/components/Gallery.js` - Updated (database integration)
5. ✅ `src/components/Gallery.css` - Updated (video support)

### Files Updated:
1. ✅ `src/App.js` - Route added: `/yqt-admin/gallery`
2. ✅ `src/pages/AdminDashboard.js` - Gallery button added

---

## 🎨 Image Upload

### Supported Formats:
- JPG, JPEG
- PNG
- GIF
- WebP
- SVG

### Image Upload Location:
Supabase Storage → `images/gallery/` folder

### Image URL Format:
```
https://jcjcsalrigithndwqfkb.supabase.co/storage/v1/object/public/images/gallery/FILENAME.jpg
```

---

## 🎥 YouTube Video Embed

### URL Conversion:
```
Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Output: https://www.youtube.com/embed/dQw4w9WgXcQ
```

System خودکار طور پر convert کرتا ہے۔

### Supported URLs:
- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID` (already embed)

---

## ✅ چیک لسٹ

Admin کے لیے:
- [ ] SQL چلایا (`CREATE_GALLERY_TABLE.sql`)
- [ ] Admin login کیا
- [ ] Gallery Management access کیا
- [ ] تصویر شامل کی (URL یا upload)
- [ ] ویڈیو شامل کی (YouTube link)
- [ ] Display order test کیا
- [ ] Category filter test کیا
- [ ] Front-end Gallery دیکھا
- [ ] Item کو edit کیا
- [ ] Item کو غیر فعال کیا
- [ ] Item کو حذف کیا

---

## 📱 Mobile Support

Gallery Management اور Public Gallery دونوں mobile-optimized ہیں:
- ✅ Grid layout responsive
- ✅ Filters mobile-friendly
- ✅ Video player responsive
- ✅ Touch-friendly buttons

---

## ❓ عام سوالات (FAQ)

### Q1: کیا ایک ہی item میں image اور video دونوں ہو سکتے ہیں?
**جواب**: نہیں، ہر item صرف **ایک قسم** کی ہو سکتی ہے (image یا video)۔

### Q2: YouTube کے علاوہ دوسری video sites support ہیں?
**جواب**: فی الحال صرف **YouTube**۔ آئندہ Vimeo، Dailymotion add کیا جا سکتا ہے۔

### Q3: Image کی maximum size کیا ہے?
**جواب**: Supabase free tier: **50 MB** per file۔

### Q4: کتنی images/videos add کر سکتے ہیں?
**جواب**: **لامحدود**، database اور storage کی حد تک۔

### Q5: کیا videos automatically play ہوتی ہیں?
**جواب**: نہیں، user کو click کرنا پڑتا ہے۔

### Q6: Category ضروری ہے?
**جواب**: نہیں، category **اختیاری** ہے۔

---

## 🐛 مسائل اور حل

### Issue 1: تصویر اپ لوڈ نہیں ہو رہی
**Solution**:
1. Check Supabase Storage bucket: `images`
2. Check RLS policies on storage
3. Check file size (<50MB)

### Issue 2: ویڈیو نہیں چل رہی
**Solution**:
1. Check YouTube URL correct ہے
2. Check video public ہے (private نہیں)
3. Browser console check کریں

### Issue 3: Gallery میں items نہیں دکھ رہے
**Solution**:
1. Check items `is_active = true` ہیں
2. Check RLS policies
3. Browser console check کریں

---

## 🎉 کامیابی!

آپ کا Gallery Management System مکمل طور پر تیار ہے!

**Admin Panel**: http://localhost:3000/yqt-admin/gallery  
**Public Gallery**: http://localhost:3000/#gallery

---

## 📞 URLs خلاصہ

| Purpose | URL |
|---------|-----|
| Admin Login | `/yqt-admin/login` |
| Dashboard | `/yqt-admin/dashboard` |
| Gallery Management | `/yqt-admin/gallery` |
| Public Gallery | `/#gallery` |

---

**تاریخ**: 12 جولائی 2026  
**ورژن**: 1.0.0  
**Status**: ✅ مکمل

**اللہ کا شکر ہے!** 🤲
