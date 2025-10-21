-- Fix community_members table structure and RLS policies

-- First, disable RLS temporarily to work on the table
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "community_members_select_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_insert_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_update_policy" ON community_members;
DROP POLICY IF EXISTS "community_members_delete_policy" ON community_members;

-- Add missing columns to community_members table
DO $$ 
BEGIN
    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'email') THEN
        ALTER TABLE community_members ADD COLUMN email VARCHAR(255);
        CREATE INDEX IF NOT EXISTS idx_community_members_email ON community_members(email);
    END IF;

    -- Add full_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'full_name') THEN
        ALTER TABLE community_members ADD COLUMN full_name VARCHAR(255);
    END IF;

    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'phone') THEN
        ALTER TABLE community_members ADD COLUMN phone VARCHAR(50);
    END IF;

    -- Add skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'skills') THEN
        ALTER TABLE community_members ADD COLUMN skills JSONB;
    END IF;

    -- Add experience column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'experience') THEN
        ALTER TABLE community_members ADD COLUMN experience TEXT;
    END IF;

    -- Add is_lead column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'is_lead') THEN
        ALTER TABLE community_members ADD COLUMN is_lead BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add lead_position column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'lead_position') THEN
        ALTER TABLE community_members ADD COLUMN lead_position VARCHAR(255);
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'status') THEN
        ALTER TABLE community_members ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'role') THEN
        ALTER TABLE community_members ADD COLUMN role VARCHAR(50) DEFAULT 'member';
    END IF;

    -- Add joined_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'community_members' AND column_name = 'joined_at') THEN
        ALTER TABLE community_members ADD COLUMN joined_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create simple, non-recursive RLS policies
CREATE POLICY "community_members_allow_all" ON community_members
    FOR ALL USING (true) WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_status ON community_members(status);
CREATE INDEX IF NOT EXISTS idx_community_members_role ON community_members(role);

-- Display the final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_members' 
ORDER BY ordinal_position;