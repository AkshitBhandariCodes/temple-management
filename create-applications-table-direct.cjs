require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('Creating community applications table...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
    try {
        // Create the table using direct SQL
        const { data, error } = await supabase
            .from('community_applications')
            .select('*')
            .limit(1);

        if (error && error.code === 'PGRST116') {
            console.log('Table does not exist, creating it...');

            // Since we can't execute DDL directly, let's create a test record to see if table exists
            // If it fails, we know the table doesn't exist
            console.log('⚠️ Cannot create table via API. Please run the SQL manually in Supabase dashboard:');
            console.log(`
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_applications_community_id ON community_applications(community_id);
CREATE INDEX IF NOT EXISTS idx_community_applications_status ON community_applications(status);
CREATE INDEX IF NOT EXISTS idx_community_applications_user_id ON community_applications(user_id);

-- Enable RLS
ALTER TABLE community_applications ENABLE ROW LEVEL SECURITY;
      `);
        } else if (error) {
            console.error('Error checking table:', error);
        } else {
            console.log('✅ Table already exists');
        }
    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createTable();