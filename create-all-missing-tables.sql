-- Create All Missing Community Tables
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Disable RLS on all tables for testing
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_tasks DISABLE ROW LEVEL SECURITY;

-- 2. Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  user_id text NOT NULL,
  role text DEFAULT 'member',
  status text DEFAULT 'active',
  is_lead boolean DEFAULT false,
  lead_position text,
  joined_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_members_pkey PRIMARY KEY (id),
  CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- 3. Create community_applications table (if not exists)
CREATE TABLE IF NOT EXISTS public.community_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  why_join text,
  skills jsonb DEFAULT '[]'::jsonb,
  experience text,
  status text DEFAULT 'pending',
  applied_at timestamp with time zone DEFAULT now(),
  reviewed_at timestamp with time zone,
  review_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_applications_pkey PRIMARY KEY (id),
  CONSTRAINT community_applications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- 4. Create community_events table (if not exists)
CREATE TABLE IF NOT EXISTS public.community_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  location text,
  event_type text DEFAULT 'meeting',
  status text DEFAULT 'published',
  max_participants integer,
  current_participants integer DEFAULT 0,
  organizer_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_events_pkey PRIMARY KEY (id),
  CONSTRAINT community_events_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- 5. Disable RLS on all new tables
ALTER TABLE public.community_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events DISABLE ROW LEVEL SECURITY;

-- 6. Test inserts for all tables
-- Test member
INSERT INTO public.community_members (
  community_id,
  user_id,
  role,
  status
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'sql-test-member',
  'member',
  'active'
) ON CONFLICT DO NOTHING;

-- Test application
INSERT INTO public.community_applications (
  community_id,
  name,
  email,
  message,
  status
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'SQL Test Applicant',
  'sql.test@temple.com',
  'Test application from SQL',
  'pending'
) ON CONFLICT DO NOTHING;

-- Test event
INSERT INTO public.community_events (
  community_id,
  title,
  description,
  start_date,
  end_date,
  location
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'SQL Test Event',
  'Test event created from SQL',
  now() + interval '1 day',
  now() + interval '2 days',
  'SQL Test Location'
) ON CONFLICT DO NOTHING;

-- 7. Verify all data exists
SELECT 'Members' as table_name, COUNT(*) as count FROM public.community_members WHERE community_id = '12345678-1234-1234-1234-123456789abc'
UNION ALL
SELECT 'Applications' as table_name, COUNT(*) as count FROM public.community_applications WHERE community_id = '12345678-1234-1234-1234-123456789abc'
UNION ALL
SELECT 'Events' as table_name, COUNT(*) as count FROM public.community_events WHERE community_id = '12345678-1234-1234-1234-123456789abc'
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM public.community_tasks WHERE community_id = '12345678-1234-1234-1234-123456789abc';

-- 8. Show sample data
SELECT 'MEMBERS' as type, id, user_id as identifier, role as info FROM public.community_members WHERE community_id = '12345678-1234-1234-1234-123456789abc' LIMIT 3
UNION ALL
SELECT 'APPLICATIONS' as type, id, name as identifier, status as info FROM public.community_applications WHERE community_id = '12345678-1234-1234-1234-123456789abc' LIMIT 3
UNION ALL
SELECT 'EVENTS' as type, id, title as identifier, status as info FROM public.community_events WHERE community_id = '12345678-1234-1234-1234-123456789abc' LIMIT 3
UNION ALL
SELECT 'TASKS' as type, id, title as identifier, status as info FROM public.community_tasks WHERE community_id = '12345678-1234-1234-1234-123456789abc' LIMIT 3;