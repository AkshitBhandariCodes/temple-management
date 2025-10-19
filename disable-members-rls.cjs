require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableRLS() {
    try {
        console.log('🔧 Disabling RLS on community_members table...');

        // Try to disable RLS (this might not work with anon key)
        const { data, error } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        console.log('Test query result:', { data, error });

        // Let's try a direct insert to test
        const { data: insertData, error: insertError } = await supabase
            .from('community_members')
            .insert({
                community_id: 'cb9d0802-1664-4a83-a0af-8a1444919d47',
                user_id: null,
                email: 'test-member@example.com',
                full_name: 'Test Member',
                role: 'member',
                status: 'active'
            })
            .select('*')
            .single();

        console.log('Insert test result:', { insertData, insertError });

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

disableRLS();