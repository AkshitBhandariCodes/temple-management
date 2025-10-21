const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function checkExistingMembersTable() {
    console.log('🔍 Checking existing community_members table structure...\n');

    try {
        // Let's see what the current members endpoint returns
        console.log('1️⃣ Checking current members endpoint...');
        const membersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );

        console.log('✅ Members API Response:', {
            success: membersResponse.data.success,
            total: membersResponse.data.total,
            count: membersResponse.data.data?.length || 0
        });

        if (membersResponse.data.data && membersResponse.data.data.length > 0) {
            console.log('\n📋 Sample Member Structure:');
            const sampleMember = membersResponse.data.data[0];
            console.log('Raw member object:', JSON.stringify(sampleMember, null, 2));
            console.log('\n🔍 Available fields:', Object.keys(sampleMember));
        }

        // Let's also check what applications look like
        console.log('\n2️⃣ Checking applications structure...');
        const applicationsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications?status=approved`
        );

        if (applicationsResponse.data.data && applicationsResponse.data.data.length > 0) {
            console.log('\n📋 Sample Approved Application Structure:');
            const sampleApp = applicationsResponse.data.data[0];
            console.log('Raw application object:', JSON.stringify(sampleApp, null, 2));
            console.log('\n🔍 Available fields:', Object.keys(sampleApp));
        }

    } catch (error) {
        console.error('❌ Check failed:', error.response?.data || error.message);
    }
}

checkExistingMembersTable();