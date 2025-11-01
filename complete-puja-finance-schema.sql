-- Complete Database Schema for Puja and Finance Management
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- PUJA MANAGEMENT TABLES
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.puja_series CASCADE;
DROP TABLE IF EXISTS public.puja_instances CASCADE;

-- Create puja_series table (simplified)
CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text DEFAULT 'puja',
  location text,
  priest text,
  start_time text,
  duration_minutes integer DEFAULT 60,
  recurrence_type text DEFAULT 'none',
  start_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_series_pkey PRIMARY KEY (id)
);

-- Create puja_instances table for individual puja occurrences
CREATE TABLE public.puja_instances (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  series_id uuid REFERENCES public.puja_series(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time text NOT NULL,
  status text DEFAULT 'scheduled',
  priest text,
  location text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_instances_pkey PRIMARY KEY (id)
);

-- =============================================
-- FINANCE MANAGEMENT TABLES
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.budget_categories CASCADE;
DROP TABLE IF EXISTS public.expense_reports CASCADE;

-- Create budget_categories table
CREATE TABLE public.budget_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  budget_amount numeric DEFAULT 0,
  spent_amount numeric DEFAULT 0,
  category_type text DEFAULT 'expense',
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT budget_categories_pkey PRIMARY KEY (id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  type text NOT NULL, -- 'income' or 'expense'
  amount numeric NOT NULL,
  description text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  payment_method text,
  reference_number text,
  status text DEFAULT 'completed',
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

-- Create expense_reports table
CREATE TABLE public.expense_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_income numeric DEFAULT 0,
  total_expenses numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  status text DEFAULT 'draft',
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expense_reports_pkey PRIMARY KEY (id)
);

-- =============================================
-- ENABLE RLS AND CREATE POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puja_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_reports ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "allow_all_puja_series" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_puja_instances" ON public.puja_instances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_budget_categories" ON public.budget_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_expense_reports" ON public.expense_reports FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_puja_series_status ON public.puja_series(status);
CREATE INDEX idx_puja_series_type ON public.puja_series(type);
CREATE INDEX idx_puja_instances_series_id ON public.puja_instances(series_id);
CREATE INDEX idx_puja_instances_date ON public.puja_instances(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample puja series
INSERT INTO public.puja_series (name, description, type, location, priest, start_time, duration_minutes, recurrence_type) VALUES
('Morning Aarti', 'Daily morning prayers', 'aarti', 'Main Temple', 'Pandit Sharma', '06:00', 45, 'daily'),
('Evening Aarti', 'Daily evening prayers', 'aarti', 'Main Temple', 'Pandit Kumar', '18:00', 30, 'daily'),
('Hanuman Chalisa', 'Weekly Hanuman prayers', 'puja', 'Prayer Hall', 'Pandit Gupta', '19:00', 60, 'weekly'),
('Satyanarayan Puja', 'Monthly special puja', 'puja', 'Main Temple', 'Pandit Sharma', '10:00', 120, 'monthly');

-- Sample budget categories
INSERT INTO public.budget_categories (name, description, budget_amount, category_type) VALUES
('Temple Maintenance', 'Building and facility maintenance', 50000, 'expense'),
('Puja Supplies', 'Flowers, incense, offerings', 15000, 'expense'),
('Priest Salaries', 'Monthly priest compensation', 30000, 'expense'),
('Utilities', 'Electricity, water, gas', 8000, 'expense'),
('Donations', 'General donations received', 100000, 'income'),
('Event Income', 'Special event collections', 25000, 'income');

-- Sample transactions
INSERT INTO public.transactions (category_id, type, amount, description, date, payment_method) VALUES
((SELECT id FROM public.budget_categories WHERE name = 'Donations'), 'income', 5000, 'Weekly donation collection', CURRENT_DATE - INTERVAL '1 day', 'cash'),
((SELECT id FROM public.budget_categories WHERE name = 'Puja Supplies'), 'expense', 2500, 'Flowers and incense purchase', CURRENT_DATE - INTERVAL '2 days', 'card'),
((SELECT id FROM public.budget_categories WHERE name = 'Utilities'), 'expense', 1200, 'Monthly electricity bill', CURRENT_DATE - INTERVAL '3 days', 'bank_transfer'),
((SELECT id FROM public.budget_categories WHERE name = 'Donations'), 'income', 3000, 'Special ceremony donation', CURRENT_DATE - INTERVAL '4 days', 'cash');

-- =============================================
-- CREATE UPDATE TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_puja_series_updated_at BEFORE UPDATE ON public.puja_series FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_puja_instances_updated_at BEFORE UPDATE ON public.puja_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_reports_updated_at BEFORE UPDATE ON public.expense_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION
-- =============================================

SELECT 'Database schema created successfully!' as message;
SELECT 'Puja Series: ' || COUNT(*) as puja_count FROM public.puja_series;
SELECT 'Budget Categories: ' || COUNT(*) as budget_count FROM public.budget_categories;
SELECT 'Transactions: ' || COUNT(*) as transaction_count FROM public.transactions;