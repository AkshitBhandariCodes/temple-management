-- Create proper volunteer applications table
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.volunteer_applications CASCADE;

-- Create volunteer_applications table with proper structure
CREATE TABLE public.volunteer_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text DEFAULT '',
  emergency_contact text DEFAULT '',
  preferred_areas text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  experience text DEFAULT '',
  availability text DEFAULT '',
  motivation text DEFAULT '',
  references jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under-review', 'approved', 'rejected')),
  background_check text DEFAULT 'pending' CHECK (background_check IN ('pending', 'completed', 'failed')),
  interview_scheduled boolean DEFAULT false,
  interview_date timestamp with time zone,
  applied_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  rejection_reason text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for development
CREATE POLICY "allow_all_volunteer_application_operations" ON public.volunteer_applications FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_volunteer_applications_community_id ON public.volunteer_applications(community_id);
CREATE INDEX idx_volunteer_applications_status ON public.volunteer_applications(status);
CREATE INDEX idx_volunteer_applications_applied_at ON public.volunteer_applications(applied_at);
CREATE INDEX idx_volunteer_applications_email ON public.volunteer_applications(email);

-- Insert sample data
INSERT INTO public.volunteer_applications (
  name,
  email,
  phone,
  address,
  emergency_contact,
  preferred_areas,
  skills,
  experience,
  availability,
  motivation,
  references,
  status,
  background_check,
  interview_scheduled
) VALUES 
(
  'Anita Gupta',
  'anita.gupta@email.com',
  '+91 98765 43210',
  'Mumbai, Maharashtra',
  'Rajesh Gupta - +91 98765 43211',
  ARRAY['Youth Programs', 'Teaching', 'Event Coordination'],
  ARRAY['Teaching', 'Public Speaking', 'Child Psychology', 'Hindi', 'English'],
  '5 years teaching experience, worked with children''s programs',
  'Weekends and evenings',
  'I want to contribute to the spiritual development of young minds and help preserve our cultural values.',
  '[{"name": "Dr. Priya Sharma", "relation": "Former Colleague", "phone": "+91 98765 43212"}, {"name": "Mrs. Meera Singh", "relation": "Community Leader", "phone": "+91 98765 43213"}]'::jsonb,
  'pending',
  'pending',
  false
),
(
  'Vikram Singh',
  'vikram.singh@email.com',
  '+91 87654 32109',
  'Delhi, India',
  'Harpreet Kaur - +91 87654 32110',
  ARRAY['Temple Services', 'Maintenance', 'Security'],
  ARRAY['Electrical Work', 'Plumbing', 'Security', 'Punjabi', 'Hindi'],
  '10 years in facility management, security background',
  'Flexible, can work any shift',
  'I want to serve the temple and ensure devotees have a safe and comfortable environment for worship.',
  '[{"name": "Mr. Arjun Kumar", "relation": "Former Supervisor", "phone": "+91 87654 32111"}, {"name": "Pandit Sharma", "relation": "Temple Priest", "phone": "+91 87654 32112"}]'::jsonb,
  'under-review',
  'completed',
  true
),
(
  'Lakshmi Devi',
  'lakshmi.devi@email.com',
  '+91 76543 21098',
  'Chennai, Tamil Nadu',
  'Ravi Kumar - +91 76543 21099',
  ARRAY['Kitchen Management', 'Prasadam Preparation', 'Festival Cooking'],
  ARRAY['Cooking', 'Food Safety', 'Kitchen Management', 'Tamil', 'Sanskrit'],
  '15 years professional cooking, temple kitchen experience',
  'Morning shifts preferred',
  'Cooking prasadam is my way of serving the divine and the devotees.',
  '[{"name": "Chef Ramesh", "relation": "Former Colleague", "phone": "+91 76543 21100"}, {"name": "Mrs. Sita Devi", "relation": "Temple Coordinator", "phone": "+91 76543 21101"}]'::jsonb,
  'approved',
  'completed',
  false
),
(
  'Ravi Shankar',
  'ravi.shankar@email.com',
  '+91 65432 10987',
  'Kolkata, West Bengal',
  'Gita Shankar - +91 65432 10988',
  ARRAY['Music', 'Bhajan', 'Cultural Programs'],
  ARRAY['Tabla', 'Harmonium', 'Singing', 'Bengali', 'Hindi'],
  'Amateur musician, participated in local cultural events',
  'Evening programs only',
  'Music is my passion and I want to share it in service of the divine.',
  '[{"name": "Pandit Raghunath", "relation": "Music Teacher", "phone": "+91 65432 10989"}]'::jsonb,
  'rejected',
  'completed',
  false
);

-- Verify table creation
SELECT 'Volunteer applications table created successfully!' as message;
SELECT COUNT(*) as total_applications FROM public.volunteer_applications;

-- Show sample data
SELECT 
  name,
  email,
  status,
  background_check,
  interview_scheduled,
  array_length(preferred_areas, 1) as preferred_areas_count,
  array_length(skills, 1) as skills_count
FROM public.volunteer_applications
ORDER BY applied_at DESC;