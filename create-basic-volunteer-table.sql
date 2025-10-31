-- Basic Volunteer Table Creation
-- Run this in Supabase Dashboard → SQL Editor

-- Drop table if exists (for clean creation)
DROP TABLE IF EXISTS public.volunteers CASCADE;

-- Create basic volunteers table
CREATE TABLE public.volunteers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  status text DEFAULT 'active',
  total_hours_volunteered numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteers_pkey PRIMARY KEY (id),
  CONSTRAINT volunteers_email_unique UNIQUE (email)
);

-- Enable RLS (but allow all operations for now)
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies
CREATE POLICY "allow_all_volunteer_operations" ON public.volunteers FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_volunteers_community_id ON public.volunteers(community_id);
CREATE INDEX idx_volunteers_email ON public.volunteers(email);
CREATE INDEX idx_volunteers_status ON public.volunteers(status);

-- Insert sample volunteers
INSERT INTO public.volunteers (
  community_id,
  first_name,
  last_name,
  email,
  phone,
  skills,
  interests,
  status,
  total_hours_volunteered
) VALUES 
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Priya',
  'Sharma',
  'priya.sharma@example.com',
  '+91-9876543210',
  ARRAY['Event Management', 'Teaching', 'Cooking'],
  ARRAY['Cultural Events', 'Children Activities', 'Food Service'],
  'active',
  45.5
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Rajesh',
  'Kumar',
  'rajesh.kumar@example.com',
  '+91-9876543211',
  ARRAY['Security', 'Maintenance', 'Crowd Management'],
  ARRAY['Temple Security', 'Facility Management'],
  'active',
  78.0
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Anita',
  'Patel',
  'anita.patel@example.com',
  '+91-9876543212',
  ARRAY['Music', 'Dance', 'Art'],
  ARRAY['Cultural Programs', 'Youth Activities'],
  'active',
  32.5
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Suresh',
  'Gupta',
  'suresh.gupta@example.com',
  '+91-9876543213',
  ARRAY['Accounting', 'Administration'],
  ARRAY['Finance Management', 'Office Work'],
  'active',
  56.0
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Meera',
  'Singh',
  'meera.singh@example.com',
  '+91-9876543214',
  ARRAY['Decoration', 'Flower Arrangement'],
  ARRAY['Festival Decoration', 'Temple Beautification'],
  'inactive',
  23.5
);

-- Verify table creation
SELECT 'Volunteers table created successfully!' as message;
SELECT COUNT(*) as volunteer_count FROM public.volunteers;