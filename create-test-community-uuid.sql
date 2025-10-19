-- Create test community with proper UUID
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Disable RLS temporarily for testing
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_tasks DISABLE ROW LEVEL SECURITY;

-- 2. Insert a test community with proper UUID
INSERT INTO public.communities (
  id,
  name,
  slug,
  description,
  owner_id,
  status
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'Tasks Test Community',
  'tasks-test-community',/*  */
  'Community for testing tasks functionality',
  gen_random_uuid(),
  'active'
) ON CONFLICT (id) DO NOTHING;

-- 3. Verify community exists
SELECT id, name, slug FROM public.communities WHERE id = '12345678-1234-1234-1234-123456789abc';

-- 4. Insert a test task
INSERT INTO public.community_tasks (
  community_id,
  title,
  description,
  status,
  priority
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'SQL Test Task',
  'This task was created directly in SQL',
  'todo',
  'medium'
);

-- 5. Verify task exists
SELECT 
  t.id,
  t.title,
  t.status,
  t.priority,
  c.name as community_name
FROM public.community_tasks t
JOIN public.communities c ON t.community_id = c.id
WHERE c.id = '12345678-1234-1234-1234-123456789abc';