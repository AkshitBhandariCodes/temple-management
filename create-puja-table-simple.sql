-- Simple Puja Series Table Creation
-- Run this in Supabase Dashboard → SQL Editor

-- Drop table if exists (for clean creation)
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Create puja_series table
CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  deity text DEFAULT '',
  type text DEFAULT 'puja',
  status text DEFAULT 'active',
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

-- Create permissive RLS policies
CREATE POLICY "allow_all_puja_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_puja_series_community_id ON public.puja_series(community_id);
CREATE INDEX idx_puja_series_status ON public.puja_series(status);
CREATE INDEX idx_puja_series_start_date ON public.puja_series(start_date);

-- Insert a test puja series
INSERT INTO public.puja_series (
  community_id,
  name,
  description,
  deity,
  type,
  status,
  start_date,
  location,
  duration_minutes
) VALUES (
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Daily Morning Aarti',
  'Daily morning prayers for devotees',
  'Lord Ganesha',
  'aarti',
  'active',
  '2025-01-01T06:00:00Z',
  'Main Temple Hall',
  30
);

-- Verify table creation
SELECT 'Table created successfully!' as message;
SELECT * FROM public.puja_series LIMIT 1;