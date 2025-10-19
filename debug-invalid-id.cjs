const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function debugInvalidId() {
    console.log('🔍 Debugging Invalid Application ID Issue...\n');

    try {
        // 1. Get current applications to see their structure
        console.log('1️⃣ Getting current applications...');
        const appsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );

        console.log('📊 Total applications:', appsResponse.data.data.length);

        if (appsResponse.data.data.length > 0) {
            const firstApp = appsResponse.data.data[0];
            console.log('📋 First application structure:');
            console.log('  ID:', firstApp.id);
            console.log('  Type of ID:', typeof firstApp.id);
            console.log('  Status:', firstApp.status);
            console.log('  Name:', firstApp.name);

            // 2. Test with various ID formats
            console.log('\n2️⃣ Testing different ID scenarios...');

            // Test with valid ID
            console.log('Testing with valid ID:', firstApp.id);
            try {
                const validResponse = await axios.put(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${firstApp.id}/approve`,
                    { reviewed_by: null }
                );
                console.log('✅ Valid ID works:', validResponse.data.message);
            } catch (error) {
                console.log('❌ Valid ID failed:', error.response?.data);
            }

            // Test with undefined
            console.log('\nTesting with undefined ID...');
            try {
                await axios.put(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/undefined/approve`,
                    { reviewed_by: null }
                );
            } catch (error) {
                console.log('❌ Undefined ID error:', error.response?.data?.error || error.response?.data?.message);
            }

            // Test with null
            console.log('\nTesting with null ID...');
            try {
                await axios.put(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/null/approve`,
                    { reviewed_by: null }
                );
            } catch (error) {
                console.log('❌ Null ID error:', error.response?.data?.error || error.response?.data?.message);
            }

            // Test with empty string
            console.log('\nTesting with empty ID...');
            try {
                await axios.put(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications//approve`,
                    { reviewed_by: null }
                );
            } catch (error) {
                console.log('❌ Empty ID error:', error.response?.data?.error || error.response?.data?.message);
            }
        }

        // 3. Submit a new application and test immediately
        console.log('\n3️⃣ Testing with fresh application...');
        const newAppData = {
            user_id: null,
            email: 'debug-invalid-id@example.com',
            name: 'Debug Invalid ID User',
            message: 'Testing invalid ID issue'
        };

        const newAppResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/apply`,
            newAppData
        );

        const newAppId = newAppResponse.data.data.id;
        console.log('🆔 New application ID:', newAppId);
        console.log('🔍 ID type:', typeof newAppId);
        console.log('🔍 ID length:', newAppId?.length);

        // Test approval immediately
        try {
            const approveResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${newAppId}/approve`,
                { reviewed_by: null }
            );
            console.log('✅ Fresh application approval works:', approveResponse.data.message);
        } catch (error) {
            console.log('❌ Fresh application approval failed:', error.response?.data);
        }

    } catch (error) {
        console.error('❌ Debug test failed:', error.response?.data || error.message);
    }
}

debugInvalidId();