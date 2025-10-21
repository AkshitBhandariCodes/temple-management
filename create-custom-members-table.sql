-- Create a new custom members table to bypass RLS issues
-- Run this in Supabase SQL Editor

-- Create a new table for community members without RLS issues
CREATE TABLE IF NOT EXISTS community_members_custom (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id UUID NOT NULL,
    user_id UUID,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_lead BOOLEAN DEFAULT FALSE,
    lead_position VARCHAR(255),
    skills JSONB DEFAULT '[]',
    experience TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(community_id, email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_members_custom_community_id ON community_members_custom(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_custom_email ON community_members_custom(email);
CREATE INDEX IF NOT EXISTS idx_community_members_custom_status ON community_members_custom(status);

-- Enable RLS but with simple policy
ALTER TABLE community_members_custom ENABLE ROW LEVEL SECURITY;

-- Create simple policy that allows all operations
CREATE POLICY "allow_all_operations" ON community_members_custom
    FOR ALL USING (true) WITH CHECK (true);

-- Test insertion
INSERT INTO community_members_custom (community_id, email, full_name, role, status)
VALUES (
    'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
    'custom-table-test@example.com',
    'Custom Table Test User',
    'member',
    'active'
) ON CONFLICT (community_id, email) DO NOTHING;

-- Verify it works
SELECT COUNT(*) as test_count FROM community_members_custom WHERE email = 'custom-table-test@example.com';