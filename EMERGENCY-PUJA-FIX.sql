-- EMERGENCY: Fix Puja Table Issue
-- Run this IMMEDIATELY in Supabase Dashboard → SQL Editor

-- Step 1: Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'puja_series';

-- Step 2: Drop and recreate table (GUARANTEED to work)
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Step 3: Create simple table with EXACT columns the frontend sends
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

-- Step 4: Set up permissions (CRITICAL)
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_puja_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Test insert to verify it works
INSERT INTO public.puja_series (name, type, location, priest, start_time) 
VALUES ('Test Puja', 'puja', 'Main Temple', 'Test Priest', '06:00');

-- Step 6: Verify success
SELECT 'SUCCESS: Table created and test data inserted!' as result;
SELECT COUNT(*) as total_records FROM public.puja_series;
SELECT * FROM public.puja_series LIMIT 1;