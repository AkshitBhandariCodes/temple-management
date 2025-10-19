// Test if Member Route Exists
async function testRouteExists() {
    console.log('🧪 Testing if Member Route Exists...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        // Test 1: Try different HTTP methods to see what's available
        console.log('1️⃣ Testing different HTTP methods...');

        const methods = ['GET', 'POST', 'PUT', 'DELETE'];

        for (const method of methods) {
            try {
                const response = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: method === 'POST' || method === 'PUT' ? JSON.stringify({
                        user_id: 'test-user',
                        role: 'member'
                    }) : undefined
                });

                console.log(`   ${method}: ${response.status} ${response.statusText}`);

                if (response.status !== 404) {
                    const data = await response.json();
                    console.log(`      Response: ${JSON.stringify(data).substring(0, 100)}...`);
                }
            } catch (error) {
                console.log(`   ${method}: Error - ${error.message}`);
            }
        }

        // Test 2: Try the exact URL structure
        console.log('\n2️⃣ Testing exact URL structure...');

        const testUrls = [
            `${API_BASE}/communities/${COMMUNITY_ID}/members`,
            `${API_BASE}/communities/${COMMUNITY_ID}/member`,
            `${API_BASE}/community/${COMMUNITY_ID}/members`,
            `${API_BASE}/communities/members`,
        ];

        for (const url of testUrls) {
            try {
                const response = await fetch(url, { method: 'GET' });
                console.log(`   ${url}: ${response.status}`);
            } catch (error) {
                console.log(`   ${url}: Error`);
            }
        }

        // Test 3: Check if the route is using a different path
        console.log('\n3️⃣ Testing with OPTIONS to see available methods...');

        const optionsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
            method: 'OPTIONS'
        });

        console.log('   OPTIONS response:', optionsResponse.status);
        console.log('   Allow header:', optionsResponse.headers.get('Allow'));
        console.log('   Access-Control-Allow-Methods:', optionsResponse.headers.get('Access-Control-Allow-Methods'));

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testRouteExists().catch(console.error);