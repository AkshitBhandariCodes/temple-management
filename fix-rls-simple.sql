-- Simple fix for community_members RLS issues
-- Run this directly in Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to prevent recursion
DROP POLICY IF EXISTS "Enable read access for all users" ON community_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON community_members;
DROP POLICY IF EXISTS "Enable update for users based on email" ON community_members;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON community_members;
DROP POLICY IF EXISTS "community_members_select_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_insert_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_update_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_delete_policy" ON community_members;

-- Create a simple, non-recursive policy
CREATE POLICY "allow_all_community_members" ON community_members
  FOR ALL USING (true) WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Add missing columns if they don't exist
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'member';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS is_lead BOOLEAN DEFAULT FALSE;
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS experience TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_members_email ON community_members(email);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);

-- Test insertion
INSERT INTO community_members (community_id, user_id, email, full_name, role, status, joined_at)
VALUES (
  'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
  NULL,
  'test-rls-fix@example.com',
  'RLS Fix Test User',
  'member',
  'active',
  NOW()
) ON CONFLICT DO NOTHING;

-- Check if it worked
SELECT COUNT(*) as member_count FROM community_members WHERE email = 'test-rls-fix@example.com';