const axios = require('axios');

async function testFrontendAPI() {
    try {
        console.log('🧪 Testing frontend API calls...');

        // Test the community endpoint that frontend is likely calling
        console.log('1️⃣ Testing GET community by ID...');
        const communityResponse = await axios.get(
            'http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47'
        );
        console.log('✅ Community data:', communityResponse.data);

        // Test communities list endpoint
        console.log('\n2️⃣ Testing GET all communities...');
        const communitiesResponse = await axios.get(
            'http://localhost:5000/api/communities'
        );
        console.log('✅ Communities list:', communitiesResponse.data.data?.length || 0, 'communities found');

        // Test members endpoint
        console.log('\n3️⃣ Testing GET community members...');
        const membersResponse = await axios.get(
            'http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/members'
        );
        console.log('✅ Members data:', membersResponse.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.status, error.response?.data || error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('🔥 Backend server is not running! Start it with: npm start');
        }
    }
}

testFrontendAPI();