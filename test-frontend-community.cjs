const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7'; // The one frontend is actually using

async function testFrontendCommunity() {
    console.log('🎯 Testing with Frontend Community ID...\n');
    console.log('🆔 Using Community ID:', FRONTEND_COMMUNITY_ID);

    try {
        // 1. Check if this community exists
        console.log('1️⃣ Checking community exists...');
        const communityResponse = await axios.get(`${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}`);
        console.log('✅ Community found:', communityResponse.data.data.name);

        // 2. Get existing applications
        console.log('\n2️⃣ Getting existing applications...');
        const appsResponse = await axios.get(`${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`);
        console.log('📋 Existing applications:', appsResponse.data.data.length);

        if (appsResponse.data.data.length > 0) {
            const firstApp = appsResponse.data.data[0];
            console.log('📋 First application ID:', firstApp.id);
            console.log('📋 First application status:', firstApp.status);

            // 3. Try to approve the first pending application
            if (firstApp.status === 'pending') {
                console.log('\n3️⃣ Trying to approve existing pending application...');
                try {
                    const approveResponse = await axios.put(
                        `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${firstApp.id}/approve`,
                        { reviewed_by: null }
                    );
                    console.log('✅ Approval successful:', approveResponse.data.message);
                } catch (approveError) {
                    console.log('❌ Approval failed:', approveError.response?.data);
                }
            }
        }

        // 4. Submit a new application to this community
        console.log('\n4️⃣ Submitting new application to frontend community...');
        const applicationData = {
            user_id: null,
            email: 'frontend-community-test@example.com',
            name: 'Frontend Community Test User',
            phone: '+1-555-FRONTEND-COMM',
            message: 'Testing with frontend community',
            why_join: 'Frontend community testing',
            skills: ['frontend', 'community'],
            experience: 'Frontend community testing'
        };

        const appResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/apply`,
            applicationData
        );
        console.log('✅ Application submitted:', appResponse.data.data.id);
        const applicationId = appResponse.data.data.id;

        // 5. Approve this new application
        console.log('\n5️⃣ Approving new application...');
        try {
            const approveResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${applicationId}/approve`,
                { reviewed_by: null }
            );
            console.log('✅ Approval successful:', approveResponse.data.message);
            console.log('📋 New status:', approveResponse.data.data.status);
        } catch (approveError) {
            console.log('❌ Approval failed:', approveError.response?.data);
        }

        // 6. Check updated applications
        console.log('\n6️⃣ Checking updated applications...');
        const updatedAppsResponse = await axios.get(`${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`);
        console.log('📊 Total applications:', updatedAppsResponse.data.data.length);

        const statusCounts = updatedAppsResponse.data.data.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        console.log('📊 Status breakdown:', statusCounts);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testFrontendCommunity();