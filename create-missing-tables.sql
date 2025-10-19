-- Create Missing Community Tables in Supabase
-- Copy and run this ENTIRE script in Supabase Dashboard → SQL Editor

-- 1. Create community_members table
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

-- 2. Create community_tasks table
CREATE TABLE IF NOT EXISTS public.community_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  assigned_to jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT community_tasks_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE
);

-- 3. Create community_applications table
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

-- 4. Create community_events table
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

-- 5. Enable RLS on all tables
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (allow all for now)
-- Community Members
CREATE POLICY "allow_all_community_members_select" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "allow_all_community_members_insert" ON public.community_members FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_members_update" ON public.community_members FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_members_delete" ON public.community_members FOR DELETE USING (true);

-- Community Tasks
CREATE POLICY "allow_all_community_tasks_select" ON public.community_tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_community_tasks_insert" ON public.community_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_tasks_update" ON public.community_tasks FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_tasks_delete" ON public.community_tasks FOR DELETE USING (true);

-- Community Applications
CREATE POLICY "allow_all_community_applications_select" ON public.community_applications FOR SELECT USING (true);
CREATE POLICY "allow_all_community_applications_insert" ON public.community_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_applications_update" ON public.community_applications FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_applications_delete" ON public.community_applications FOR DELETE USING (true);

-- Community Events
CREATE POLICY "allow_all_community_events_select" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "allow_all_community_events_insert" ON public.community_events FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_events_update" ON public.community_events FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_events_delete" ON public.community_events FOR DELETE USING (true);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_tasks_community_id ON public.community_tasks(community_id);
CREATE INDEX IF NOT EXISTS idx_community_applications_community_id ON public.community_applications(community_id);
CREATE INDEX IF NOT EXISTS idx_community_events_community_id ON public.community_events(community_id);

-- 8. Verify tables were created
SELECT 
  table_name,
  'CREATED ✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'community_members', 
  'community_tasks', 
  'community_applications', 
  'community_events'
)
ORDER BY table_name;