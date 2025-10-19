const axios = require('axios');

async function testAPIEndpoint() {
    try {
        console.log('🧪 Testing API endpoint...');

        const applicationData = {
            user_id: null,
            email: 'api-test@example.com',
            name: 'API Test User',
            phone: '+1-555-0123',
            message: 'Testing API endpoint',
            why_join: 'API testing',
            skills: ['testing'],
            experience: 'API testing experience'
        };

        console.log('📤 Sending request to:', 'http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/apply');
        console.log('📦 Request body:', applicationData);

        const response = await axios.post(
            'http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/apply',
            applicationData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Success! Response:', response.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);

        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        }
    }
}

testAPIEndpoint();