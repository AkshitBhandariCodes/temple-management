require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCommunity() {
    try {
        console.log('🏗️ Creating community in Supabase...');

        const { data, error } = await supabase
            .from('communities')
            .insert({
                id: 'cb9d0802-1664-4a83-a0af-8a1444919d47',
                name: 'HELLO THIS IS TESTING COMMUNITY 2',
                slug: 'testing-community-2',
                description: 'A community for testing applications',
                owner_id: 'e69acf83-2731-4111-a98f-108e0d50b560'
            })
            .select('*')
            .single();

        if (error) {
            console.error('Error creating community:', error);
        } else {
            console.log('✅ Community created in Supabase:', data);
            console.log('\n🎯 Now use this URL in Postman:');
            console.log(`POST http://localhost:5000/api/communities/${data.id}/apply`);
        }
    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createCommunity();