const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4'; // From the error

async function debugApplicationsStructure() {
    console.log('🔍 Debugging Applications Structure...\n');

    try {
        // 1. Get applications for the community from the error
        console.log('1️⃣ Getting applications for community:', FRONTEND_COMMUNITY_ID);
        const applicationsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );

        console.log('✅ Applications API Response:', {
            success: applicationsResponse.data.success,
            total: applicationsResponse.data.total,
            count: applicationsResponse.data.data?.length || 0
        });

        if (applicationsResponse.data.data && applicationsResponse.data.data.length > 0) {
            console.log('\n📋 Sample Application Structure:');
            const sampleApp = applicationsResponse.data.data[0];
            console.log('Raw application object:', JSON.stringify(sampleApp, null, 2));

            console.log('\n🔍 Application ID Analysis:');
            console.log('- app.id:', sampleApp.id);
            console.log('- app._id:', sampleApp._id);
            console.log('- Object.keys(app):', Object.keys(sampleApp));

            // Test what the frontend would get
            const frontendId = sampleApp.id || sampleApp._id;
            console.log('- Frontend would use:', frontendId);
            console.log('- Is undefined?:', frontendId === undefined);
        } else {
            console.log('❌ No applications found');

            // Create a test application to see the structure
            console.log('\n2️⃣ Creating test application to see structure...');
            const testApp = {
                user_id: null,
                email: 'debug-structure@example.com',
                name: 'Debug Structure Test',
                message: 'Testing application structure'
            };

            const createResponse = await axios.post(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
                testApp
            );

            console.log('✅ Created application:', createResponse.data.data.id);

            // Now get applications again
            const newApplicationsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
            );

            if (newApplicationsResponse.data.data && newApplicationsResponse.data.data.length > 0) {
                console.log('\n📋 New Application Structure:');
                const newApp = newApplicationsResponse.data.data.find(app => app.email === 'debug-structure@example.com');
                if (newApp) {
                    console.log('Raw application object:', JSON.stringify(newApp, null, 2));
                    console.log('\n🔍 Application ID Analysis:');
                    console.log('- app.id:', newApp.id);
                    console.log('- app._id:', newApp._id);
                    console.log('- Object.keys(app):', Object.keys(newApp));
                }
            }
        }

        // 3. Test with different status filters
        console.log('\n3️⃣ Testing different status filters...');
        const statuses = ['pending', 'approved', 'rejected', 'all'];

        for (const status of statuses) {
            try {
                const statusResponse = await axios.get(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications?status=${status}`
                );
                console.log(`📊 Status "${status}":`, statusResponse.data.data?.length || 0, 'applications');
            } catch (error) {
                console.log(`❌ Status "${status}": Error -`, error.response?.data?.message || error.message);
            }
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.response?.data || error.message);
    }
}

debugApplicationsStructure();