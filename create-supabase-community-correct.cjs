require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCommunity() {
    try {
        console.log('🏗️ Creating community in Supabase...');

        // First check existing community structure
        const { data: existing, error: existingError } = await supabase
            .from('communities')
            .select('*')
            .limit(1);

        console.log('Existing community structure:', existing?.[0]);

        // Create with minimal required fields
        const { data, error } = await supabase
            .from('communities')
            .insert({
                id: 'cb9d0802-1664-4a83-a0af-8a1444919d47',
                name: 'HELLO THIS IS TESTING COMMUNITY 2'
            })
            .select('*')
            .single();

        if (error) {
            console.error('Error creating community:', error);
        } else {
            console.log('✅ Community created in Supabase:', data);
        }
    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createCommunity();