const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testApprovalDebug() {
    console.log('🔍 Debugging Approval Process...\n');

    try {
        // 1. Submit a fresh application
        console.log('1️⃣ Submitting fresh application...');
        const applicationData = {
            user_id: null,
            email: 'debug-test@example.com',
            name: 'Debug Test User',
            phone: '+1-555-DEBUG',
            message: 'Testing approval debug',
            why_join: 'Debug testing',
            skills: ['debugging'],
            experience: 'Debug testing experience'
        };

        const submitResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );

        console.log('✅ Application submitted:', submitResponse.data.data.id);
        const applicationId = submitResponse.data.data.id;

        // 2. Try to approve with detailed error handling
        console.log('\n2️⃣ Attempting approval...');
        try {
            const approveResponse = await axios.post(
                `${BASE_URL}/applications/${applicationId}/approve`,
                { reviewed_by: null },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                }
            );
            console.log('✅ Approval successful:', approveResponse.data);
        } catch (approvalError) {
            console.log('❌ Approval failed:');
            console.log('Status:', approvalError.response?.status);
            console.log('Error:', approvalError.response?.data);
            console.log('Full error:', approvalError.message);
        }

        // 3. Check application status
        console.log('\n3️⃣ Checking application status...');
        const statusResponse = await axios.get(`${BASE_URL}/applications/${applicationId}`);
        console.log('📋 Current status:', statusResponse.data.data.status);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testApprovalDebug();