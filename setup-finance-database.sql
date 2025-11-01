-- Complete Finance Database Setup
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- DROP EXISTING TABLES (Clean Start)
-- =============================================
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.budget_categories CASCADE;
DROP TABLE IF EXISTS public.expense_reports CASCADE;

-- =============================================
-- CREATE BUDGET CATEGORIES TABLE
-- =============================================
CREATE TABLE public.budget_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  budget_amount numeric DEFAULT 0,
  spent_amount numeric DEFAULT 0,
  category_type text DEFAULT 'expense' CHECK (category_type IN ('income', 'expense')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT budget_categories_pkey PRIMARY KEY (id),
  CONSTRAINT budget_categories_name_unique UNIQUE (name)
);

-- =============================================
-- CREATE TRANSACTIONS TABLE
-- =============================================
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'upi', 'cheque')),
  reference_number text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes text,
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

-- =============================================
-- CREATE EXPENSE REPORTS TABLE
-- =============================================
CREATE TABLE public.expense_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_income numeric DEFAULT 0,
  total_expenses numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'approved')),
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expense_reports_pkey PRIMARY KEY (id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_reports ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "allow_all_budget_categories" ON public.budget_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_expense_reports" ON public.expense_reports FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_budget_categories_type ON public.budget_categories(category_type);
CREATE INDEX idx_budget_categories_status ON public.budget_categories(status);

-- =============================================
-- CREATE UPDATE TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budget_categories_updated_at 
    BEFORE UPDATE ON public.budget_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON public.transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_reports_updated_at 
    BEFORE UPDATE ON public.expense_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample budget categories
INSERT INTO public.budget_categories (name, description, budget_amount, category_type) VALUES
('Temple Maintenance', 'Building and facility maintenance costs', 50000, 'expense'),
('Puja Supplies', 'Flowers, incense, offerings, and ritual items', 15000, 'expense'),
('Priest Salaries', 'Monthly compensation for temple priests', 30000, 'expense'),
('Utilities', 'Electricity, water, gas, and internet bills', 8000, 'expense'),
('Security', 'Security services and equipment', 5000, 'expense'),
('General Donations', 'Regular donations from devotees', 100000, 'income'),
('Special Events', 'Income from festivals and special ceremonies', 25000, 'income'),
('Prasadam Sales', 'Revenue from prasadam and religious items', 10000, 'income');

-- Sample transactions
INSERT INTO public.transactions (category_id, type, amount, description, date, payment_method, status) VALUES
-- Income transactions
((SELECT id FROM public.budget_categories WHERE name = 'General Donations'), 'income', 5000, 'Weekly donation collection', CURRENT_DATE - INTERVAL '1 day', 'cash', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'General Donations'), 'income', 3000, 'Online donation via UPI', CURRENT_DATE - INTERVAL '2 days', 'upi', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'Special Events'), 'income', 15000, 'Diwali festival donations', CURRENT_DATE - INTERVAL '3 days', 'cash', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'Prasadam Sales'), 'income', 2500, 'Prasadam sales - weekend', CURRENT_DATE - INTERVAL '4 days', 'cash', 'completed'),

-- Expense transactions
((SELECT id FROM public.budget_categories WHERE name = 'Puja Supplies'), 'expense', 2500, 'Fresh flowers and incense purchase', CURRENT_DATE - INTERVAL '1 day', 'cash', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'Utilities'), 'expense', 1200, 'Monthly electricity bill', CURRENT_DATE - INTERVAL '2 days', 'bank_transfer', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'Temple Maintenance'), 'expense', 3500, 'Roof repair work', CURRENT_DATE - INTERVAL '3 days', 'cheque', 'completed'),
((SELECT id FROM public.budget_categories WHERE name = 'Priest Salaries'), 'expense', 10000, 'Monthly salary - Head Priest', CURRENT_DATE - INTERVAL '5 days', 'bank_transfer', 'completed');

-- Sample expense report
INSERT INTO public.expense_reports (title, description, start_date, end_date, total_income, total_expenses, net_amount, status) VALUES
('Monthly Financial Report - Current Month', 'Complete financial overview for the current month', 
 DATE_TRUNC('month', CURRENT_DATE), 
 CURRENT_DATE, 
 25500, 
 17200, 
 8300, 
 'draft');

-- =============================================
-- UPDATE SPENT AMOUNTS IN BUDGET CATEGORIES
-- =============================================
UPDATE public.budget_categories 
SET spent_amount = (
    SELECT COALESCE(SUM(t.amount), 0)
    FROM public.transactions t 
    WHERE t.category_id = budget_categories.id 
    AND t.type = 'expense'
    AND t.status = 'completed'
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
SELECT 'Finance database setup completed successfully!' as message;

SELECT 'Budget Categories:' as info, COUNT(*) as count FROM public.budget_categories;
SELECT 'Transactions:' as info, COUNT(*) as count FROM public.transactions;
SELECT 'Expense Reports:' as info, COUNT(*) as count FROM public.expense_reports;

-- Show sample data
SELECT 
    'Sample Budget Categories' as section,
    name,
    category_type,
    budget_amount,
    spent_amount
FROM public.budget_categories 
ORDER BY category_type, name;

SELECT 
    'Sample Transactions' as section,
    t.type,
    t.amount,
    t.description,
    bc.name as category_name,
    t.date
FROM public.transactions t
LEFT JOIN public.budget_categories bc ON t.category_id = bc.id
ORDER BY t.date DESC
LIMIT 5;