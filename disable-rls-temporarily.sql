-- Temporarily disable RLS to test tasks
-- Run this in Supabase Dashboard → SQL Editor
-- WARNING: This removes security - only for testing!

-- 1. Disable RLS on communities table
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;

-- 2. Insert a test community directly
INSERT INTO public.communities (
  id,
  name,
  slug,
  description,
  owner_id,
  status,
  created_at,
  updated_at
) VALUES (
  'test-community-for-tasks-123',
  'Direct Test Community',
  'direct-test-community',
  'Community created directly in database for testing',
  'test-owner-123',
  'active',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 3. Verify community exists
SELECT id, name, slug, status FROM public.communities WHERE id = 'test-community-for-tasks-123';

-- 4. Test task insertion
INSERT INTO public.community_tasks (
  community_id,
  title,
  description,
  status,
  priority
) VALUES (
  'test-community-for-tasks-123',
  'Direct SQL Task',
  'Task created directly in SQL',
  'todo',
  'medium'
);

-- 5. Verify task exists
SELECT 
  t.id,
  t.title,
  t.status,
  c.name as community_name
FROM public.community_tasks t
JOIN public.communities c ON t.community_id = c.id
WHERE c.id = 'test-community-for-tasks-123';