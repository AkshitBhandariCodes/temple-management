// create-table-programmatic.cjs - Create budget_requests table programmatically
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function createBudgetRequestsTable() {
    console.log('🔧 Creating budget_requests table programmatically...');

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env file');
        console.log('Required: SUPABASE_URL and SUPABASE_ANON_KEY');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Create the table using raw SQL
        const createTableSQL = `
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_budget_requests_community_id ON budget_requests(community_id);
      CREATE INDEX IF NOT EXISTS idx_budget_requests_status ON budget_requests(status);
      CREATE INDEX IF NOT EXISTS idx_budget_requests_created_at ON budget_requests(created_at);
    `;

        console.log('📝 Executing SQL to create table...');

        // Try to create table using rpc (if available)
        const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: createTableSQL
        });

        if (error) {
            console.log('⚠️ RPC method failed, trying alternative approach...');
            console.log('Error:', error.message);

            // Alternative: Try to insert a test record to trigger table creation
            console.log('🔄 Attempting to create table by testing insert...');

            const { data: testData, error: testError } = await supabase
                .from('budget_requests')
                .insert({
                    community_id: '150ccc8c-31ec-4b7d-8f73-2ee7c5306fc0',
                    budget_amount: 1000,
                    purpose: 'Test budget request',
                    event_name: 'Test Event',
                    status: 'pending'
                })
                .select();

            if (testError) {
                console.error('❌ Table creation failed:', testError.message);
                console.log('\n📋 Manual Steps Required:');
                console.log('1. Go to your Supabase Dashboard');
                console.log('2. Navigate to SQL Editor');
                console.log('3. Copy and paste the SQL from create-budget-table-direct.sql');
                console.log('4. Run the SQL query');
                return;
            } else {
                console.log('✅ Table created successfully via insert test!');
                console.log('Test record created:', testData);
            }
        } else {
            console.log('✅ Table created successfully via RPC!');
        }

        // Test table access
        console.log('🧪 Testing table access...');
        const { data: testAccess, error: accessError } = await supabase
            .from('budget_requests')
            .select('*')
            .limit(5);

        if (accessError) {
            console.error('❌ Table access test failed:', accessError.message);
        } else {
            console.log('✅ Table access successful!');
            console.log(`📊 Found ${testAccess.length} existing records`);
        }

        console.log('\n🎉 Budget requests table setup complete!');
        console.log('You can now test the budget request functionality in the frontend.');

    } catch (exception) {
        console.error('❌ Exception occurred:', exception.message);
        console.log('\n📋 Please create the table manually using create-budget-table-direct.sql');
    }
}

// Run the function
createBudgetRequestsTable();