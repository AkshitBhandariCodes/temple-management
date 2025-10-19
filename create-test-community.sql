-- Create a test community directly in Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Insert a test community
INSERT INTO public.communities (
  id,
  name,
  slug,
  description,
  owner_id,
  status,
  member_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Test Community for Tasks',
  'test-community-tasks',
  'A test community to verify tasks functionality',
  gen_random_uuid(),
  'active',
  0,
  now(),
  now()
) ON CONFLICT (slug) DO NOTHING;

-- 2. Get the community ID
SELECT 
  id,
  name,
  slug,
  status,
  created_at
FROM public.communities 
WHERE slug = 'test-community-tasks';

-- 3. Test inserting a task
INSERT INTO public.community_tasks (
  community_id,
  title,
  description,
  status,
  priority,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM public.communities WHERE slug = 'test-community-tasks'),
  'SQL Test Task',
  'This task was created directly in SQL',
  'todo',
  'medium',
  now(),
  now()
);

-- 4. Verify task was created
SELECT 
  t.id,
  t.title,
  t.status,
  t.priority,
  c.name as community_name,
  t.created_at
FROM public.community_tasks t
JOIN public.communities c ON t.community_id = c.id
WHERE c.slug = 'test-community-tasks';