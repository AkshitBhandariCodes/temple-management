-- Create budget_requests table directly in Supabase
-- Copy and paste this entire SQL block into your Supabase SQL Editor and run it

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS budget_requests;

-- Create budget_requests table
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

-- Create indexes for better performance
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
    2500.00,
    'Food and refreshments for community meeting',
    'Monthly Community Gathering',
    'pending'
);

-- Verify table creation
SELECT 'Budget requests table created successfully!' as message;
SELECT COUNT(*) as sample_records FROM budget_requests;