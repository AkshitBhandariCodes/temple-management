-- Create ONLY the community_tasks table
-- Copy and run this in Supabase Dashboard → SQL Editor

-- 1. Create community_tasks table
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

-- 2. Enable RLS
ALTER TABLE public.community_tasks ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies (allow all for now)
CREATE POLICY "allow_all_community_tasks_select" ON public.community_tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_community_tasks_insert" ON public.community_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_community_tasks_update" ON public.community_tasks FOR UPDATE USING (true);
CREATE POLICY "allow_all_community_tasks_delete" ON public.community_tasks FOR DELETE USING (true);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_community_tasks_community_id ON public.community_tasks(community_id);
CREATE INDEX IF NOT EXISTS idx_community_tasks_status ON public.community_tasks(status);
CREATE INDEX IF NOT EXISTS idx_community_tasks_priority ON public.community_tasks(priority);

-- 5. Verify table was created
SELECT 
  'community_tasks' as table_name,
  'CREATED ✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'community_tasks';

-- 6. Test insert
INSERT INTO public.community_tasks (
  community_id,
  title,
  description,
  status,
  priority
) VALUES (
  (SELECT id FROM public.communities LIMIT 1),
  'Test Task from SQL',
  'This is a test task created directly in SQL',
  'todo',
  'medium'
);

-- 7. Verify insert worked
SELECT 
  id,
  title,
  status,
  priority,
  created_at
FROM public.community_tasks 
WHERE title = 'Test Task from SQL';