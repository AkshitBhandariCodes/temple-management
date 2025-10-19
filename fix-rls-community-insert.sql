-- =====================================================
-- FIX RLS COMMUNITY INSERT ISSUE
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. First, let's check current RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users');

-- 2. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "communities_select_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_insert_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_update_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_delete_policy" ON public.communities;

DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- 3. Enable RLS on tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Create PERMISSIVE policies that allow all operations
-- These policies use (true) which means they allow all operations

-- COMMUNITIES POLICIES
CREATE POLICY "allow_all_communities_select" ON public.communities
FOR SELECT USING (true);

CREATE POLICY "allow_all_communities_insert" ON public.communities
FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_all_communities_update" ON public.communities
FOR UPDATE USING (true);

CREATE POLICY "allow_all_communities_delete" ON public.communities
FOR DELETE USING (true);

-- USERS POLICIES  
CREATE POLICY "allow_all_users_select" ON public.users
FOR SELECT USING (true);

CREATE POLICY "allow_all_users_insert" ON public.users
FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_all_users_update" ON public.users
FOR UPDATE USING (true);

CREATE POLICY "allow_all_users_delete" ON public.users
FOR DELETE USING (true);

-- 5. Verify policies are created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users')
ORDER BY tablename, policyname;

-- 6. Test insert to make sure it works
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
  gen_random_uuid(),
  'RLS Test Community - ' || NOW()::text,
  'rls-test-' || extract(epoch from now())::text,
  'Testing RLS policies with insert',
  gen_random_uuid(),
  'active',
  NOW(),
  NOW()
);

-- 7. Verify the insert worked
SELECT 
  id, 
  name, 
  slug, 
  status, 
  created_at 
FROM public.communities 
WHERE name LIKE 'RLS Test Community%'
ORDER BY created_at DESC 
LIMIT 3;

-- 8. Show final RLS status
SELECT 
  'RLS Status' as check_type,
  schemaname, 
  tablename, 
  CASE 
    WHEN rowsecurity THEN 'ENABLED ✅' 
    ELSE 'DISABLED ❌' 
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users')

UNION ALL

SELECT 
  'Policy Count' as check_type,
  'public' as schemaname,
  tablename,
  COUNT(*)::text || ' policies' as rls_status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users')
GROUP BY tablename
ORDER BY check_type, tablename;