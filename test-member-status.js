// Test Member Status Issue
async function testMemberStatus() {
    console.log('🔍 Testing Member Status Issue...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get a community
        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();
        const testCommunity = communitiesData.data[0];

        console.log('📋 Using community:', testCommunity.name);

        // Test different status filters
        console.log('\n1️⃣ Testing different status filters...');

        // Test with default (active)
        const activeResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const activeData = await activeResponse.json();
        console.log('📊 Active members:', activeData.data?.length || 0);

        // Test with all statuses
        const allResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members?status=all`);
        const allData = await allResponse.json();
        console.log('📊 All members:', allData.data?.length || 0);

        if (allData.data && allData.data.length > 0) {
            console.log('\n👥 Found members with status=all:');
            allData.data.forEach((member, index) => {
                console.log(`${index + 1}. ID: ${member.id}, User: ${member.user_id}, Status: ${member.status}, Role: ${member.role}`);
            });
        }

        // Add a member and immediately check
        console.log('\n2️⃣ Adding member and checking immediately...');
        const timestamp = Date.now();
        const newMember = {
            user_id: `test-user-${timestamp}`,
            role: 'member',
            email: `test.member.${timestamp}@temple.com`,
            full_name: `Test Member ${timestamp}`
        };

        const addResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember)
        });

        const addData = await addResponse.json();
        console.log('📤 Add result:', addData.success ? 'Success' : 'Failed');

        if (addData.success) {
            console.log('📝 Added member data:', addData.data);

            // Check immediately with all statuses
            const immediateResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members?status=all`);
            const immediateData = await immediateResponse.json();
            console.log('📊 Members immediately after add:', immediateData.data?.length || 0);

            if (immediateData.data && immediateData.data.length > 0) {
                const ourMember = immediateData.data.find(m => m.user_id === newMember.user_id);
                if (ourMember) {
                    console.log('✅ Found our member:', ourMember);
                } else {
                    console.log('❌ Our member not found');
                }
            }
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testMemberStatus().catch(console.error);