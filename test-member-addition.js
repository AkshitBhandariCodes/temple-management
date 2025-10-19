// Test Member Addition After Creating Tables
async function testMemberAddition() {
    console.log('🧪 Testing Member Addition...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get a community to test with
        console.log('1️⃣ Getting communities...');
        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();

        if (!communitiesData.success || !communitiesData.data.length) {
            console.log('❌ No communities found');
            return;
        }

        const testCommunity = communitiesData.data[0];
        console.log('✅ Using community:', testCommunity.name);
        console.log('📋 Community ID:', testCommunity.id);

        // Test 1: Get current members
        console.log('\n2️⃣ Getting current members...');
        const membersResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const membersData = await membersResponse.json();

        console.log('📊 Current members count:', membersData.success ? membersData.data.length : 'Error');
        if (!membersData.success) {
            console.log('❌ Error getting members:', membersData.message);
        }

        // Test 2: Add a new member
        console.log('\n3️⃣ Adding a new member...');
        const timestamp = Date.now();
        const newMember = {
            user_id: `test-user-${timestamp}`,
            role: 'member',
            email: `test.member.${timestamp}@temple.com`,
            full_name: `Test Member ${timestamp}`
        };

        console.log('👤 Adding member:', newMember.full_name);

        const addResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember)
        });

        const addData = await addResponse.json();

        console.log('📥 Add member response:');
        console.log('- Status:', addResponse.status);
        console.log('- Success:', addData.success);
        console.log('- Message:', addData.message);

        if (addData.success) {
            console.log('✅ Member added successfully!');
            console.log('📝 Member ID:', addData.data?.id);

            // Test 3: Verify member appears in list
            console.log('\n4️⃣ Verifying member appears in list...');

            const verifyResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
                const foundMember = verifyData.data.find(m => m.id === addData.data.id);

                if (foundMember) {
                    console.log('✅ Member found in list!');
                    console.log('📊 Total members now:', verifyData.data.length);
                    console.log('👤 Member details:', {
                        id: foundMember.id,
                        user_id: foundMember.user_id,
                        role: foundMember.role,
                        status: foundMember.status
                    });
                } else {
                    console.log('❌ Member not found in list');
                }
            } else {
                console.log('❌ Error verifying members:', verifyData.message);
            }

        } else {
            console.log('❌ Failed to add member');
            console.log('🔍 Error details:', addData.error || addData.message);

            if (addData.message?.includes('table') || addData.message?.includes('schema')) {
                console.log('\n💡 TABLE MISSING ERROR DETECTED!');
                console.log('📋 TO FIX:');
                console.log('1. Go to Supabase Dashboard → SQL Editor');
                console.log('2. Copy and run the ENTIRE create-missing-tables.sql file');
                console.log('3. Wait for it to complete');
                console.log('4. Run this test again');
            }
        }

        console.log('\n🎉 Member Addition Test Complete!');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testMemberAddition().catch(console.error);