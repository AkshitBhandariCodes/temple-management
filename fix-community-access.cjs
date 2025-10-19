require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCommunityAccess() {
    try {
        console.log('🔧 Fixing community access...');

        // First, let's check if we can access the community
        const { data: community, error: commError } = await supabase
            .from('communities')
            .select('*')
            .eq('id', 'cb9d0802-1664-4a83-a0af-8a1444919d47')
            .single();

        console.log('Community access test:', { community: community?.name, error: commError });

        // Test application submission directly
        const { data: appData, error: appError } = await supabase
            .from('community_applications')
            .insert({
                community_id: 'cb9d0802-1664-4a83-a0af-8a1444919d47',
                user_id: null,
                email: 'test@example.com',
                name: 'Test User',
                message: 'Test application'
            })
            .select('*')
            .single();

        console.log('Direct application test:', { success: !!appData, error: appError });

        if (appData) {
            console.log('✅ Application created successfully:', appData.id);
        }

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

fixCommunityAccess();