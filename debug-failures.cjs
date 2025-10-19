const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function debugFailures() {
    console.log('🔍 Debugging Current Failures...\n');

    try {
        // 1. Test event creation
        console.log('1️⃣ Testing Event Creation...');
        const eventData = {
            title: 'Debug Test Event',
            description: 'Testing event creation',
            start_date: '2025-12-01T10:00:00Z',
            end_date: '2025-12-01T12:00:00Z',
            location: 'Debug Hall',
            event_type: 'meeting',
            max_participants: 25
        };

        try {
            const eventResponse = await axios.post(
                `${BASE_URL}/communities/${COMMUNITY_ID}/events`,
                eventData
            );
            console.log('✅ Event creation successful:', eventResponse.data);
        } catch (eventError) {
            console.log('❌ Event creation failed:');
            console.log('Status:', eventError.response?.status);
            console.log('Error:', eventError.response?.data);
        }

        // 2. Test application submission and approval
        console.log('\n2️⃣ Testing Application Workflow...');

        // Submit application
        const applicationData = {
            user_id: null,
            email: 'debug-app@example.com',
            name: 'Debug Application User',
            phone: '+1-555-DEBUG',
            message: 'Testing application workflow',
            why_join: 'Debug testing',
            skills: ['debugging'],
            experience: 'Debug testing experience'
        };

        try {
            const appResponse = await axios.post(
                `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
                applicationData
            );
            console.log('✅ Application submitted:', appResponse.data.data.id);
            const applicationId = appResponse.data.data.id;

            // Test approval
            console.log('\n3️⃣ Testing Application Approval...');
            try {
                const approveResponse = await axios.post(
                    `${BASE_URL}/applications/${applicationId}/approve`,
                    { reviewed_by: null }
                );
                console.log('✅ Approval successful:', approveResponse.data);
            } catch (approveError) {
                console.log('❌ Approval failed:');
                console.log('Status:', approveError.response?.status);
                console.log('Error:', approveError.response?.data);
            }

            // Test rejection with a new application
            console.log('\n4️⃣ Testing Application Rejection...');
            const rejectAppData = {
                user_id: null,
                email: 'reject-test@example.com',
                name: 'Reject Test User',
                message: 'Testing rejection',
                why_join: 'Testing rejection flow'
            };

            const rejectAppResponse = await axios.post(
                `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
                rejectAppData
            );
            const rejectAppId = rejectAppResponse.data.data.id;

            try {
                const rejectResponse = await axios.post(
                    `${BASE_URL}/applications/${rejectAppId}/reject`,
                    { reviewed_by: null }
                );
                console.log('✅ Rejection successful:', rejectResponse.data);
            } catch (rejectError) {
                console.log('❌ Rejection failed:');
                console.log('Status:', rejectError.response?.status);
                console.log('Error:', rejectError.response?.data);
            }

        } catch (appError) {
            console.log('❌ Application submission failed:');
            console.log('Status:', appError.response?.status);
            console.log('Error:', appError.response?.data);
        }

    } catch (error) {
        console.error('❌ Debug test failed:', error.message);
    }
}

debugFailures();