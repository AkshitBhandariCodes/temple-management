-- Create Puja Series Table for Temple Management
-- Run this in Supabase Dashboard → SQL Editor

-- Drop table if exists (for clean creation)
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Create puja_series table
CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  name text NOT NULL,
  description text DEFAULT '',
  deity text DEFAULT '',
  type text DEFAULT 'puja' CHECK (type IN ('aarti', 'havan', 'puja', 'special_ceremony', 'festival', 'other')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'draft')),
  schedule_config jsonb DEFAULT '{}'::jsonb,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  max_participants integer,
  registration_required boolean DEFAULT false,
  priest_id uuid,
  location text DEFAULT '',
  duration_minutes integer DEFAULT 60,
  requirements text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_series_pkey PRIMARY KEY (id)
);

-- Enable RLS (but allow all operations for now)
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for development
CREATE POLICY "allow_all_puja_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_puja_series_community_id ON public.puja_series(community_id);
CREATE INDEX idx_puja_series_status ON public.puja_series(status);
CREATE INDEX idx_puja_series_type ON public.puja_series(type);
CREATE INDEX idx_puja_series_start_date ON public.puja_series(start_date);

-- Insert sample puja series data
INSERT INTO public.puja_series (
  name,
  description,
  deity,
  type,
  status,
  start_date,
  location,
  duration_minutes,
  schedule_config
) VALUES 
(
  'Daily Morning Aarti',
  'Daily morning prayers for devotees',
  'Lord Ganesha',
  'aarti',
  'active',
  '2025-01-01T06:00:00Z',
  'Main Temple Hall',
  30,
  '{"frequency": "daily", "time": "06:00"}'::jsonb
),
(
  'Weekly Havan',
  'Weekly fire ceremony for prosperity',
  'Agni Dev',
  'havan',
  'active',
  '2025-01-01T18:00:00Z',
  'Havan Kund',
  90,
  '{"frequency": "weekly", "day": "sunday", "time": "18:00"}'::jsonb
),
(
  'Monthly Satyanarayan Puja',
  'Monthly puja for Lord Vishnu',
  'Lord Vishnu',
  'puja',
  'active',
  '2025-01-01T10:00:00Z',
  'Prayer Hall',
  120,
  '{"frequency": "monthly", "date": 1, "time": "10:00"}'::jsonb
);

-- Verify table creation
SELECT 'Puja series table created successfully!' as message;
SELECT COUNT(*) as total_puja_series FROM public.puja_series;

-- Show sample data
SELECT 
  name,
  type,
  status,
  location,
  duration_minutes,
  deity
FROM public.puja_series
ORDER BY created_at;