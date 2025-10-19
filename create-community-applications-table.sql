-- Create community applications table
CREATE TABLE IF NOT EXISTS community_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_community_applications_community_id ON community_applications(community_id);
CREATE INDEX IF NOT EXISTS idx_community_applications_status ON community_applications(status);
CREATE INDEX IF NOT EXISTS idx_community_applications_user_id ON community_applications(user_id);

-- Enable RLS
ALTER TABLE community_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view applications for communities they manage" ON community_applications
  FOR SELECT USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE created_by = auth.uid()::text 
      OR id IN (
        SELECT community_id FROM community_members 
        WHERE user_id = auth.uid()::text 
        AND role IN ('admin', 'moderator')
      )
    )
  );

CREATE POLICY "Users can insert their own applications" ON community_applications
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Community managers can update applications" ON community_applications
  FOR UPDATE USING (
    community_id IN (
      SELECT id FROM communities 
      WHERE created_by = auth.uid()::text 
      OR id IN (
        SELECT community_id FROM community_members 
        WHERE user_id = auth.uid()::text 
        AND role IN ('admin', 'moderator')
      )
    )
  );