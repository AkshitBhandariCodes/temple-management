-- Create budget_requests table for community budget management
CREATE TABLE IF NOT EXISTS budget_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    budget_amount DECIMAL(12,2) NOT NULL,
    purpose TEXT NOT NULL,
    event_name VARCHAR(255),
    documents JSONB DEFAULT '[]'::jsonb,
    requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
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
CREATE INDEX IF NOT EXISTS idx_budget_requests_requested_by ON budget_requests(requested_by);

-- Enable RLS (Row Level Security)
ALTER TABLE budget_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view budget requests for their communities" ON budget_requests
    FOR SELECT USING (
        community_id IN (
            SELECT community_id FROM community_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
        OR requested_by = auth.uid()
    );

CREATE POLICY "Community members can create budget requests" ON budget_requests
    FOR INSERT WITH CHECK (
        community_id IN (
            SELECT community_id FROM community_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Finance team can update budget requests" ON budget_requests
    FOR UPDATE USING (
        -- Allow finance team or community leads to approve/reject
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND (role = 'finance' OR role = 'admin')
        )
        OR community_id IN (
            SELECT community_id FROM community_members 
            WHERE user_id = auth.uid() AND is_lead = true AND status = 'active'
        )
    );

CREATE POLICY "Requesters can delete their own pending requests" ON budget_requests
    FOR DELETE USING (
        requested_by = auth.uid() AND status = 'pending'
    );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_budget_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_budget_requests_updated_at
    BEFORE UPDATE ON budget_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_requests_updated_at();

-- Insert some sample data for testing
INSERT INTO budget_requests (
    community_id, 
    budget_amount, 
    purpose, 
    event_name, 
    documents,
    requested_by,
    status
) VALUES 
(
    (SELECT id FROM communities LIMIT 1),
    5000.00,
    'Sound system and decorations for Diwali celebration',
    'Diwali Festival 2025',
    '[{"name": "sound_system_quote.pdf", "url": "/uploads/quotes/sound_quote.pdf"}, {"name": "decoration_receipt.jpg", "url": "/uploads/receipts/decoration.jpg"}]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    'pending'
),
(
    (SELECT id FROM communities LIMIT 1),
    2500.00,
    'Food and refreshments for community meeting',
    'Monthly Community Gathering',
    '[{"name": "catering_quote.pdf", "url": "/uploads/quotes/catering.pdf"}]'::jsonb,
    (SELECT id FROM users LIMIT 1),
    'pending'
);

COMMENT ON TABLE budget_requests IS 'Stores budget requests from communities for approval by finance team';
COMMENT ON COLUMN budget_requests.budget_amount IS 'Requested budget amount in decimal format';
COMMENT ON COLUMN budget_requests.purpose IS 'Detailed purpose/reason for the budget request';
COMMENT ON COLUMN budget_requests.event_name IS 'Name of the event if budget is for an event';
COMMENT ON COLUMN budget_requests.documents IS 'JSON array of document references (receipts, quotes, etc.)';
COMMENT ON COLUMN budget_requests.status IS 'Current status: pending, approved, or rejected';
COMMENT ON COLUMN budget_requests.approved_amount IS 'Final approved amount (may differ from requested amount)';