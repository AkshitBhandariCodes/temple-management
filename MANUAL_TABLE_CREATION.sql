-- MANUAL TABLE CREATION FOR BUDGET REQUESTS
-- Copy and paste this SQL into your Supabase SQL Editor

-- Create budget_requests table
CREATE TABLE IF NOT EXISTS budget_requests (
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
CREATE INDEX IF NOT EXISTS idx_budget_requests_community_id ON budget_requests(community_id);
CREATE INDEX IF NOT EXISTS idx_budget_requests_status ON budget_requests(status);
CREATE INDEX IF NOT EXISTS idx_budget_requests_created_at ON budget_requests(created_at);

-- Insert sample data for testing
INSERT INTO budget_requests (
    community_id, 
    budget_amount, 
    purpose, 
    event_name, 
    documents,
    status
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    5000.00,
    'Sound system and decorations for Diwali celebration',
    'Diwali Festival 2025',
    '[{"name": "sound_system_quote.pdf", "url": "/uploads/quotes/sound_quote.pdf"}, {"name": "decoration_receipt.jpg", "url": "/uploads/receipts/decoration.jpg"}]'::jsonb,
    'pending'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    2500.00,
    'Food and refreshments for community meeting',
    'Monthly Community Gathering',
    '[{"name": "catering_quote.pdf", "url": "/uploads/quotes/catering.pdf"}]'::jsonb,
    'pending'
);

-- Verify table creation
SELECT 'Budget requests table created successfully' as message;
SELECT COUNT(*) as sample_records FROM budget_requests;