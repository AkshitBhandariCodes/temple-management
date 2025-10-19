const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

async function testApplications() {
    console.log('🧪 Testing Community Applications...\n');

    try {
        // 1. Submit an application
        console.log('1️⃣ Submitting application...');
        const applicationData = {
            user_id: null, // Will be set when user registers
            email: 'testuser@example.com',
            name: 'Test User',
            phone: '+1234567890',
            message: 'I would like to join this community to participate in temple activities.',
            why_join: 'To contribute to community service',
            skills: ['volunteering', 'event management'],
            experience: 'Previous temple volunteer experience'
        };

        const submitResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );

        console.log('✅ Application submitted:', submitResponse.data);
        const applicationId = submitResponse.data.data.id;

        // 2. Get applications for community
        console.log('\n2️⃣ Getting applications for community...');
        const getResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications`
        );

        console.log('✅ Applications retrieved:', getResponse.data);

        // 3. Get pending applications only
        console.log('\n3️⃣ Getting pending applications...');
        const pendingResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications?status=pending`
        );

        console.log('✅ Pending applications:', pendingResponse.data);

        // 4. Get single application
        console.log('\n4️⃣ Getting single application...');
        const singleResponse = await axios.get(
            `${BASE_URL}/applications/${applicationId}`
        );

        console.log('✅ Single application:', singleResponse.data);

        // 5. Approve application
        console.log('\n5️⃣ Approving application...');
        const approveResponse = await axios.post(
            `${BASE_URL}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );

        console.log('✅ Application approved:', approveResponse.data);

        // 6. Try to submit duplicate application
        console.log('\n6️⃣ Testing duplicate application...');
        try {
            await axios.post(
                `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
                applicationData
            );
        } catch (error) {
            console.log('✅ Duplicate application rejected:', error.response.data);
        }

        // 7. Submit new application for rejection test
        console.log('\n7️⃣ Submitting new application for rejection test...');
        const newApplicationData = {
            user_id: null,
            email: 'rejectuser@example.com',
            name: 'Reject Test User',
            message: 'Another test application',
            why_join: 'Testing rejection flow'
        };

        const newSubmitResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            newApplicationData
        );

        const newApplicationId = newSubmitResponse.data.data.id;

        // 8. Reject application
        console.log('\n8️⃣ Rejecting application...');
        const rejectResponse = await axios.post(
            `${BASE_URL}/applications/${newApplicationId}/reject`,
            { reviewed_by: null }
        );

        console.log('✅ Application rejected:', rejectResponse.data);

        console.log('\n🎉 All application tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testApplications();