const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function checkCommunityMembersSchema() {
    console.log('🔍 Checking community_members table schema...\n');

    try {
        // Try to get the table structure by querying with limit 0
        const { data, error } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error accessing community_members table:', error);
            return;
        }

        console.log('✅ community_members table exists');

        if (data && data.length > 0) {
            console.log('📋 Sample record structure:');
            console.log(JSON.stringify(data[0], null, 2));
            console.log('\n📊 Available columns:', Object.keys(data[0]));
        } else {
            console.log('📊 Table is empty, checking with insert to see required fields...');

            // Try a test insert to see what fields are required/available
            const testData = {
                community_id: '00000000-0000-0000-0000-000000000000',
                user_id: '00000000-0000-0000-0000-000000000000',
                email: 'test@example.com',
                full_name: 'Test User',
                role: 'member',
                status: 'active'
            };

            const { error: insertError } = await supabase
                .from('community_members')
                .insert(testData);

            if (insertError) {
                console.log('📋 Insert error reveals schema info:', insertError.message);

                // Extract column info from error message
                if (insertError.message.includes('column')) {
                    console.log('💡 This tells us about the table structure');
                }
            }
        }

    } catch (error) {
        console.error('❌ Failed to check schema:', error.message);
    }
}

checkCommunityMembersSchema();