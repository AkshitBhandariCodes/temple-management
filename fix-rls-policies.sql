-- Fix RLS Policy Issues
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "allow_all_community_members_select" ON public.community_members;
DROP POLICY IF EXISTS "allow_all_community_members_insert" ON public.community_members;
DROP POLICY IF EXISTS "allow_all_community_members_update" ON public.community_members;
DROP POLICY IF EXISTS "allow_all_community_members_delete" ON public.community_members;

DROP POLICY IF EXISTS "communities_select_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_insert_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_update_policy" ON public.communities;
DROP POLICY IF EXISTS "communities_delete_policy" ON public.communities;

-- 2. Create simple, non-recursive policies
-- Communities policies
CREATE POLICY "simple_communities_select" ON public.communities FOR SELECT USING (true);
CREATE POLICY "simple_communities_insert" ON public.communities FOR INSERT WITH CHECK (true);
CREATE POLICY "simple_communities_update" ON public.communities FOR UPDATE USING (true);
CREATE POLICY "simple_communities_delete" ON public.communities FOR DELETE USING (true);

-- Community members policies
CREATE POLICY "simple_members_select" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "simple_members_insert" ON public.community_members FOR INSERT WITH CHECK (true);
CREATE POLICY "simple_members_update" ON public.community_members FOR UPDATE USING (true);
CREATE POLICY "simple_members_delete" ON public.community_members FOR DELETE USING (true);

-- 3. Verify policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('communities', 'community_members')
ORDER BY tablename, policyname;

-- 4. Test community insert
INSERT INTO public.communities (
  name,
  slug,
  description,
  owner_id,
  status,
  member_count
) VALUES (
  'RLS Fixed Test Community',
  'rls-fixed-test',
  'Testing after RLS policy fix',
  gen_random_uuid(),
  'active',
  0
) ON CONFLICT (slug) DO NOTHING;

-- 5. Verify insert worked
SELECT 
  id,
  name,
  slug,
  status,
  created_at
FROM public.communities 
WHERE slug = 'rls-fixed-test';