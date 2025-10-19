-- =====================================================
-- SUPABASE RLS POLICIES SETUP - WORKING VERSION
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON public.communities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.communities;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.communities;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.communities;
DROP POLICY IF EXISTS "Allow all operations for service role" ON public.communities;
DROP POLICY IF EXISTS "Allow read access for all" ON public.communities;
DROP POLICY IF EXISTS "Allow insert for all" ON public.communities;
DROP POLICY IF EXISTS "Allow update for all" ON public.communities;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.users;
DROP POLICY IF EXISTS "Allow all operations for service role" ON public.users;
DROP POLICY IF EXISTS "Allow read access for all" ON public.users;
DROP POLICY IF EXISTS "Allow insert for all" ON public.users;
DROP POLICY IF EXISTS "Allow update for all" ON public.users;

-- 3. Create simple, working policies for COMMUNITIES table

-- Allow anyone to read communities
CREATE POLICY "communities_select_policy" ON public.communities
FOR SELECT USING (true);

-- Allow anyone to insert communities  
CREATE POLICY "communities_insert_policy" ON public.communities
FOR INSERT WITH CHECK (true);

-- Allow anyone to update communities
CREATE POLICY "communities_update_policy" ON public.communities
FOR UPDATE USING (true);

-- Allow anyone to delete communities
CREATE POLICY "communities_delete_policy" ON public.communities
FOR DELETE USING (true);

-- 4. Create simple, working policies for USERS table

-- Allow anyone to read users (you can restrict this later)
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT USING (true);

-- Allow anyone to insert users (for registration)
CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT WITH CHECK (true);

-- Allow anyone to update users (you can restrict this later)
CREATE POLICY "users_update_policy" ON public.users
FOR UPDATE USING (true);

-- Allow anyone to delete users (you can restrict this later)
CREATE POLICY "users_delete_policy" ON public.users
FOR DELETE USING (true);

-- 5. Verify policies are created correctly
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'HAS_CONDITION' 
    ELSE 'NO_CONDITION' 
  END as condition_type
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users')
ORDER BY tablename, policyname;

-- 6. Check RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'RLS_ENABLED' 
    ELSE 'RLS_DISABLED' 
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'users', 'community_members')
ORDER BY tablename;

-- 7. Test insert (should work now)
-- This is just a test - you can delete this record after
INSERT INTO public.communities (
  id,
  name,
  slug,
  description,
  owner_id,
  status
) VALUES (
  gen_random_uuid(),
  'RLS Test Community',
  'rls-test-community',
  'Testing RLS policies',
  gen_random_uuid(),
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- 8. Verify the test insert worked
SELECT id, name, slug, status, created_at 
FROM public.communities 
WHERE slug = 'rls-test-community';