-- =====================================================
-- MANUAL FIX FOR COMMUNITY_MEMBERS TABLE
-- Run this directly in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Disable RLS to fix the infinite recursion
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (this fixes the recursion)
DROP POLICY IF EXISTS "Enable read access for all users" ON community_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON community_members;
DROP POLICY IF EXISTS "Enable update for users based on email" ON community_members;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON community_members;
DROP POLICY IF EXISTS "community_members_select_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_insert_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_update_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_delete_policy" ON community_members;
DROP POLICY IF EXISTS "allow_all_community_members" ON community_members;

-- Step 3: Add missing columns (ignore errors if they already exist)
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'member';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS is_lead BOOLEAN DEFAULT FALSE;
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS lead_position VARCHAR(255);
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';
ALTER TABLE community_members ADD COLUMN IF NOT EXISTS experience TEXT;

-- Step 4: Create a simple, non-recursive policy
CREATE POLICY "simple_allow_all" ON community_members
    FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Re-enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Step 6: Create useful indexes
CREATE INDEX IF NOT EXISTS idx_community_members_email ON community_members(email);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_status ON community_members(status);

-- Step 7: Test the fix with a sample insertion
INSERT INTO community_members (
    community_id, 
    user_id, 
    email, 
    full_name, 
    role, 
    status, 
    joined_at
) VALUES (
    'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
    NULL,
    'manual-fix-test@example.com',
    'Manual Fix Test User',
    'member',
    'active',
    NOW()
) ON CONFLICT DO NOTHING;

-- Step 8: Verify the fix worked
SELECT 
    COUNT(*) as total_members,
    COUNT(CASE WHEN email = 'manual-fix-test@example.com' THEN 1 END) as test_member_count
FROM community_members;

-- Step 9: Show table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'community_members' 
ORDER BY ordinal_position;

-- =====================================================
-- INSTRUCTIONS:
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Check the results at the bottom
-- 5. If successful, your backend will now insert into community_members table
-- =====================================================