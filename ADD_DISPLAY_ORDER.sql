-- ================================================
-- Display Order Column Add کریں
-- Supabase SQL Editor میں یہ چلائیں
-- ================================================

-- Step 1: leaders table میں display_order column add کریں
ALTER TABLE leaders 
ADD COLUMN display_order INTEGER DEFAULT 999;

-- Step 2: موجودہ leaders کو order assign کریں
-- آپ کو manually update کرنا ہوگا اپنے leaders کے IDs کے ساتھ

-- Example (اپنے actual IDs استعمال کریں):
-- UPDATE leaders SET display_order = 1 WHERE name = 'صاحب خان عاجز';
-- UPDATE leaders SET display_order = 2 WHERE name = 'شاہد حسین';
-- UPDATE leaders SET display_order = 3 WHERE name = 'پیرزادہ حسن زئی';
-- UPDATE leaders SET display_order = 4 WHERE name = 'مصطفیٰ کمال یوسف زئی';
-- UPDATE leaders SET display_order = 5 WHERE name = 'منیر یوسف زئی';
-- UPDATE leaders SET display_order = 6 WHERE name = 'شمروز خان';

-- یا names سے directly update کریں:
UPDATE leaders SET display_order = 1 WHERE name LIKE '%صاحب خان%';
UPDATE leaders SET display_order = 2 WHERE name LIKE '%شاہد حسین%';
UPDATE leaders SET display_order = 3 WHERE name LIKE '%حسن زئی%';
UPDATE leaders SET display_order = 4 WHERE name LIKE '%مصطفیٰ کمال%';
UPDATE leaders SET display_order = 5 WHERE name LIKE '%منیر%';
UPDATE leaders SET display_order = 6 WHERE name LIKE '%شمروز%';

-- Verify کریں
SELECT name, position, display_order 
FROM leaders 
ORDER BY display_order;
