-- Simple Tasks Test - Works with existing schema
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Temporarily disable RLS for testing
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_tasks DISABLE ROW LEVEL SECURITY;

-- 2. Check existing communities
SELECT id, name, slug FROM public.communities LIMIT 5;

-- 3. Insert a simple test community (adjust columns based on your schema)
INSERT INTO public.communities (
  name,
  slug,
  description,
  owner_id,
  status
) VALUES (
  'Simple Test Community',
  'simple-test-community',
  'A simple community for testing tasks',
  gen_random_uuid(),
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- 4. Get the community ID
SELECT id, name, slug FROM public.communities WHERE slug = 'simple-test-community';

-- 5. Insert a test task
INSERT INTO public.community_tasks (
  community_id,
  title,
  description,
  status,
  priority
) VALUES (
  (SELECT id FROM public.communities WHERE slug = 'simple-test-community'),
  'Simple Test Task',
  'A test task to verify the system works',
  'todo',
  'medium'
);

-- 6. Verify everything works
SELECT 
  t.id as task_id,
  t.title,
  t.status,
  t.priority,
  c.name as community_name,
  c.id as community_id
FROM public.community_tasks t
JOIN public.communities c ON t.community_id = c.id
WHERE c.slug = 'simple-test-community';

-- 7. Show final status
SELECT 
  'Communities' as table_name,
  COUNT(*) as record_count
FROM public.communities
UNION ALL
SELECT 
  'Tasks' as table_name,
  COUNT(*) as record_count
FROM public.community_tasks;