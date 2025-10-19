-- Create Community Features Tables for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create community_members table (if not exists)
CREATE TABLE IF NOT EXISTS public.community_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text DEFAULT 'member',
  status text DEFAULT 'active',
  is_lead boolean DEFAULT false,
  lead_position text,
  bio text,
  skills jsonb,
  interests jsonb,
  availability jsonb,
  contribution_hours integer DEFAULT 0,
  joined_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_members_pkey PRIMARY KEY (id),
  CONSTRAINT community_members_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_community_user UNIQUE (community_id, user_id)
);

-- 2. Create community_applications table
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
  CONSTRAINT community_applications_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 3. Create community_tasks table
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
  attachments jsonb DEFAULT '[]'::jsonb,
  progress integer DEFAULT 0,
  estimated_hours integer,
  actual_hours integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT community_tasks_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL
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
  registration_required boolean DEFAULT false,
  registration_deadline timestamp with time zone,
  tags jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_events_pkey PRIMARY KEY (id),
  CONSTRAINT community_events_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- 5. Create community_posts table (for timeline)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  author_id uuid NOT NULL,
  title text,
  content text NOT NULL,
  post_type text DEFAULT 'announcement',
  status text DEFAULT 'published',
  tags jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_posts_pkey PRIMARY KEY (id),
  CONSTRAINT community_posts_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 6. Create community_announcements table
CREATE TABLE IF NOT EXISTS public.community_announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL,
  priority text DEFAULT 'normal',
  status text DEFAULT 'active',
  expires_at timestamp with time zone,
  target_audience jsonb DEFAULT '["all"]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_announcements_pkey PRIMARY KEY (id),
  CONSTRAINT community_announcements_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.communities(id) ON DELETE CASCADE,
  CONSTRAINT community_announcements_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_role ON public.community_members(role);
CREATE INDEX IF NOT EXISTS idx_community_members_status ON public.community_members(status);

CREATE INDEX IF NOT EXISTS idx_community_applications_community_id ON public.community_applications(community_id);
CREATE INDEX IF NOT EXISTS idx_community_applications_status ON public.community_applications(status);
CREATE INDEX IF NOT EXISTS idx_community_applications_applied_at ON public.community_applications(applied_at);

CREATE INDEX IF NOT EXISTS idx_community_tasks_community_id ON public.community_tasks(community_id);
CREATE INDEX IF NOT EXISTS idx_community_tasks_status ON public.community_tasks(status);
CREATE INDEX IF NOT EXISTS idx_community_tasks_priority ON public.community_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_community_tasks_due_date ON public.community_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_community_tasks_assigned_to ON public.community_tasks USING gin(assigned_to);

CREATE INDEX IF NOT EXISTS idx_community_events_community_id ON public.community_events(community_id);
CREATE INDEX IF NOT EXISTS idx_community_events_start_date ON public.community_events(start_date);
CREATE INDEX IF NOT EXISTS idx_community_events_status ON public.community_events(status);

CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON public.community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);

-- 8. Enable RLS on all tables
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_announcements ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies (allow all for now)
-- Community Members
CREATE POLICY "allow_all_community_members_select" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "allow_all_community_members_insert" ON public.community_members FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_members_update" ON public.community_members FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_members_delete" ON public.community_members FOR DELETE USING (true);

-- Community Applications
CREATE POLICY "allow_all_community_applications_select" ON public.community_applications FOR SELECT USING (true);
CREATE POLICY "allow_all_community_applications_insert" ON public.community_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_applications_update" ON public.community_applications FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_applications_delete" ON public.community_applications FOR DELETE USING (true);

-- Community Tasks
CREATE POLICY "allow_all_community_tasks_select" ON public.community_tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_community_tasks_insert" ON public.community_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_tasks_update" ON public.community_tasks FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_tasks_delete" ON public.community_tasks FOR DELETE USING (true);

-- Community Events
CREATE POLICY "allow_all_community_events_select" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "allow_all_community_events_insert" ON public.community_events FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_events_update" ON public.community_events FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_events_delete" ON public.community_events FOR DELETE USING (true);

-- Community Posts
CREATE POLICY "allow_all_community_posts_select" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "allow_all_community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_posts_update" ON public.community_posts FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_posts_delete" ON public.community_posts FOR DELETE USING (true);

-- Community Announcements
CREATE POLICY "allow_all_community_announcements_select" ON public.community_announcements FOR SELECT USING (true);
CREATE POLICY "allow_all_community_announcements_insert" ON public.community_announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_announcements_update" ON public.community_announcements FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_announcements_delete" ON public.community_announcements FOR DELETE USING (true);

-- 10. Verify tables were created
SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      'community_members', 
      'community_applications', 
      'community_tasks', 
      'community_events', 
      'community_posts', 
      'community_announcements'
    ) THEN '✅ CREATED'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'community_%'
ORDER BY table_name;