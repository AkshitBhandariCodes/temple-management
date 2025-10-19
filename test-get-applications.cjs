const axios = require('axios');

async function testGetApplications() {
    try {
        console.log('🧪 Testing GET applications endpoint...');

        const response = await axios.get(
            'http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/applications'
        );

        console.log('✅ Success! Applications found:', response.data.data.length);
        console.log('📊 Response:', response.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testGetApplications();