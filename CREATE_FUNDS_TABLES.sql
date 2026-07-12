-- ================================================
-- 💰 Funds Management System - Database Tables
-- Supabase SQL Editor میں یہ چلائیں
-- ================================================

-- ====================================
-- Table 1: Fund Transactions (آمدن اور خرچہ)
-- ====================================

CREATE TABLE fund_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  purpose TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for faster queries
CREATE INDEX idx_fund_transactions_type ON fund_transactions(type);
CREATE INDEX idx_fund_transactions_date ON fund_transactions(date);

-- ====================================
-- Table 2: Fund Users (Funds Manager & Viewers)
-- ====================================

CREATE TABLE fund_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default Funds Manager (آپ بعد میں password set کریں گے Supabase Auth سے)
INSERT INTO fund_users (email, role) VALUES ('funds.manager@yarukhelqoomi.com', 'manager');
INSERT INTO fund_users (email, role) VALUES ('funds.viewer@yarukhelqoomi.com', 'viewer');

-- ====================================
-- Row Level Security (RLS) Policies
-- ====================================

-- Enable RLS
ALTER TABLE fund_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_users ENABLE ROW LEVEL SECURITY;

-- Fund Transactions Policies
-- Managers can do everything
CREATE POLICY "Managers can view all transactions"
ON fund_transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fund_users
    WHERE fund_users.email = auth.jwt() ->> 'email'
    AND fund_users.role IN ('manager', 'viewer')
  )
);

CREATE POLICY "Managers can insert transactions"
ON fund_transactions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM fund_users
    WHERE fund_users.email = auth.jwt() ->> 'email'
    AND fund_users.role = 'manager'
  )
);

CREATE POLICY "Managers can update transactions"
ON fund_transactions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fund_users
    WHERE fund_users.email = auth.jwt() ->> 'email'
    AND fund_users.role = 'manager'
  )
);

CREATE POLICY "Managers can delete transactions"
ON fund_transactions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fund_users
    WHERE fund_users.email = auth.jwt() ->> 'email'
    AND fund_users.role = 'manager'
  )
);

-- Fund Users Policies (only managers can view users)
CREATE POLICY "Managers can view fund users"
ON fund_users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM fund_users fu
    WHERE fu.email = auth.jwt() ->> 'email'
    AND fu.role = 'manager'
  )
);

-- ====================================
-- Helper Views for Reports
-- ====================================

-- Total Income View
CREATE OR REPLACE VIEW fund_income_summary AS
SELECT 
  COUNT(*) as total_count,
  COALESCE(SUM(amount), 0) as total_amount
FROM fund_transactions
WHERE type = 'income';

-- Total Expense View
CREATE OR REPLACE VIEW fund_expense_summary AS
SELECT 
  COUNT(*) as total_count,
  COALESCE(SUM(amount), 0) as total_amount
FROM fund_transactions
WHERE type = 'expense';

-- Balance View
CREATE OR REPLACE VIEW fund_balance AS
SELECT 
  COALESCE(
    (SELECT SUM(amount) FROM fund_transactions WHERE type = 'income'), 
    0
  ) - COALESCE(
    (SELECT SUM(amount) FROM fund_transactions WHERE type = 'expense'), 
    0
  ) as current_balance;

-- ====================================
-- Verify Installation
-- ====================================

SELECT 'Tables created successfully!' as status;
SELECT * FROM fund_users;

-- ✅ Done! اب Supabase Authentication میں users بنائیں:
-- 1. funds.manager@yarukhelqoomi.com (Manager - Add/Edit/Delete)
-- 2. funds.viewer@yarukhelqoomi.com (Viewer - Read Only)
