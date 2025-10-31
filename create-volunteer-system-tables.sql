-- Volunteer Management System - Complete Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- =============================================
-- 1. VOLUNTEERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.volunteers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  address jsonb DEFAULT '{}'::jsonb,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  availability jsonb DEFAULT '{}'::jsonb,
  background_check_status text DEFAULT 'pending',
  background_check_date date,
  onboarding_completed boolean DEFAULT false,
  onboarding_date date,
  status text DEFAULT 'active',
  total_hours_volunteered numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  notes text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteers_pkey PRIMARY KEY (id),
  CONSTRAINT volunteers_email_unique UNIQUE (email),
  CONSTRAINT volunteers_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- 2. VOLUNTEER APPLICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  address jsonb DEFAULT '{}'::jsonb,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  availability jsonb DEFAULT '{}'::jsonb,
  motivation text,
  experience text,
  references jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending',
  applied_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  review_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id),
  CONSTRAINT volunteer_applications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- 3. VOLUNTEER SHIFTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.volunteer_shifts (
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
  CONSTRAINT volunteer_shifts_pkey PRIMARY KEY (id),
  CONSTRAINT volunteer_shifts_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- 4. SHIFT ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.shift_assignments (
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
CREATE TABLE IF NOT EXISTS public.volunteer_attendance (
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
-- 6. EMAIL COMMUNICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.email_communications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  sender_email text NOT NULL,
  recipient_emails text[] NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  template_id uuid,
  status text DEFAULT 'draft',
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  delivery_status jsonb DEFAULT '{}'::jsonb,
  open_tracking jsonb DEFAULT '{}'::jsonb,
  click_tracking jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_communications_pkey PRIMARY KEY (id),
  CONSTRAINT email_communications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- 7. EMAIL TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  name text NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_by uuid,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_templates_pkey PRIMARY KEY (id),
  CONSTRAINT email_templates_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CREATE RLS POLICIES (ALLOW ALL FOR NOW)
-- =============================================

-- Volunteers policies
CREATE POLICY "allow_all_volunteers_select" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "allow_all_volunteers_insert" ON public.volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_volunteers_update" ON public.volunteers FOR UPDATE USING (true);
CREATE POLICY "allow_all_volunteers_delete" ON public.volunteers FOR DELETE USING (true);

-- Volunteer applications policies
CREATE POLICY "allow_all_applications_select" ON public.volunteer_applications FOR SELECT USING (true);
CREATE POLICY "allow_all_applications_insert" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_applications_update" ON public.volunteer_applications FOR UPDATE USING (true);
CREATE POLICY "allow_all_applications_delete" ON public.volunteer_applications FOR DELETE USING (true);

-- Volunteer shifts policies
CREATE POLICY "allow_all_shifts_select" ON public.volunteer_shifts FOR SELECT USING (true);
CREATE POLICY "allow_all_shifts_insert" ON public.volunteer_shifts FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_shifts_update" ON public.volunteer_shifts FOR UPDATE USING (true);
CREATE POLICY "allow_all_shifts_delete" ON public.volunteer_shifts FOR DELETE USING (true);

-- Shift assignments policies
CREATE POLICY "allow_all_assignments_select" ON public.shift_assignments FOR SELECT USING (true);
CREATE POLICY "allow_all_assignments_insert" ON public.shift_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_assignments_update" ON public.shift_assignments FOR UPDATE USING (true);
CREATE POLICY "allow_all_assignments_delete" ON public.shift_assignments FOR DELETE USING (true);

-- Attendance policies
CREATE POLICY "allow_all_attendance_select" ON public.volunteer_attendance FOR SELECT USING (true);
CREATE POLICY "allow_all_attendance_insert" ON public.volunteer_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_attendance_update" ON public.volunteer_attendance FOR UPDATE USING (true);
CREATE POLICY "allow_all_attendance_delete" ON public.volunteer_attendance FOR DELETE USING (true);

-- Email communications policies
CREATE POLICY "allow_all_emails_select" ON public.email_communications FOR SELECT USING (true);
CREATE POLICY "allow_all_emails_insert" ON public.email_communications FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_emails_update" ON public.email_communications FOR UPDATE USING (true);
CREATE POLICY "allow_all_emails_delete" ON public.email_communications FOR DELETE USING (true);

-- Email templates policies
CREATE POLICY "allow_all_templates_select" ON public.email_templates FOR SELECT USING (true);
CREATE POLICY "allow_all_templates_insert" ON public.email_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_templates_update" ON public.email_templates FOR UPDATE USING (true);
CREATE POLICY "allow_all_templates_delete" ON public.email_templates FOR DELETE USING (true);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_volunteers_community_id ON public.volunteers(community_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON public.volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON public.volunteers(status);

CREATE INDEX IF NOT EXISTS idx_applications_community_id ON public.volunteer_applications(community_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.volunteer_applications(email);

CREATE INDEX IF NOT EXISTS idx_shifts_community_id ON public.volunteer_shifts(community_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON public.volunteer_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON public.volunteer_shifts(status);

CREATE INDEX IF NOT EXISTS idx_assignments_shift_id ON public.shift_assignments(shift_id);
CREATE INDEX IF NOT EXISTS idx_assignments_volunteer_id ON public.shift_assignments(volunteer_id);

CREATE INDEX IF NOT EXISTS idx_attendance_volunteer_id ON public.volunteer_attendance(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_attendance_shift_id ON public.volunteer_attendance(shift_id);

CREATE INDEX IF NOT EXISTS idx_emails_community_id ON public.email_communications(community_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON public.email_communications(status);

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
  availability,
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
  '{"weekdays": ["Monday", "Wednesday", "Friday"], "times": ["Morning", "Evening"]}',
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
  '{"weekdays": ["Saturday", "Sunday"], "times": ["All Day"]}',
  'active',
  78.0
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
  'Anita',
  'Patel',
  'anita.patel@example.com',
  '+91-9876543212',
  ARRAY['Music', 'Dance', 'Art'],
  ARRAY['Cultural Programs', 'Youth Activities'],
  'I want to contribute to preserving our cultural heritage and help organize meaningful events.',
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
);

-- Sample email templates
INSERT INTO public.email_templates (
  community_id,
  name,
  subject,
  content,
  category,
  variables
) VALUES 
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Volunteer Welcome',
  'Welcome to {{community_name}} Volunteer Program!',
  'Dear {{volunteer_name}},\n\nWelcome to our volunteer program! We are excited to have you join our community service team.\n\nYour application has been approved and you can now participate in our volunteer activities.\n\nBest regards,\n{{community_name}} Team',
  'onboarding',
  '["volunteer_name", "community_name"]'
),
(
  '5cf9beff-483d-43f0-8ca3-9fba851b283a',
  'Shift Reminder',
  'Reminder: Your volunteer shift on {{shift_date}}',
  'Dear {{volunteer_name}},\n\nThis is a reminder about your upcoming volunteer shift:\n\nShift: {{shift_title}}\nDate: {{shift_date}}\nTime: {{shift_time}}\nLocation: {{shift_location}}\n\nPlease arrive 15 minutes early. Thank you for your service!\n\nBest regards,\n{{community_name}} Team',
  'reminders',
  '["volunteer_name", "shift_title", "shift_date", "shift_time", "shift_location", "community_name"]'
);

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
  'volunteer_attendance',
  'email_communications',
  'email_templates'
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
FROM public.volunteer_shifts
UNION ALL
SELECT 
  'email_templates' as table_name,
  COUNT(*) as record_count
FROM public.email_templates;