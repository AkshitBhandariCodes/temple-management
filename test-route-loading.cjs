const axios = require('axios');

async function testRouteLoading() {
    console.log('🔍 Testing Route Loading...\n');

    try {
        // Test a simple GET to see if server is responding
        console.log('1️⃣ Testing server health...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Server is running:', healthResponse.data.status);

        // Test if our new routes are accessible
        console.log('\n2️⃣ Testing route accessibility...');

        // This should hit our frontend-compatible route
        try {
            await axios.put(
                'http://localhost:5000/api/communities/test/applications/test/approve',
                { reviewed_by: null }
            );
        } catch (error) {
            console.log('Route response status:', error.response?.status);
            console.log('Route response error:', error.response?.data);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testRouteLoading();