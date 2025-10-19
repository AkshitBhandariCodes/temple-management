require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMembersTable() {
    try {
        console.log('🔍 Checking community_members table...');

        // Try to get existing data to see structure
        const { data, error } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        console.log('Members table query:', { data, error });

        // Try a simple insert with minimal data
        const { data: insertData, error: insertError } = await supabase
            .from('community_members')
            .insert({
                community_id: 'cb9d0802-1664-4a83-a0af-8a1444919d47',
                user_id: null
            })
            .select('*')
            .single();

        console.log('Simple insert test:', { insertData, insertError });

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

checkMembersTable();