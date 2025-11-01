-- Create Dedicated Donations Table in Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- DROP EXISTING DONATIONS TABLE (if exists)
-- =============================================
DROP TABLE IF EXISTS public.donations CASCADE;

-- =============================================
-- CREATE DONATIONS TABLE
-- =============================================
CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donor_name text,
  donor_email text,
  donor_phone text,
  donor_address text,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'INR',
  donation_type text DEFAULT 'general' CHECK (donation_type IN ('general', 'temple_construction', 'festival', 'puja_sponsorship', 'annadanam', 'education', 'medical', 'other')),
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'card', 'cheque', 'online')),
  payment_reference text, -- Transaction ID, cheque number, etc.
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  donation_date date DEFAULT CURRENT_DATE,
  receipt_number text UNIQUE,
  is_anonymous boolean DEFAULT false,
  is_recurring boolean DEFAULT false,
  recurring_frequency text CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly')),
  purpose text, -- Specific purpose or dedication
  notes text,
  tax_exemption_claimed boolean DEFAULT false,
  tax_exemption_amount numeric DEFAULT 0,
  created_by text, -- User who recorded the donation
  verified_by text, -- User who verified the donation
  verification_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT donations_pkey PRIMARY KEY (id)
);

-- =============================================
-- CREATE DONATION CATEGORIES TABLE
-- =============================================
CREATE TABLE public.donation_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  target_amount numeric DEFAULT 0,
  collected_amount numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT donation_categories_pkey PRIMARY KEY (id)
);

-- =============================================
-- CREATE DONATION RECEIPTS TABLE
-- =============================================
CREATE TABLE public.donation_receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  receipt_number text NOT NULL UNIQUE,
  receipt_date date DEFAULT CURRENT_DATE,
  issued_to text NOT NULL,
  issued_by text,
  receipt_template text DEFAULT 'standard',
  is_digital boolean DEFAULT true,
  file_path text, -- Path to PDF receipt file
  email_sent boolean DEFAULT false,
  email_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT donation_receipts_pkey PRIMARY KEY (id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_receipts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "allow_all_donations" ON public.donations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_donation_categories" ON public.donation_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_donation_receipts" ON public.donation_receipts FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_donations_donor_email ON public.donations(donor_email);
CREATE INDEX idx_donations_donation_date ON public.donations(donation_date);
CREATE INDEX idx_donations_donation_type ON public.donations(donation_type);
CREATE INDEX idx_donations_payment_method ON public.donations(payment_method);
CREATE INDEX idx_donations_payment_status ON public.donations(payment_status);
CREATE INDEX idx_donations_amount ON public.donations(amount);
CREATE INDEX idx_donations_created_at ON public.donations(created_at);
CREATE INDEX idx_donation_categories_active ON public.donation_categories(is_active);
CREATE INDEX idx_donation_receipts_donation_id ON public.donation_receipts(donation_id);

-- =============================================
-- CREATE UPDATE TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_donations_updated_at 
    BEFORE UPDATE ON public.donations 
    FOR EACH ROW EXECUTE FUNCTION update_donations_updated_at();

CREATE TRIGGER update_donation_categories_updated_at 
    BEFORE UPDATE ON public.donation_categories 
    FOR EACH ROW EXECUTE FUNCTION update_donations_updated_at();

-- =============================================
-- CREATE RECEIPT NUMBER GENERATION FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    sequence_num INTEGER;
    receipt_num TEXT;
BEGIN
    -- Get current year suffix (last 2 digits)
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'RCP' || year_suffix || '(\d+)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.donations
    WHERE receipt_number LIKE 'RCP' || year_suffix || '%';
    
    -- Format: RCP25001, RCP25002, etc.
    receipt_num := 'RCP' || year_suffix || LPAD(sequence_num::TEXT, 3, '0');
    
    RETURN receipt_num;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE TRIGGER FOR AUTO RECEIPT NUMBER
-- =============================================
CREATE OR REPLACE FUNCTION auto_generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.receipt_number IS NULL THEN
        NEW.receipt_number := generate_receipt_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_receipt_number_trigger
    BEFORE INSERT ON public.donations
    FOR EACH ROW EXECUTE FUNCTION auto_generate_receipt_number();

-- =============================================
-- INSERT SAMPLE DONATION CATEGORIES
-- =============================================
INSERT INTO public.donation_categories (name, description, target_amount, display_order) VALUES
('General Donations', 'General temple donations for daily operations', 500000, 1),
('Temple Construction', 'Funds for temple construction and renovation', 2000000, 2),
('Festival Celebrations', 'Donations for festival celebrations and events', 300000, 3),
('Puja Sponsorship', 'Sponsorship for specific pujas and ceremonies', 100000, 4),
('Annadanam', 'Free food distribution to devotees', 200000, 5),
('Education Fund', 'Support for educational activities and scholarships', 150000, 6),
('Medical Aid', 'Medical assistance for needy devotees', 100000, 7),
('Maintenance Fund', 'Temple maintenance and upkeep', 250000, 8);

-- =============================================
-- INSERT SAMPLE DONATIONS
-- =============================================
INSERT INTO public.donations (
    donor_name, donor_email, donor_phone, amount, donation_type, payment_method, 
    donation_date, purpose, notes, created_by
) VALUES
('Rajesh Sharma', 'rajesh.sharma@email.com', '+91-9876543210', 5000, 'general', 'upi', '2025-11-01', 'Monthly donation', 'Regular monthly contribution', 'admin'),
('Priya Gupta', 'priya.gupta@email.com', '+91-9876543211', 10000, 'temple_construction', 'bank_transfer', '2025-10-31', 'Temple renovation', 'For new prayer hall construction', 'admin'),
('Anonymous Devotee', null, null, 2500, 'festival', 'cash', '2025-10-30', 'Diwali celebration', 'Anonymous donation for Diwali', 'admin'),
('Suresh Kumar', 'suresh.kumar@email.com', '+91-9876543212', 7500, 'puja_sponsorship', 'cheque', '2025-10-29', 'Satyanarayan Puja', 'Monthly puja sponsorship', 'admin'),
('Meera Devi', 'meera.devi@email.com', '+91-9876543213', 3000, 'annadanam', 'upi', '2025-10-28', 'Free food distribution', 'Weekly annadanam sponsorship', 'admin'),
('Vikram Singh', 'vikram.singh@email.com', '+91-9876543214', 15000, 'education', 'bank_transfer', '2025-10-27', 'Student scholarship', 'For underprivileged students', 'admin'),
('Lakshmi Narayan', 'lakshmi.narayan@email.com', '+91-9876543215', 4000, 'medical', 'card', '2025-10-26', 'Medical aid fund', 'For medical emergency fund', 'admin'),
('Ganesh Patel', 'ganesh.patel@email.com', '+91-9876543216', 8000, 'general', 'online', '2025-10-25', 'General donation', 'Online donation via website', 'admin');

-- =============================================
-- UPDATE CATEGORY COLLECTED AMOUNTS
-- =============================================
UPDATE public.donation_categories 
SET collected_amount = (
    SELECT COALESCE(SUM(d.amount), 0)
    FROM public.donations d 
    WHERE d.donation_type = CASE 
        WHEN donation_categories.name = 'General Donations' THEN 'general'
        WHEN donation_categories.name = 'Temple Construction' THEN 'temple_construction'
        WHEN donation_categories.name = 'Festival Celebrations' THEN 'festival'
        WHEN donation_categories.name = 'Puja Sponsorship' THEN 'puja_sponsorship'
        WHEN donation_categories.name = 'Annadanam' THEN 'annadanam'
        WHEN donation_categories.name = 'Education Fund' THEN 'education'
        WHEN donation_categories.name = 'Medical Aid' THEN 'medical'
        ELSE 'other'
    END
    AND d.payment_status = 'completed'
);

-- =============================================
-- CREATE VIEWS FOR REPORTING
-- =============================================

-- Daily donations summary
CREATE OR REPLACE VIEW daily_donations_summary AS
SELECT 
    donation_date,
    COUNT(*) as donation_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    COUNT(DISTINCT donor_email) as unique_donors
FROM public.donations 
WHERE payment_status = 'completed'
GROUP BY donation_date
ORDER BY donation_date DESC;

-- Monthly donations summary
CREATE OR REPLACE VIEW monthly_donations_summary AS
SELECT 
    DATE_TRUNC('month', donation_date) as month,
    COUNT(*) as donation_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    COUNT(DISTINCT donor_email) as unique_donors
FROM public.donations 
WHERE payment_status = 'completed'
GROUP BY DATE_TRUNC('month', donation_date)
ORDER BY month DESC;

-- Top donors view
CREATE OR REPLACE VIEW top_donors AS
SELECT 
    donor_name,
    donor_email,
    COUNT(*) as donation_count,
    SUM(amount) as total_donated,
    MAX(donation_date) as last_donation_date
FROM public.donations 
WHERE payment_status = 'completed' AND NOT is_anonymous
GROUP BY donor_name, donor_email
ORDER BY total_donated DESC;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
SELECT 'Donations database setup completed successfully!' as message;

SELECT 'Donations:' as info, COUNT(*) as count FROM public.donations;
SELECT 'Donation Categories:' as info, COUNT(*) as count FROM public.donation_categories;

-- Show sample data
SELECT 
    'Sample Donations' as section,
    donor_name,
    amount,
    donation_type,
    payment_method,
    donation_date,
    receipt_number
FROM public.donations 
ORDER BY donation_date DESC, created_at DESC
LIMIT 5;

SELECT 
    'Donation Categories' as section,
    name,
    target_amount,
    collected_amount,
    ROUND((collected_amount::numeric / NULLIF(target_amount, 0)) * 100, 2) as percentage_collected
FROM public.donation_categories 
WHERE is_active = true
ORDER BY display_order;

-- Financial summary
SELECT 
    'Financial Summary' as section,
    COUNT(*) as total_donations,
    SUM(amount) as total_amount,
    AVG(amount) as average_donation,
    MIN(amount) as smallest_donation,
    MAX(amount) as largest_donation
FROM public.donations 
WHERE payment_status = 'completed';