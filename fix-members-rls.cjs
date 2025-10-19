require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMembersRLS() {
    try {
        console.log('🔧 Attempting to fix community_members RLS issues...');

        // First, let's try to disable RLS temporarily to test
        console.log('1️⃣ Testing direct insert without RLS...');

        // Try a simple insert to see what happens
        const testMemberData = {
            community_id: '3e80bddc-1f83-4935-a0cc-9c48f86bcae7',
            user_id: null,
            email: 'rls-test@example.com',
            full_name: 'RLS Test User',
            role: 'member',
            status: 'active',
            joined_at: new Date().toISOString()
        };

        const { data: insertResult, error: insertError } = await supabase
            .from('community_members')
            .insert(testMemberData)
            .select('*')
            .single();

        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);

            // If it's the infinite recursion error, we need to check the policies
            if (insertError.message.includes('infinite recursion')) {
                console.log('🔄 Infinite recursion detected in RLS policies');
                console.log('This usually means the RLS policies are referencing each other in a loop');

                // Try to query without insert to see if we can read
                console.log('\n2️⃣ Testing read access...');
                const { data: readResult, error: readError } = await supabase
                    .from('community_members')
                    .select('*')
                    .limit(1);

                if (readError) {
                    console.log('❌ Read also fails:', readError.message);
                } else {
                    console.log('✅ Read works, issue is with insert/update policies');
                }
            }
        } else {
            console.log('✅ Insert successful:', insertResult.id);

            // Clean up the test record
            await supabase
                .from('community_members')
                .delete()
                .eq('id', insertResult.id);
            console.log('🧹 Test record cleaned up');
        }

        // Check if we can use a simpler approach - create members without complex RLS
        console.log('\n3️⃣ Testing alternative approach...');

        // Try creating with minimal data
        const minimalMemberData = {
            community_id: '3e80bddc-1f83-4935-a0cc-9c48f86bcae7',
            email: 'minimal-test@example.com',
            full_name: 'Minimal Test User'
        };

        const { data: minimalResult, error: minimalError } = await supabase
            .from('community_members')
            .insert(minimalMemberData)
            .select('*')
            .single();

        if (minimalError) {
            console.log('❌ Minimal insert failed:', minimalError.message);
        } else {
            console.log('✅ Minimal insert successful:', minimalResult.id);

            // Clean up
            await supabase
                .from('community_members')
                .delete()
                .eq('id', minimalResult.id);
        }

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

fixMembersRLS();