const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testMembersOnly() {
    console.log('🎯 Testing Members API Only...\n');

    try {
        console.log('📋 Fetching members for community:', FRONTEND_COMMUNITY_ID);

        const response = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`,
            {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Members API Response:', {
            success: response.data.success,
            count: response.data.data?.length || 0,
            total: response.data.total,
            status: response.status
        });

        if (response.data.data && response.data.data.length > 0) {
            console.log('👤 First member:', response.data.data[0]);
        }

        console.log('\n🎉 Members API is working correctly!');

    } catch (error) {
        console.error('❌ Members API Error:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);

        if (error.response?.data?.error) {
            console.error('Detailed Error:', error.response.data.error);
        }
    }
}

testMembersOnly();