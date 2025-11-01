-- Create Dedicated Expenses Table
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- DROP EXISTING EXPENSES TABLE (if exists)
-- =============================================
DROP TABLE IF EXISTS public.expenses CASCADE;

-- =============================================
-- CREATE EXPENSES TABLE
-- =============================================
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vendor_name text,
  vendor_contact text,
  vendor_address text,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'INR',
  category text DEFAULT 'general',
  subcategory text,
  expense_type text DEFAULT 'operational' CHECK (expense_type IN ('operational', 'maintenance', 'utilities', 'salaries', 'materials', 'events', 'donations', 'other')),
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'card', 'cheque', 'online')),
  payment_reference text, -- Transaction ID, cheque number, etc.
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  expense_date date DEFAULT CURRENT_DATE,
  due_date date,
  receipt_number text,
  receipt_attached boolean DEFAULT false,
  receipt_url text,
  is_recurring boolean DEFAULT false,
  recurring_frequency text CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  approval_status text DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by text,
  approved_at timestamp with time zone,
  budget_category_id uuid REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  project_id uuid, -- For future project tracking
  notes text,
  tags text[], -- Array of tags for better categorization
  created_by text,
  verified_by text,
  verification_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id)
);

-- =============================================
-- CREATE EXPENSE ATTACHMENTS TABLE
-- =============================================
CREATE TABLE public.expense_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size integer,
  uploaded_by text,
  uploaded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expense_attachments_pkey PRIMARY KEY (id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_attachments ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "allow_all_expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_expense_attachments" ON public.expense_attachments FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_expenses_vendor_name ON public.expenses(vendor_name);
CREATE INDEX idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_expense_type ON public.expenses(expense_type);
CREATE INDEX idx_expenses_payment_method ON public.expenses(payment_method);
CREATE INDEX idx_expenses_payment_status ON public.expenses(payment_status);
CREATE INDEX idx_expenses_approval_status ON public.expenses(approval_status);
CREATE INDEX idx_expenses_amount ON public.expenses(amount);
CREATE INDEX idx_expenses_created_at ON public.expenses(created_at);
CREATE INDEX idx_expenses_budget_category_id ON public.expenses(budget_category_id);
CREATE INDEX idx_expense_attachments_expense_id ON public.expense_attachments(expense_id);

-- =============================================
-- CREATE UPDATE TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON public.expenses 
    FOR EACH ROW EXECUTE FUNCTION update_expenses_updated_at();

-- =============================================
-- CREATE RECEIPT NUMBER GENERATION FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION generate_expense_receipt_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
    receipt_num TEXT;
BEGIN
    -- Get current year suffix (last 2 digits)
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'EXP' || year_suffix || '(\d+)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.expenses
    WHERE receipt_number LIKE 'EXP' || year_suffix || '%';
    
    -- Format: EXP25001, EXP25002, etc.
    receipt_num := 'EXP' || year_suffix || LPAD(sequence_num::TEXT, 3, '0');
    
    RETURN receipt_num;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE TRIGGER FOR AUTO RECEIPT NUMBER
-- =============================================
CREATE OR REPLACE FUNCTION auto_generate_expense_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.receipt_number IS NULL THEN
        NEW.receipt_number := generate_expense_receipt_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_expense_receipt_number_trigger
    BEFORE INSERT ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION auto_generate_expense_receipt_number();

-- =============================================
-- INSERT SAMPLE EXPENSES
-- =============================================
INSERT INTO public.expenses (
    vendor_name, vendor_contact, description, amount, expense_type, payment_method, 
    expense_date, notes, created_by
) VALUES
('ABC Electrical Services', '+91-9876543210', 'Monthly electricity bill payment', 15000, 'utilities', 'bank_transfer', '2025-11-01', 'November electricity bill', 'admin'),
('Temple Maintenance Co.', '+91-9876543211', 'Temple cleaning and maintenance', 8000, 'maintenance', 'cash', '2025-10-31', 'Weekly temple maintenance', 'admin'),
('Local Grocery Store', '+91-9876543212', 'Prasadam ingredients and supplies', 5000, 'materials', 'upi', '2025-10-30', 'Monthly grocery for prasadam', 'admin'),
('Sound System Rental', '+91-9876543213', 'Audio equipment for festival', 12000, 'events', 'card', '2025-10-29', 'Diwali celebration sound system', 'admin'),
('Security Services Ltd.', '+91-9876543214', 'Monthly security guard salary', 25000, 'salaries', 'bank_transfer', '2025-10-28', 'October salary for security staff', 'admin'),
('Flower Vendor', '+91-9876543215', 'Daily flower decoration', 3000, 'materials', 'cash', '2025-10-27', 'Fresh flowers for daily puja', 'admin'),
('Water Supply Department', '+91-9876543216', 'Monthly water bill', 2500, 'utilities', 'online', '2025-10-26', 'October water charges', 'admin'),
('Construction Materials', '+91-9876543217', 'Cement and bricks for renovation', 45000, 'maintenance', 'cheque', '2025-10-25', 'Temple renovation materials', 'admin');

-- =============================================
-- CREATE VIEWS FOR REPORTING
-- =============================================

-- Daily expenses summary
CREATE OR REPLACE VIEW daily_expenses_summary AS
SELECT 
    expense_date,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    COUNT(DISTINCT vendor_name) as unique_vendors
FROM public.expenses 
WHERE payment_status = 'completed'
GROUP BY expense_date
ORDER BY expense_date DESC;

-- Monthly expenses summary
CREATE OR REPLACE VIEW monthly_expenses_summary AS
SELECT 
    DATE_TRUNC('month', expense_date) as month,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    COUNT(DISTINCT vendor_name) as unique_vendors
FROM public.expenses 
WHERE payment_status = 'completed'
GROUP BY DATE_TRUNC('month', expense_date)
ORDER BY month DESC;

-- Expense by category
CREATE OR REPLACE VIEW expenses_by_category AS
SELECT 
    expense_type,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM public.expenses 
WHERE payment_status = 'completed'
GROUP BY expense_type
ORDER BY total_amount DESC;

-- Top vendors
CREATE OR REPLACE VIEW top_vendors AS
SELECT 
    vendor_name,
    vendor_contact,
    COUNT(*) as expense_count,
    SUM(amount) as total_paid,
    MAX(expense_date) as last_expense_date
FROM public.expenses 
WHERE payment_status = 'completed' AND vendor_name IS NOT NULL
GROUP BY vendor_name, vendor_contact
ORDER BY total_paid DESC;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
SELECT 'Expenses database setup completed successfully!' as message;

SELECT 'Expenses:' as info, COUNT(*) as count FROM public.expenses;
SELECT 'Expense Attachments:' as info, COUNT(*) as count FROM public.expense_attachments;

-- Show sample data
SELECT 
    'Sample Expenses' as section,
    vendor_name,
    amount,
    expense_type,
    payment_method,
    expense_date,
    receipt_number
FROM public.expenses 
ORDER BY expense_date DESC, created_at DESC
LIMIT 5;

-- Financial summary
SELECT 
    'Expense Summary' as section,
    COUNT(*) as total_expenses,
    SUM(amount) as total_amount,
    AVG(amount) as average_expense,
    MIN(amount) as smallest_expense,
    MAX(amount) as largest_expense
FROM public.expenses 
WHERE payment_status = 'completed';

-- Category breakdown
SELECT 
    'Category Breakdown' as section,
    expense_type,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    ROUND(AVG(amount), 2) as avg_amount
FROM public.expenses 
WHERE payment_status = 'completed'
GROUP BY expense_type
ORDER BY total_amount DESC;