# ⚡ Quick Reference - فوری حوالہ

## 🔑 لاگ ان معلومات

### Admin Panel (قائدین، شوریٰ، گیلری)
```
URL: http://localhost:3000/yqt-admin/login
Email: admin@yarukhelqoomi.com
Password: YQT@Admin2024
```

### Funds Manager (فنڈز مینیجر)
```
URL: http://localhost:3000/funds/login
Email: funds.manager@yarukhelqoomi.com
Password: YQT@Manager2024
```

### Funds Viewer (فنڈز ویور)
```
URL: http://localhost:3000/funds/login
Email: funds.viewer@yarukhelqoomi.com
Password: YQT@Viewer2024
```

---

## 🌐 تمام URLs

### Public (عوامی):
| صفحہ | URL |
|------|-----|
| ہوم پیج | `/` |
| شجرہ نسب | `/heritage` |
| مجلس شوریٰ | `/shura-members` |

### Admin (منتظم):
| صفحہ | URL |
|------|-----|
| لاگ ان | `/yqt-admin/login` |
| قائدین | `/yqt-admin/dashboard` |
| شوریٰ | `/yqt-admin/shura` |
| گیلری | `/yqt-admin/gallery` |

### Funds (فنڈز):
| صفحہ | URL |
|------|-----|
| لاگ ان | `/funds/login` |
| مینیجر | `/funds/dashboard` |
| ویور | `/funds/view` |
| افراد | `/funds/persons` |
| اقسام | `/funds/categories` |

---

## 📁 Important SQL Files

**ترتیب سے چلائیں**:
1. `CREATE_FUNDS_TABLES.sql`
2. `CREATE_SHURA_TABLE.sql`
3. `CREATE_DYNAMIC_CATEGORIES.sql`
4. `CREATE_GALLERY_TABLE.sql`
5. `IMPORT_PERSONS.sql` (optional)

---

## 🗂️ Database Tables

| Table | Purpose |
|-------|---------|
| `leaders` | ویب سائٹ قائدین |
| `shura_members` | مجلس شوریٰ کے اراکین |
| `fund_users` | فنڈز صارفین |
| `fund_persons` | عطیہ دہندگان |
| `fund_transactions` | آمدن/خرچہ |
| `fund_categories` | فنڈ کی اقسام |
| `gallery_items` | تصاویر/ویڈیوز |

---

## 🎨 تھیم کلرز

```css
Primary Green: #1a4d2e
Secondary Green: #2c5f2d
Gold Accent: #ffd700
Background: #f5f5f5
```

---

## 📱 کمانڈز

### Start Development:
```bash
npm start
```

### Build for Production:
```bash
npm run build
```

### Install Dependencies:
```bash
npm install
```

---

## 🔧 Supabase Info

```
Project: yqtpro
URL: https://jcjcsalrigithndwqfkb.supabase.co
Storage Bucket: images
Folders: leaders/, shura/, gallery/
```

---

## 📚 دستاویزات

| دستاویز | مقصد |
|---------|------|
| `PROJECT_COMPLETE_SUMMARY.md` | مکمل خلاصہ |
| `SUPABASE_SETUP.md` | Supabase سیٹ اپ |
| `FUNDS_SETUP_GUIDE.md` | فنڈز گائیڈ |
| `CATEGORIES_USER_GUIDE_URDU.md` | اقسام کی رہنمائی |
| `GALLERY_MANAGEMENT_GUIDE.md` | گیلری گائیڈ |

---

## ✅ تیزی سے چیک کریں

- [ ] Supabase project created
- [ ] SQL files run
- [ ] Admin user created
- [ ] Funds users created
- [ ] Storage bucket configured
- [ ] RLS policies enabled
- [ ] Environment variables set
- [ ] npm dependencies installed
- [ ] Development server running

---

## 🆘 مسائل حل

### Website نہیں چل رہی؟
```bash
npm install
npm start
```

### Database error؟
- Check SQL files چلائے ہیں
- Check RLS policies enabled ہیں

### Login نہیں ہو رہا؟
- Check credentials correct ہیں
- Check Supabase Auth enabled ہے

### Image upload fail؟
- Check Storage bucket exists
- Check RLS on storage bucket

---

## 📞 Support

**Documentation**: Check respective guide files  
**Date**: 12 جولائی 2026  
**Version**: 1.0.0

---

**اللہ کا شکر ہے!** 🤲
