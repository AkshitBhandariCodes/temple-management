-- FIXED: Basic Volunteer Table Creation
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing tables if they exist (for clean creation)
DROP TABLE IF EXISTS public.volunteer_attendance CASCADE;
DROP TABLE IF EXISTS public.shift_assignments CASCADE;
DROP TABLE IF EXISTS public.volunteer_shifts CASCADE;
DROP TABLE IF EXISTS public.volunteer_applications CASCADE;
DROP TABLE IF EXISTS public.volunteers CASCADE;

-- =============================================
-- 1. VOLUNTEERS TABLE (BASIC VERSION)
-- =============================================
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

-- =============================================
-- 2. VOLUNTEER APPLICATIONS TABLE
-- =============================================
CREATE TABLE public.volunteer_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  motivation text,
  experience text,
  status text DEFAULT 'pending',
  applied_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  review_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id)
);

-- =============================================
-- 3. VOLUNTEER SHIFTS TABLE
-- =============================================
CREATE TABLE public.volunteer_shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  title text NOT NULL,
  description text,
  location text,
  shift_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  required_volunteers integer DEFAULT 1,
  skills_required text[] DEFAULT '{}',
  status text DEFAULT 'open',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_shifts_pkey PRIMARY KEY (id)
);

-- =============================================
-- 4. SHIFT ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE public.shift_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL,
  volunteer_id uuid NOT NULL,
  status text DEFAULT 'assigned',
  assigned_at timestamp with time zone DEFAULT now(),
  assigned_by uuid,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shift_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT shift_assignments_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.volunteer_shifts(id) ON DELETE CASCADE,
  CONSTRAINT shift_assignments_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE,
  CONSTRAINT shift_assignments_unique UNIQUE (shift_id, volunteer_id)
);

-- =============================================
-- 5. ATTENDANCE TABLE
-- =============================================
CREATE TABLE public.volunteer_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shift_assignment_id uuid NOT NULL,
  volunteer_id uuid NOT NULL,
  shift_id uuid NOT NULL,
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  hours_worked numeric DEFAULT 0,
  status text DEFAULT 'scheduled',
  notes text,
  checked_in_by uuid,
  checked_out_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT volunteer_attendance_shift_assignment_id_fkey FOREIGN KEY (shift_assignment_id) REFERENCES public.shift_assignments(id) ON DELETE CASCADE,
  CONSTRAINT volunteer_attendance_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE,
  CONSTRAINT volunteer_attendance_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.volunteer_shifts(id) ON DELETE CASCADE
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_attendance ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE PERMISSIVE RLS POLICIES (ALLOW ALL FOR NOW)
-- =============================================

-- Volunteers policies
CREATE POLICY "allow_all_volunteers_operations" ON public.volunteers FOR ALL USING (true) WITH CHECK (true);

-- Volunteer applications policies
CREATE POLICY "allow_all_applications_operations" ON public.volunteer_applications FOR ALL USING (true) WITH CHECK (true);

-- Volunteer shifts policies
CREATE POLICY "allow_all_shifts_operations" ON public.volunteer_shifts FOR ALL USING (true) WITH CHECK (true);

-- Shift assignments policies
CREATE POLICY "allow_all_assignments_operations" ON public.shift_assignments FOR ALL USING (true) WITH CHECK (true);

-- Attendance policies
CREATE POLICY "allow_all_attendance_operations" ON public.volunteer_attendance FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_volunteers_community_id ON public.volunteers(community_id);
CREATE INDEX idx_volunteers_email ON public.volunteers(email);
CREATE INDEX idx_volunteers_status ON public.volunteers(status);

CREATE INDEX idx_applications_community_id ON public.volunteer_applications(community_id);
CREATE INDEX idx_applications_status ON public.volunteer_applications(status);
CREATE INDEX idx_applications_email ON public.volunteer_applications(email);

CREATE INDEX idx_shifts_community_id ON public.volunteer_shifts(community_id);
CREATE INDEX idx_shifts_date ON public.volunteer_shifts(shift_date);
CREATE INDEX idx_shifts_status ON public.volunteer_shifts(status);

CREATE INDEX idx_assignments_shift_id ON public.shift_assignments(shift_id);
CREATE INDEX idx_assignments_volunteer_id ON public.shift_assignments(volunteer_id);

CREATE INDEX idx_attendance_volunteer_id ON public.volunteer_attendance(volunteer_id);
CREATE INDEX idx_attendance_shift_id ON public.volunteer_attendance(shift_id);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample volunteers
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

-- Sample volunteer applications
INSERT INTO public.volunteer_applications (
  community_id,
  first_name,
  last_name,
  email,
  phone,
  skills,
  interests,
  motivation,
  status
) VALUES 
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Kavita',
  'Joshi',
  'kavita.joshi@example.com',
  '+91-9876543215',
  ARRAY['Teaching', 'Child Care'],
  ARRAY['Education', 'Youth Programs'],
  'I want to contribute to educating children about our traditions and values.',
  'pending'
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Amit',
  'Verma',
  'amit.verma@example.com',
  '+91-9876543216',
  ARRAY['Photography', 'Social Media'],
  ARRAY['Documentation', 'Marketing'],
  'I would like to help document and promote temple events through photography and social media.',
  'pending'
);

-- Sample shifts
INSERT INTO public.volunteer_shifts (
  community_id,
  title,
  description,
  location,
  shift_date,
  start_time,
  end_time,
  required_volunteers,
  skills_required,
  status
) VALUES 
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Morning Aarti Support',
  'Assist with morning aarti preparations and crowd management',
  'Main Temple Hall',
  CURRENT_DATE + INTERVAL '1 day',
  '05:30:00',
  '07:30:00',
  3,
  ARRAY['Crowd Management', 'Temple Protocols'],
  'open'
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Festival Food Service',
  'Help with food preparation and distribution during festival',
  'Community Kitchen',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00:00',
  '16:00:00',
  5,
  ARRAY['Cooking', 'Food Service'],
  'open'
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Evening Cleanup',
  'General cleaning and maintenance after evening prayers',
  'Temple Premises',
  CURRENT_DATE,
  '20:00:00',
  '21:30:00',
  4,
  ARRAY['Maintenance', 'Cleaning'],
  'open'
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify table creation
SELECT 
  table_name,
  'CREATED ✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'volunteers', 
  'volunteer_applications', 
  'volunteer_shifts', 
  'shift_assignments', 
  'volunteer_attendance'
)
ORDER BY table_name;

-- Show sample data counts
SELECT 
  'volunteers' as table_name,
  COUNT(*) as record_count
FROM public.volunteers
UNION ALL
SELECT 
  'volunteer_applications' as table_name,
  COUNT(*) as record_count
FROM public.volunteer_applications
UNION ALL
SELECT 
  'volunteer_shifts' as table_name,
  COUNT(*) as record_count
FROM public.volunteer_shifts;

-- Show sample volunteers
SELECT 
  first_name,
  last_name,
  email,
  status,
  total_hours_volunteered,
  array_length(skills, 1) as skills_count
FROM public.volunteers
ORDER BY first_name;

SELECT 'Volunteer system tables created successfully! 🎉' as message;