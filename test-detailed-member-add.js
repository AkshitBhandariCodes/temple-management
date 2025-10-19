// Detailed Member Addition Test
async function testDetailedMemberAdd() {
    console.log('🔍 Detailed Member Addition Test...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get a community
        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();
        const testCommunity = communitiesData.data[0];

        console.log('📋 Using community:', testCommunity.name);
        console.log('🆔 Community ID:', testCommunity.id);

        // Check initial member count
        console.log('\n1️⃣ Initial member count...');
        const initialResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const initialData = await initialResponse.json();
        console.log('📊 Initial members:', initialData.data?.length || 0);

        // Add a member with detailed logging
        console.log('\n2️⃣ Adding member with detailed logging...');
        const timestamp = Date.now();
        const newMember = {
            user_id: `test-user-${timestamp}`,
            role: 'member',
            email: `test.member.${timestamp}@temple.com`,
            full_name: `Test Member ${timestamp}`
        };

        console.log('📤 Sending member data:', newMember);

        const addResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember)
        });

        const addData = await addResponse.json();

        console.log('\n📥 Full add response:');
        console.log('- Status:', addResponse.status);
        console.log('- Headers:', Object.fromEntries(addResponse.headers.entries()));
        console.log('- Response body:', JSON.stringify(addData, null, 2));

        if (addData.success) {
            console.log('\n✅ Member addition reported as successful');

            // Wait a moment then check again
            console.log('\n3️⃣ Waiting 2 seconds then checking member list...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            const verifyResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
            const verifyData = await verifyResponse.json();

            console.log('📊 Members after addition:', verifyData.data?.length || 0);

            if (verifyData.data && verifyData.data.length > 0) {
                console.log('\n👥 All members:');
                verifyData.data.forEach((member, index) => {
                    console.log(`${index + 1}. ID: ${member.id}, User ID: ${member.user_id}, Role: ${member.role}, Status: ${member.status}`);
                });

                // Look for our specific member
                const ourMember = verifyData.data.find(m => m.user_id === newMember.user_id);
                if (ourMember) {
                    console.log('\n✅ Our member found:', ourMember);
                } else {
                    console.log('\n❌ Our member not found in list');
                }
            } else {
                console.log('\n❌ No members found in list');
            }

        } else {
            console.log('\n❌ Member addition failed:', addData.message);
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testDetailedMemberAdd().catch(console.error);