// create-budget-table-simple.js - Create budget_requests table
const supabaseService = require('./backend/src/services/supabaseService');

async function createBudgetRequestsTable() {
    console.log('📋 Creating budget_requests table...');

    try {
        // Create the table using raw SQL
        const { data, error } = await supabaseService.client.rpc('exec_sql', {
            sql: `
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
      `
        });

        if (error) {
            console.error('❌ Error creating table:', error);

            // Try alternative approach - direct SQL execution
            console.log('🔄 Trying alternative approach...');

            const createTableSQL = `
        CREATE TABLE IF NOT EXISTS budget_requests (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            community_id UUID NOT NULL,
            budget_amount DECIMAL(12,2) NOT NULL,
            purpose TEXT NOT NULL,
            event_name VARCHAR(255),
            documents JSONB DEFAULT '[]'::jsonb,
            requested_by UUID,
            status VARCHAR(20) DEFAULT 'pending',
            approved_by UUID,
            rejected_by UUID,
            approved_amount DECIMAL(12,2),
            approval_notes TEXT,
            rejection_reason TEXT,
            reviewed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

            // Try using the from() method to create table
            const { error: createError } = await supabaseService.client
                .from('budget_requests')
                .select('*')
                .limit(1);

            if (createError && createError.message.includes('does not exist')) {
                console.log('✅ Table does not exist, this is expected');
                console.log('📝 Please create the table manually in Supabase dashboard with this SQL:');
                console.log(createTableSQL);
            }
        } else {
            console.log('✅ Budget requests table created successfully');
        }

        // Test table access
        console.log('🧪 Testing table access...');
        const { data: testData, error: testError } = await supabaseService.client
            .from('budget_requests')
            .select('*')
            .limit(1);

        if (testError) {
            console.error('❌ Table access test failed:', testError.message);
            console.log('📝 Manual table creation required');
        } else {
            console.log('✅ Table access test successful');
        }

    } catch (exception) {
        console.error('❌ Exception:', exception.message);
    }
}

createBudgetRequestsTable();