require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMembersSchema() {
    try {
        console.log('🔍 Checking community_members table schema...');

        // Try to get existing data to see the structure
        const { data, error } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        console.log('Query result:', { data, error });

        if (error) {
            console.log('❌ Cannot query table:', error.message);

            // If it's RLS issue, try to see if we can get any info about the table
            if (error.message.includes('infinite recursion')) {
                console.log('🔄 RLS infinite recursion - need to fix policies');
            }
        } else if (data && data.length > 0) {
            console.log('✅ Table structure from existing data:');
            console.log('Columns:', Object.keys(data[0]));
            console.log('Sample record:', data[0]);
        } else {
            console.log('📋 Table exists but is empty');

            // Try a simple insert to see what columns are expected
            console.log('🧪 Testing insert to discover schema...');

            const testData = {
                community_id: '3e80bddc-1f83-4935-a0cc-9c48f86bcae7',
                user_id: 'test-user-id'
            };

            const { data: insertData, error: insertError } = await supabase
                .from('community_members')
                .insert(testData)
                .select('*')
                .single();

            if (insertError) {
                console.log('Insert error:', insertError.message);

                // Look for column name hints in the error
                if (insertError.message.includes('column')) {
                    console.log('💡 Column-related error - check the error message for expected columns');
                }
            } else {
                console.log('✅ Insert successful:', insertData);
                console.log('Columns:', Object.keys(insertData));

                // Clean up
                await supabase
                    .from('community_members')
                    .delete()
                    .eq('id', insertData.id);
            }
        }

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

checkMembersSchema();