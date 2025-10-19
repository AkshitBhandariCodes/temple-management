require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplicationsSchema() {
    try {
        console.log('🔍 Checking community_applications table schema...');

        // Get a sample record to see the structure
        const { data, error } = await supabase
            .from('community_applications')
            .select('*')
            .limit(1);

        if (error) {
            console.log('Error:', error);
        } else if (data && data.length > 0) {
            console.log('✅ Sample record structure:');
            console.log('Columns:', Object.keys(data[0]));
            console.log('Sample data:', data[0]);
        } else {
            console.log('No data found in table');
        }

        // Test a simple update
        console.log('\n🧪 Testing simple update...');
        const { data: updateData, error: updateError } = await supabase
            .from('community_applications')
            .update({ status: 'pending' })
            .eq('status', 'pending')
            .select('*')
            .limit(1);

        if (updateError) {
            console.log('Update error:', updateError);
        } else {
            console.log('✅ Update test successful');
        }

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

checkApplicationsSchema();