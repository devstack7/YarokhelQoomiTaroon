-- ==========================================
-- Insert Default Categories
-- Run AFTER CREATE_CATEGORIES_SIMPLE.sql
-- ==========================================

-- Insert 2 default categories
-- Copy paste emojis carefully: 📚 🎉

INSERT INTO fund_categories (name, name_urdu, icon, color, display_order) VALUES
('genealogy_group', 'شجرنسب اور گروپ', '📚', '#4caf50', 1);

INSERT INTO fund_categories (name, name_urdu, icon, color, display_order) VALUES
('event', 'ایونٹ', '🎉', '#9c27b0', 2);

-- Verify insertion
SELECT * FROM fund_categories ORDER BY display_order;
