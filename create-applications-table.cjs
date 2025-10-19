require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
    try {
        const sql = fs.readFileSync('create-community-applications-table.sql', 'utf8');
        console.log('Creating community applications table...');

        // Split SQL into individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
                if (error) {
                    console.error('Error executing statement:', error);
                }
            }
        }

        console.log('✅ Community applications table created successfully');
    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createTable();