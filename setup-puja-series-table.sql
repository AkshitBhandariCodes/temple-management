-- Setup Puja Series Table for Temple Admin Portal
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Step 2: Create puja_series table with all required fields
CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  name text NOT NULL,
  description text,
  deity text,
  type text DEFAULT 'regular',
  start_date date NOT NULL,
  end_date date,
  schedule_config jsonb DEFAULT '{}',
  duration_minutes integer DEFAULT 60,
  max_participants integer,
  registration_required boolean DEFAULT false,
  priest_id uuid,
  location text,
  requirements text[],
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'draft')),
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_series_pkey PRIMARY KEY (id)
);

-- Step 3: Enable RLS with permissive policy for development
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_puja_series_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Create indexes for better performance
CREATE INDEX idx_puja_series_community_id ON public.puja_series(community_id);
CREATE INDEX idx_puja_series_status ON public.puja_series(status);
CREATE INDEX idx_puja_series_type ON public.puja_series(type);
CREATE INDEX idx_puja_series_start_date ON public.puja_series(start_date);
CREATE INDEX idx_puja_series_priest_id ON public.puja_series(priest_id);

-- Step 5: Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_puja_series_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_puja_series_updated_at
    BEFORE UPDATE ON public.puja_series
    FOR EACH ROW
    EXECUTE FUNCTION update_puja_series_updated_at();

-- Step 6: Insert sample puja series data for testing
INSERT INTO public.puja_series (
  name,
  description,
  deity,
  type,
  start_date,
  schedule_config,
  duration_minutes,
  location,
  status
) VALUES 
(
  'Daily Morning Aarti',
  'Daily morning prayers and aarti ceremony',
  'Ganesha',
  'daily',
  CURRENT_DATE,
  '{"recurrence_type": "daily", "frequency": 1, "start_time": "06:00", "location": "Main Temple"}',
  45,
  'Main Temple',
  'active'
),
(
  'Weekly Hanuman Chalisa',
  'Weekly Hanuman Chalisa recitation every Tuesday',
  'Hanuman',
  'weekly',
  CURRENT_DATE,
  '{"recurrence_type": "weekly", "frequency": 1, "days_of_week": ["tuesday"], "start_time": "18:00", "location": "Prayer Hall"}',
  60,
  'Prayer Hall',
  'active'
),
(
  'Monthly Satyanarayan Puja',
  'Monthly Satyanarayan Puja on full moon day',
  'Vishnu',
  'monthly',
  CURRENT_DATE,
  '{"recurrence_type": "monthly", "frequency": 1, "start_time": "10:00", "location": "Main Temple"}',
  120,
  'Main Temple',
  'active'
);

-- Step 7: Verify table creation and data
SELECT 'Puja series table created successfully!' as message;
SELECT COUNT(*) as total_puja_series FROM public.puja_series;

-- Step 8: Show sample data structure
SELECT 
  id,
  name,
  deity,
  type,
  start_date,
  duration_minutes,
  status,
  created_at
FROM public.puja_series
ORDER BY created_at DESC;