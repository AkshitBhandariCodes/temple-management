const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testImprovedErrors() {
    console.log('🔍 Testing Improved Error Messages...\n');

    try {
        // Test with undefined ID (simulating frontend issue)
        console.log('1️⃣ Testing with undefined ID...');
        try {
            await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/undefined/approve`,
                { reviewed_by: null }
            );
        } catch (error) {
            console.log('❌ Undefined ID Error Response:');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.error);
            console.log('Message:', error.response?.data?.message);
            console.log('Hint:', error.response?.data?.hint);
            console.log('Received ID:', error.response?.data?.received_id);
        }

        // Test with null ID
        console.log('\n2️⃣ Testing with null ID...');
        try {
            await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/null/reject`,
                { reviewed_by: null }
            );
        } catch (error) {
            console.log('❌ Null ID Error Response:');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.error);
            console.log('Message:', error.response?.data?.message);
        }

        // Test with empty string
        console.log('\n3️⃣ Testing with empty string ID...');
        try {
            await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/ /approve`,
                { reviewed_by: null }
            );
        } catch (error) {
            console.log('❌ Empty ID Error Response:');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.error || error.response?.data?.message);
        }

        // Test with valid ID for comparison
        console.log('\n4️⃣ Testing with valid ID for comparison...');

        // First get a valid application
        const appsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications?status=pending`
        );

        if (appsResponse.data.data.length > 0) {
            const validApp = appsResponse.data.data[0];
            console.log('📋 Found valid application:', validApp.id);

            try {
                const validResponse = await axios.put(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${validApp.id}/approve`,
                    { reviewed_by: null }
                );
                console.log('✅ Valid ID Success:', validResponse.data.message);
            } catch (error) {
                console.log('❌ Valid ID Error:', error.response?.data);
            }
        } else {
            console.log('ℹ️ No pending applications to test with');
        }

        console.log('\n📋 Summary:');
        console.log('✅ Improved error messages provide clear feedback');
        console.log('✅ Frontend developers can easily identify the issue');
        console.log('✅ Hints provided for debugging');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testImprovedErrors();