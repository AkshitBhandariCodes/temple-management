require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    try {
        // Try to get table structure by attempting to insert with all possible fields
        const { data, error } = await supabase
            .from('community_applications')
            .select('*')
            .limit(1);

        console.log('Table query result:', { data, error });

        // Try to describe the table structure
        const { data: tableInfo, error: tableError } = await supabase
            .rpc('get_table_columns', { table_name: 'community_applications' });

        console.log('Table info:', { tableInfo, tableError });

    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkTable();