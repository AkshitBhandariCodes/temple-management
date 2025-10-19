require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTables() {
    try {
        console.log('🔍 Checking communities table...');

        // Check communities table
        const { data: communities, error: commError } = await supabase
            .from('communities')
            .select('id, name')
            .limit(5);

        console.log('Communities table result:', { communities, commError });

        // Check if our specific community exists
        const { data: specificCommunity, error: specError } = await supabase
            .from('communities')
            .select('*')
            .eq('id', 'cb9d0802-1664-4a83-a0af-8a1444919d47')
            .single();

        console.log('Specific community result:', { specificCommunity, specError });

        // Check community_applications table structure
        const { data: applications, error: appError } = await supabase
            .from('community_applications')
            .select('*')
            .limit(1);

        console.log('Applications table result:', { applications, appError });

    } catch (err) {
        console.error('Debug error:', err.message);
    }
}

debugTables();