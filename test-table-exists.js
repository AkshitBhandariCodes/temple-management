// Test if community_members table exists
async function testTableExists() {
    console.log('🔍 Testing if community_members table exists...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get a community
        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();
        const testCommunity = communitiesData.data[0];

        console.log('📋 Testing with community:', testCommunity.name);
        console.log('🆔 Community ID:', testCommunity.id);

        // Try to get members (this will show if table exists)
        console.log('\n🔍 Checking if community_members table exists...');

        const membersResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const membersData = await membersResponse.json();

        console.log('📊 Members response:');
        console.log('- Status:', membersResponse.status);
        console.log('- Success:', membersData.success);
        console.log('- Data length:', membersData.data?.length);
        console.log('- Error:', membersData.error);

        if (membersData.success) {
            console.log('✅ community_members table EXISTS and is accessible');
            console.log('📋 Current members:', membersData.data.length);

            if (membersData.data.length > 0) {
                console.log('👤 Sample member:', membersData.data[0]);
            }
        } else {
            console.log('❌ community_members table issue:', membersData.message);

            if (membersData.message?.includes('table') || membersData.message?.includes('schema')) {
                console.log('\n🚨 TABLE MISSING!');
                console.log('📋 You need to run create-missing-tables.sql in Supabase Dashboard');
            }
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testTableExists().catch(console.error);