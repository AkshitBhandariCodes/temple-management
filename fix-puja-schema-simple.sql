-- Fix Puja Series Schema - Simple Version
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing table
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Create simplified puja_series table
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

-- Enable RLS
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_puja_series" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Add sample data
INSERT INTO public.puja_series (name, description, type, location, priest, start_time, duration_minutes, recurrence_type) VALUES
('Morning Aarti', 'Daily morning prayers', 'aarti', 'Main Temple', 'Pandit Sharma', '06:00', 45, 'daily'),
('Evening Aarti', 'Daily evening prayers', 'aarti', 'Main Temple', 'Pandit Kumar', '18:00', 30, 'daily'),
('Hanuman Chalisa', 'Weekly Hanuman prayers', 'puja', 'Prayer Hall', 'Pandit Gupta', '19:00', 60, 'weekly'),
('Satyanarayan Puja', 'Monthly special puja', 'puja', 'Main Temple', 'Pandit Sharma', '10:00', 120, 'monthly');

-- Verify
SELECT 'Puja series table fixed!' as message;
SELECT COUNT(*) as total_pujas FROM public.puja_series;