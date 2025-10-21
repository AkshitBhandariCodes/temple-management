const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key for admin operations
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

async function runMembersTableFix() {
    console.log('🔧 Fixing community_members table structure...\n');

    try {
        // Test current table access
        console.log('1️⃣ Testing current table access...');
        const { data: testData, error: testError } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        if (testError) {
            console.log('❌ Current table access error:', testError.message);
        } else {
            console.log('✅ Current table accessible, records:', testData?.length || 0);
            if (testData && testData.length > 0) {
                console.log('📋 Current columns:', Object.keys(testData[0]));
            }
        }

        // Try to add missing columns using individual ALTER statements
        console.log('\n2️⃣ Adding missing columns...');

        const columnsToAdd = [
            { name: 'email', type: 'VARCHAR(255)' },
            { name: 'full_name', type: 'VARCHAR(255)' },
            { name: 'phone', type: 'VARCHAR(50)' },
            { name: 'skills', type: 'JSONB' },
            { name: 'experience', type: 'TEXT' },
            { name: 'is_lead', type: 'BOOLEAN DEFAULT FALSE' },
            { name: 'lead_position', type: 'VARCHAR(255)' },
            { name: 'status', type: 'VARCHAR(50) DEFAULT \'active\'' },
            { name: 'role', type: 'VARCHAR(50) DEFAULT \'member\'' },
            { name: 'joined_at', type: 'TIMESTAMPTZ DEFAULT NOW()' }
        ];

        for (const column of columnsToAdd) {
            try {
                // Use raw SQL to add column
                const { error } = await supabase.rpc('exec_sql', {
                    sql: `ALTER TABLE community_members ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`
                });

                if (error) {
                    console.log(`   ⚠️ ${column.name}: ${error.message}`);
                } else {
                    console.log(`   ✅ ${column.name}: Added successfully`);
                }
            } catch (err) {
                console.log(`   ❌ ${column.name}: ${err.message}`);
            }
        }

        // Test table access after modifications
        console.log('\n3️⃣ Testing table access after modifications...');
        const { data: finalData, error: finalError } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        if (finalError) {
            console.log('❌ Final table access error:', finalError.message);
        } else {
            console.log('✅ Final table accessible');
            if (finalData && finalData.length > 0) {
                console.log('📋 Final columns:', Object.keys(finalData[0]));
            }
        }

        // Test inserting a member
        console.log('\n4️⃣ Testing member insertion...');
        const testMember = {
            community_id: 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
            user_id: null,
            email: 'test-member-insert@example.com',
            full_name: 'Test Member Insert',
            role: 'member',
            status: 'active',
            joined_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
            .from('community_members')
            .insert(testMember)
            .select('*')
            .single();

        if (insertError) {
            console.log('❌ Member insertion failed:', insertError.message);
        } else {
            console.log('✅ Member insertion successful:', insertData.id);

            // Clean up test member
            await supabase
                .from('community_members')
                .delete()
                .eq('id', insertData.id);
            console.log('🧹 Test member cleaned up');
        }

    } catch (error) {
        console.error('❌ Failed to fix table:', error.message);
    }
}

runMembersTableFix();