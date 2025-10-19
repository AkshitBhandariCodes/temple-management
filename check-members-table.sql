-- Check if community_members table exists and create if needed
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Check if table exists
SELECT 
  table_name,
  'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'community_members';

-- 2. If table doesn't exist, create it
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

-- 3. Disable RLS for testing
ALTER TABLE public.community_members DISABLE ROW LEVEL SECURITY;

-- 4. Test insert
INSERT INTO public.community_members (
  community_id,
  user_id,
  role,
  status
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'sql-test-user',
  'member',
  'active'
) ON CONFLICT DO NOTHING;

-- 5. Verify insert worked
SELECT 
  id,
  community_id,
  user_id,
  role,
  status,
  joined_at
FROM public.community_members 
WHERE community_id = '12345678-1234-1234-1234-123456789abc';

-- 6. Show table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'community_members'
ORDER BY ordinal_position;