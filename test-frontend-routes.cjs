const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testFrontendRoutes() {
    console.log('🎯 Testing Frontend-Compatible Routes...\n');

    try {
        // 1. Submit application first
        console.log('1️⃣ Submitting application...');
        const applicationData = {
            user_id: null,
            email: 'frontend-test@example.com',
            name: 'Frontend Test User',
            phone: '+1-555-FRONTEND',
            message: 'Testing frontend routes',
            why_join: 'Frontend testing',
            skills: ['frontend'],
            experience: 'Frontend testing experience'
        };

        const appResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );
        console.log('✅ Application submitted:', appResponse.data.data.id);
        const applicationId = appResponse.data.data.id;

        // 2. Test frontend-style approval (PUT method)
        console.log('\n2️⃣ Testing frontend-style approval (PUT)...');
        try {
            const approveResponse = await axios.put(
                `${BASE_URL}/communities/${COMMUNITY_ID}/applications/${applicationId}/approve`,
                { reviewed_by: null }
            );
            console.log('✅ Frontend approval successful:', approveResponse.data);
        } catch (approveError) {
            console.log('❌ Frontend approval failed:');
            console.log('Status:', approveError.response?.status);
            console.log('Error:', approveError.response?.data);
        }

        // 3. Submit another application for rejection test
        console.log('\n3️⃣ Submitting application for rejection test...');
        const rejectAppData = {
            user_id: null,
            email: 'frontend-reject@example.com',
            name: 'Frontend Reject User',
            message: 'Testing frontend rejection',
            why_join: 'Frontend rejection testing'
        };

        const rejectAppResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            rejectAppData
        );
        const rejectAppId = rejectAppResponse.data.data.id;

        // 4. Test frontend-style rejection (PUT method)
        console.log('\n4️⃣ Testing frontend-style rejection (PUT)...');
        try {
            const rejectResponse = await axios.put(
                `${BASE_URL}/communities/${COMMUNITY_ID}/applications/${rejectAppId}/reject`,
                { reviewed_by: null }
            );
            console.log('✅ Frontend rejection successful:', rejectResponse.data);
        } catch (rejectError) {
            console.log('❌ Frontend rejection failed:');
            console.log('Status:', rejectError.response?.status);
            console.log('Error:', rejectError.response?.data);
        }

        // 5. Test frontend event creation
        console.log('\n5️⃣ Testing frontend event creation...');
        const eventData = {
            title: 'Frontend Test Event',
            description: 'Event created via frontend-compatible route',
            start_date: '2025-12-20T15:00:00Z',
            end_date: '2025-12-20T17:00:00Z',
            location: 'Frontend Test Hall',
            event_type: 'meeting',
            max_participants: 30
        };

        try {
            const eventResponse = await axios.post(
                `${BASE_URL}/communities/${COMMUNITY_ID}/events`,
                eventData
            );
            console.log('✅ Frontend event creation successful:', eventResponse.data.data.title);
            console.log('🆔 Event ID:', eventResponse.data.data.id);
        } catch (eventError) {
            console.log('❌ Frontend event creation failed:');
            console.log('Status:', eventError.response?.status);
            console.log('Error:', eventError.response?.data);
        }

        // 6. Test error handling with undefined ID
        console.log('\n6️⃣ Testing error handling with undefined ID...');
        try {
            await axios.put(
                `${BASE_URL}/communities/${COMMUNITY_ID}/applications/undefined/approve`,
                { reviewed_by: null }
            );
        } catch (undefinedError) {
            console.log('✅ Undefined ID properly handled:', undefinedError.response?.data?.error);
        }

        console.log('\n🎉 Frontend-compatible routes test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testFrontendRoutes();