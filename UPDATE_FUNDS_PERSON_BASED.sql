-- ================================================
-- 💰 Person-Based Funds System Update
-- Supabase SQL Editor میں یہ چلائیں
-- ================================================

-- ====================================
-- Table 1: Persons (لوگوں کی لسٹ)
-- ====================================

CREATE TABLE fund_persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for faster search
CREATE INDEX idx_fund_persons_name ON fund_persons(name);

-- ====================================
-- Table 2: Update fund_transactions
-- ====================================

-- Add person_id column
ALTER TABLE fund_transactions 
ADD COLUMN person_id UUID REFERENCES fund_persons(id) ON DELETE SET NULL;

-- Index for person-based queries
CREATE INDEX idx_fund_transactions_person ON fund_transactions(person_id);

-- ====================================
-- RLS Policies for fund_persons
-- ====================================

ALTER TABLE fund_persons ENABLE ROW LEVEL SECURITY;

-- Managers and viewers can read persons
CREATE POLICY "Allow managers and viewers to read persons"
ON fund_persons FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM fund_users WHERE role IN ('manager', 'viewer')
  )
);

-- Only managers can insert persons
CREATE POLICY "Allow only managers to insert persons"
ON fund_persons FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM fund_users WHERE role = 'manager'
  )
);

-- Only managers can update persons
CREATE POLICY "Allow only managers to update persons"
ON fund_persons FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM fund_users WHERE role = 'manager'
  )
);

-- Only managers can delete persons
CREATE POLICY "Allow only managers to delete persons"
ON fund_persons FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM fund_users WHERE role = 'manager'
  )
);

-- ====================================
-- Helper Views for Person-wise Reports
-- ====================================

-- Person-wise Income Summary
CREATE OR REPLACE VIEW person_income_summary AS
SELECT 
  p.id,
  p.name,
  p.phone,
  COUNT(t.id) as total_donations,
  COALESCE(SUM(t.amount), 0) as total_amount,
  MAX(t.date) as last_donation_date
FROM fund_persons p
LEFT JOIN fund_transactions t ON p.id = t.person_id AND t.type = 'income'
GROUP BY p.id, p.name, p.phone
ORDER BY total_amount DESC;

-- Top Donors
CREATE OR REPLACE VIEW top_donors AS
SELECT 
  p.name,
  COUNT(t.id) as donation_count,
  SUM(t.amount) as total_donated
FROM fund_persons p
INNER JOIN fund_transactions t ON p.id = t.person_id
WHERE t.type = 'income'
GROUP BY p.id, p.name
ORDER BY total_donated DESC
LIMIT 10;

-- ====================================
-- Sample Data (Testing کے لیے)
-- ====================================

-- Sample persons (اگر آپ test کرنا چاہیں)
-- INSERT INTO fund_persons (name, phone, address) VALUES
-- ('محمد احمد', '03001234567', 'لاہور'),
-- ('علی حسن', '03009876543', 'اسلام آباد'),
-- ('فاطمہ بی بی', '03007654321', 'کراچی');

-- ====================================
-- Verify Installation
-- ====================================

SELECT 'Person-based system ready!' as status;
SELECT COUNT(*) as person_count FROM fund_persons;

-- ✅ Done!
