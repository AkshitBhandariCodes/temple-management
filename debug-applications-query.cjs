require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugApplicationsQuery() {
    try {
        const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

        console.log('🔍 Debugging Applications Query...');
        console.log('🆔 Community ID:', FRONTEND_COMMUNITY_ID);

        // 1. Direct Supabase query
        console.log('\n1️⃣ Direct Supabase query...');
        const { data: directData, error: directError } = await supabase
            .from('community_applications')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID);

        console.log('Direct query result:', {
            count: directData?.length || 0,
            error: directError,
            sample: directData?.[0]
        });

        // 2. Query with status filter
        console.log('\n2️⃣ Query with status filters...');

        const { data: pendingData } = await supabase
            .from('community_applications')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID)
            .eq('status', 'pending');

        const { data: approvedData } = await supabase
            .from('community_applications')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID)
            .eq('status', 'approved');

        console.log('Pending applications:', pendingData?.length || 0);
        console.log('Approved applications:', approvedData?.length || 0);

        // 3. Check if there are any applications at all for this community
        console.log('\n3️⃣ All applications for this community...');
        if (directData && directData.length > 0) {
            directData.forEach((app, index) => {
                console.log(`App ${index + 1}:`, {
                    id: app.id,
                    status: app.status,
                    name: app.name,
                    email: app.email,
                    applied_at: app.applied_at
                });
            });
        } else {
            console.log('No applications found for this community');
        }

        // 4. Check if the community exists in applications table
        console.log('\n4️⃣ Checking all communities in applications...');
        const { data: allCommunities } = await supabase
            .from('community_applications')
            .select('community_id')
            .limit(10);

        const uniqueCommunities = [...new Set(allCommunities?.map(app => app.community_id))];
        console.log('Communities with applications:', uniqueCommunities);
        console.log('Frontend community in list:', uniqueCommunities.includes(FRONTEND_COMMUNITY_ID));

    } catch (err) {
        console.error('Debug error:', err.message);
    }
}

debugApplicationsQuery();