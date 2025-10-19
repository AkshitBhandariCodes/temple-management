const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testCompleteWorkflow() {
    console.log('🧪 Testing Complete Application Workflow...\n');

    try {
        // 1. Submit an application
        console.log('1️⃣ Submitting application...');
        const applicationData = {
            user_id: null, // No user_id for now
            email: 'workflow-test@example.com',
            name: 'Workflow Test User',
            phone: '+1-555-9999',
            message: 'I want to test the complete workflow',
            why_join: 'To test the approval process',
            skills: ['testing', 'workflow'],
            experience: 'Complete workflow testing'
        };

        const submitResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );

        console.log('✅ Application submitted:', submitResponse.data.data.id);
        const applicationId = submitResponse.data.data.id;

        // 2. Check initial members count
        console.log('\n2️⃣ Checking initial members...');
        const initialMembersResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/members`
        );
        console.log('📊 Initial members count:', initialMembersResponse.data.data.length);

        // 3. Check pending applications
        console.log('\n3️⃣ Checking pending applications...');
        const pendingResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications?status=pending`
        );
        console.log('📊 Pending applications:', pendingResponse.data.data.length);

        // 4. Approve the application
        console.log('\n4️⃣ Approving application...');
        const approveResponse = await axios.post(
            `${BASE_URL}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Application approved:', approveResponse.data.message);

        // 5. Check members after approval
        console.log('\n5️⃣ Checking members after approval...');
        const finalMembersResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/members`
        );
        console.log('📊 Final members count:', finalMembersResponse.data.data.length);
        console.log('👥 New members:', finalMembersResponse.data.data);

        // 6. Check approved applications
        console.log('\n6️⃣ Checking approved applications...');
        const approvedResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications?status=approved`
        );
        console.log('📊 Approved applications:', approvedResponse.data.data.length);

        // 7. Verify the application status changed
        console.log('\n7️⃣ Verifying application status...');
        const singleAppResponse = await axios.get(
            `${BASE_URL}/applications/${applicationId}`
        );
        console.log('📋 Application status:', singleAppResponse.data.data.status);

        console.log('\n🎉 Complete workflow test finished!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testCompleteWorkflow();