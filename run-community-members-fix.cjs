const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

async function runCommunityMembersFix() {
    console.log('🔧 Fixing community_members table schema and RLS...\n');

    try {
        // Read the SQL file
        const sqlContent = fs.readFileSync('fix-community-members-table.sql', 'utf8');

        // Split into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Executing ${statements.length} SQL statements...\n`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`${i + 1}. Executing: ${statement.substring(0, 50)}...`);
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });

                    if (error) {
                        console.log(`   ⚠️ Warning: ${error.message}`);
                    } else {
                        console.log(`   ✅ Success`);
                    }
                } catch (err) {
                    console.log(`   ⚠️ Error: ${err.message}`);
                }
            }
        }

        console.log('\n🔍 Checking final table structure...');

        // Test the table access
        const { data, error } = await supabase
            .from('community_members')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Still having issues:', error.message);
        } else {
            console.log('✅ community_members table is now accessible!');
            if (data && data.length > 0) {
                console.log('📋 Sample record:', data[0]);
            } else {
                console.log('📊 Table is empty but accessible');
            }
        }

    } catch (error) {
        console.error('❌ Failed to fix table:', error.message);
    }
}

runCommunityMembersFix();