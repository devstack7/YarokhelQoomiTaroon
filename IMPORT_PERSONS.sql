-- ================================================
-- 👥 Import Persons into fund_persons table
-- Supabase SQL Editor میں یہ چلائیں
-- ================================================

INSERT INTO fund_persons (name, phone, address, notes) VALUES
('مسلم رزاق', NULL, NULL, NULL),
('شاہ حسین', NULL, NULL, NULL),
('پیر زادہ', NULL, NULL, NULL),
('علی دوست خان', NULL, NULL, NULL),
('شمیل اختر', NULL, NULL, NULL),
('تیمروز خان', NULL, NULL, NULL),
('شیر باز', NULL, NULL, NULL),
('قل روز خان', NULL, NULL, NULL),
('فقیر خان', NULL, NULL, NULL),
('خواجہ محمد', NULL, NULL, NULL),
('امیر محمد', NULL, NULL, NULL),
('شنیر الرحمن', NULL, NULL, NULL),
('حبیب الرحمن', NULL, NULL, NULL),
('عبدالباسط', NULL, NULL, NULL),
('قیمت ستار', NULL, NULL, NULL),
('صاحبزادہ خان ہاکو', NULL, NULL, NULL),
('احمد ریحان', NULL, NULL, NULL),
('بخت ملیر', NULL, NULL, NULL),
('بخت جمال', NULL, NULL, NULL),
('خصیب خان', NULL, NULL, NULL),
('ضرار احمد', NULL, NULL, NULL),
('عمان خان', NULL, NULL, NULL),
('رئیس خان', NULL, NULL, NULL),
('عثمان عزیز', NULL, NULL, NULL),
('عطیر الرحمن', NULL, NULL, NULL),
('جیواجہ خان', NULL, NULL, NULL),
('احمد خان', NULL, NULL, NULL),
('سلیم غفار', NULL, NULL, NULL),
('توقیر افغانی', NULL, NULL, NULL),
('سلیم غفار', NULL, NULL, NULL),
('یونس خان', NULL, NULL, NULL),
('صاحبزادہ خان صاحب', NULL, NULL, NULL),
('والخلیل الرحمن', NULL, NULL, NULL),
('شکور خان', NULL, NULL, NULL),
('رومیس خان', NULL, NULL, NULL),
('عبدالرحمن', NULL, NULL, NULL),
('عمران منور', NULL, NULL, NULL),
('انور خان لالا', NULL, NULL, NULL),
('مولا پلن', NULL, NULL, NULL),
('حبیب ستار', NULL, NULL, NULL),
('مولا ابراہیم', NULL, NULL, NULL),
('سواٹ خان', NULL, NULL, NULL),
('یواب خان', NULL, NULL, NULL),
('زر محمد خان', NULL, NULL, NULL),
('مولا احمد', NULL, NULL, NULL),
('عبدالفتوی', NULL, NULL, NULL);

-- Verify
SELECT COUNT(*) as total_persons, 
       STRING_AGG(name, ', ') as first_10_names
FROM (
  SELECT name FROM fund_persons ORDER BY name LIMIT 10
) subquery;

-- ✅ Done! 46 persons imported
