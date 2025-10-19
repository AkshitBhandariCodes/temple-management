// Simple Members Test
async function testMembersSimple() {
    console.log('🧪 Simple Members Test...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        console.log('🆔 Community ID:', COMMUNITY_ID);

        // Test 1: Simple GET request
        console.log('\n1️⃣ Testing simple GET request...');

        const getResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`);
        console.log('📊 Response status:', getResponse.status);
        console.log('📊 Response headers:', Object.fromEntries(getResponse.headers.entries()));

        const getData = await getResponse.json();
        console.log('📊 Response data:', getData);

        // Test 2: Simple POST request
        console.log('\n2️⃣ Testing simple POST request...');

        const memberData = {
            user_id: `simple-test-${Date.now()}`,
            role: 'member',
            email: `simple@test.com`,
            full_name: 'Simple Test'
        };

        console.log('📤 Sending data:', memberData);

        const postResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });

        console.log('📊 POST Response status:', postResponse.status);
        console.log('📊 POST Response headers:', Object.fromEntries(postResponse.headers.entries()));

        const postData = await postResponse.json();
        console.log('📊 POST Response data:', postData);

        // Test 3: Check again after POST
        console.log('\n3️⃣ Checking GET again after POST...');

        const getResponse2 = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`);
        const getData2 = await getResponse2.json();

        console.log('📊 GET after POST:', {
            status: getResponse2.status,
            success: getData2.success,
            count: getData2.data?.length || 0,
            data: getData2.data
        });

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testMembersSimple().catch(console.error);