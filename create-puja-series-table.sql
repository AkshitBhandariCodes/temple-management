-- Create Puja Series Table for Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.puja_series CASCADE;

-- Create puja_series table
CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  name text NOT NULL,
  description text,
  deity text,
  type text NOT NULL CHECK (type IN ('aarti', 'havan', 'puja', 'special_ceremony', 'festival', 'other')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'draft')),
  schedule_config jsonb NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  max_participants integer CHECK (max_participants >= 1),
  registration_required boolean DEFAULT false,
  priest_id uuid,
  location text,
  duration_minutes integer DEFAULT 60 CHECK (duration_minutes >= 15),
  requirements text[],
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_series_pkey PRIMARY KEY (id),
  CONSTRAINT puja_series_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policy for development (adjust for production)
CREATE POLICY "allow_all_puja_series_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_puja_series_community_id ON public.puja_series(community_id);
CREATE INDEX idx_puja_series_status ON public.puja_series(status);
CREATE INDEX idx_puja_series_type ON public.puja_series(type);
CREATE INDEX idx_puja_series_start_date ON public.puja_series(start_date);
CREATE INDEX idx_puja_series_priest_id ON public.puja_series(priest_id);
CREATE INDEX idx_puja_series_created_by ON public.puja_series(created_by);

-- Create trigger for updating updated_at timestamp
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

-- Insert sample puja series data
INSERT INTO public.puja_series (
  name,
  description,
  deity,
  type,
  status,
  schedule_config,
  start_date,
  end_date,
  max_participants,
  registration_required,
  location,
  duration_minutes,
  requirements,
  notes,
  created_by
) VALUES 
(
  'Daily Morning Aarti',
  'Daily morning prayers and aarti for all devotees',
  'Lord Ganesha',
  'aarti',
  'active',
  '{"frequency": "daily", "time": "06:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}'::jsonb,
  '2024-01-01 06:00:00+00',
  null,
  100,
  false,
  'Main Temple Hall',
  45,
  ARRAY['Arrive 10 minutes early', 'Dress modestly', 'Remove shoes'],
  'Daily morning aarti for all community members',
  (SELECT id FROM public.communities LIMIT 1)
),
(
  'Weekly Havan',
  'Weekly fire ceremony for prosperity and peace',
  'Agni Dev',
  'havan',
  'active',
  '{"frequency": "weekly", "day": "sunday", "time": "10:00"}'::jsonb,
  '2024-01-07 10:00:00+00',
  '2024-12-31 10:00:00+00',
  50,
  true,
  'Havan Kund Area',
  90,
  ARRAY['Bring offerings', 'Arrive 15 minutes early', 'Participate in chanting'],
  'Weekly havan ceremony for community well-being',
  (SELECT id FROM public.communities LIMIT 1)
),
(
  'Ganesh Chaturthi Celebration',
  'Annual Ganesh Chaturthi festival celebration',
  'Lord Ganesha',
  'festival',
  'active',
  '{"frequency": "yearly", "date": "2024-09-07", "time": "09:00"}'::jsonb,
  '2024-09-07 09:00:00+00',
  '2024-09-17 18:00:00+00',
  500,
  false,
  'Entire Temple Complex',
  600,
  ARRAY['Traditional attire preferred', 'Bring prasadam to share', 'Participate in procession'],
  '11-day Ganesh Chaturthi festival with daily prayers and cultural programs',
  (SELECT id FROM public.communities LIMIT 1)
),
(
  'Monthly Satyanarayan Puja',
  'Monthly Satyanarayan Puja for devotees',
  'Lord Vishnu',
  'puja',
  'active',
  '{"frequency": "monthly", "date": 15, "time": "18:00"}'::jsonb,
  '2024-01-15 18:00:00+00',
  null,
  75,
  true,
  'Prayer Hall',
  120,
  ARRAY['Register in advance', 'Bring fruits for prasadam', 'Participate in katha'],
  'Monthly Satyanarayan Puja with katha and prasadam',
  (SELECT id FROM public.communities LIMIT 1)
),
(
  'Diwali Special Puja',
  'Special Diwali celebration with Lakshmi Puja',
  'Goddess Lakshmi',
  'special_ceremony',
  'active',
  '{"frequency": "yearly", "date": "2024-11-01", "time": "19:00"}'::jsonb,
  '2024-11-01 19:00:00+00',
  '2024-11-01 21:00:00+00',
  200,
  false,
  'Main Temple Hall',
  120,
  ARRAY['Bring diyas and candles', 'Traditional attire required', 'Participate in aarti'],
  'Special Diwali celebration with Lakshmi Puja and community feast',
  (SELECT id FROM public.communities LIMIT 1)
);

-- Verify table creation
SELECT 'Puja series table created successfully!' as message;
SELECT COUNT(*) as puja_series_count FROM public.puja_series;

-- Show sample data
SELECT 
  name,
  type,
  status,
  start_date,
  location,
  duration_minutes
FROM public.puja_series
ORDER BY created_at;