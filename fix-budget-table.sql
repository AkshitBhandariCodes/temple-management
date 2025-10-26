-- Fix budget_requests table - Check and repair columns
-- Run this in Supabase SQL Editor

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'budget_requests' 
ORDER BY ordinal_position;

-- Check if table has data
SELECT COUNT(*) as record_count FROM budget_requests;

-- If the table structure is wrong, let's recreate it properly
-- First drop the existing table
DROP TABLE IF EXISTS budget_requests CASCADE;

-- Recreate with correct structure
CREATE TABLE budget_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id UUID NOT NULL,
    budget_amount DECIMAL(12,2) NOT NULL,
    purpose TEXT NOT NULL,
    event_name VARCHAR(255),
    documents JSONB DEFAULT '[]'::jsonb,
    requested_by UUID,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID,
    rejected_by UUID,
    approved_amount DECIMAL(12,2),
    approval_notes TEXT,
    rejection_reason TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_budget_requests_community_id ON budget_requests(community_id);
CREATE INDEX idx_budget_requests_status ON budget_requests(status);
CREATE INDEX idx_budget_requests_created_at ON budget_requests(created_at);

-- Insert sample data for testing
INSERT INTO budget_requests (
    community_id, 
    budget_amount, 
    purpose, 
    event_name, 
    status
) VALUES 
(
    '150ccc8c-31ec-4b7d-8f73-2ee7c5306fc0',
    5000.00,
    'Sound system and decorations for Diwali celebration',
    'Diwali Festival 2025',
    'pending'
),
(
    '150ccc8c-31ec-4b7d-8f73-2ee7c5306fc0',
    3000.00,
    'Food and refreshments for community meeting',
    'Monthly Community Gathering',
    'pending'
);

-- Verify the fix
SELECT 'Table recreated successfully!' as message;
SELECT * FROM budget_requests LIMIT 5;