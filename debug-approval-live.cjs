const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function debugApprovalLive() {
    console.log('🔍 Live Debugging Approval/Rejection...\n');

    try {
        // 1. Submit a fresh application
        console.log('1️⃣ Submitting fresh application...');
        const applicationData = {
            user_id: null,
            email: 'debug-live@example.com',
            name: 'Debug Live User',
            phone: '+1-555-DEBUG-LIVE',
            message: 'Testing live debugging',
            why_join: 'Live debugging',
            skills: ['debugging'],
            experience: 'Live debugging experience'
        };

        const appResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );
        console.log('✅ Application submitted successfully');
        console.log('🆔 Application ID:', appResponse.data.data.id);
        console.log('📋 Application Status:', appResponse.data.data.status);
        const applicationId = appResponse.data.data.id;

        // 2. Test the exact frontend route with detailed logging
        console.log('\n2️⃣ Testing approval with detailed logging...');
        console.log('🔗 URL:', `${BASE_URL}/communities/${COMMUNITY_ID}/applications/${applicationId}/approve`);
        console.log('📤 Method: PUT');
        console.log('📦 Body:', { reviewed_by: null });

        try {
            const approveResponse = await axios({
                method: 'PUT',
                url: `${BASE_URL}/communities/${COMMUNITY_ID}/applications/${applicationId}/approve`,
                data: { reviewed_by: null },
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });

            console.log('✅ Approval Response Status:', approveResponse.status);
            console.log('✅ Approval Response Data:', approveResponse.data);

            // Verify the status changed
            console.log('\n3️⃣ Verifying approval status...');
            const verifyResponse = await axios.get(`${BASE_URL}/applications/${applicationId}`);
            console.log('📋 Verified Status:', verifyResponse.data.data.status);
            console.log('📅 Reviewed At:', verifyResponse.data.data.reviewed_at);

        } catch (approveError) {
            console.log('❌ Approval Failed:');
            console.log('Status Code:', approveError.response?.status);
            console.log('Status Text:', approveError.response?.statusText);
            console.log('Error Data:', approveError.response?.data);
            console.log('Error Headers:', approveError.response?.headers);
            console.log('Full Error:', approveError.message);
        }

        // 4. Test rejection with a new application
        console.log('\n4️⃣ Testing rejection...');
        const rejectAppData = {
            user_id: null,
            email: 'reject-live@example.com',
            name: 'Reject Live User',
            message: 'Testing live rejection',
            why_join: 'Live rejection testing'
        };

        const rejectAppResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            rejectAppData
        );
        const rejectAppId = rejectAppResponse.data.data.id;
        console.log('🆔 Reject Application ID:', rejectAppId);

        try {
            const rejectResponse = await axios({
                method: 'PUT',
                url: `${BASE_URL}/communities/${COMMUNITY_ID}/applications/${rejectAppId}/reject`,
                data: { reviewed_by: null },
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            });

            console.log('✅ Rejection Response Status:', rejectResponse.status);
            console.log('✅ Rejection Response Data:', rejectResponse.data);

        } catch (rejectError) {
            console.log('❌ Rejection Failed:');
            console.log('Status Code:', rejectError.response?.status);
            console.log('Error Data:', rejectError.response?.data);
        }

        // 5. Check server logs by making a test request
        console.log('\n5️⃣ Testing server connectivity...');
        const healthResponse = await axios.get(`${BASE_URL}/../health`);
        console.log('✅ Server Health:', healthResponse.data.status);

    } catch (error) {
        console.error('❌ Debug test failed:', error.message);
        if (error.response) {
            console.log('Response Status:', error.response.status);
            console.log('Response Data:', error.response.data);
        }
    }
}

debugApprovalLive();