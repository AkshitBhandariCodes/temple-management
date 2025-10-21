const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';
const APPLICATION_ID = 'b21aa5c8-6740-4f99-80e3-1ec397c15fbc';

async function testSpecificApproval() {
    console.log('🎯 Testing Specific Application Approval...\n');

    try {
        console.log('📋 Community ID:', FRONTEND_COMMUNITY_ID);
        console.log('📋 Application ID:', APPLICATION_ID);

        // 1. Test the exact API call that the frontend is making
        console.log('\n1️⃣ Testing approval API call...');
        const approvalResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${APPLICATION_ID}/approve`,
            {
                role: 'member',
                review_notes: 'Approved via frontend test'
            }
        );

        console.log('✅ Approval successful:', {
            success: approvalResponse.data.success,
            message: approvalResponse.data.message
        });

        // 2. Check if the application status changed
        console.log('\n2️⃣ Checking application status...');
        const applicationsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );

        const approvedApp = applicationsResponse.data.data.find(app => app.id === APPLICATION_ID);
        if (approvedApp) {
            console.log('✅ Application found:', {
                id: approvedApp.id,
                name: approvedApp.name,
                status: approvedApp.status,
                reviewed_at: approvedApp.reviewed_at
            });
        } else {
            console.log('❌ Application not found');
        }

        // 3. Check if member was added
        console.log('\n3️⃣ Checking members list...');
        const membersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );

        const newMember = membersResponse.data.data.find(member => member.email === 'vaibhav.doe@example.com');
        if (newMember) {
            console.log('✅ Member found:', {
                name: newMember.full_name,
                email: newMember.email,
                role: newMember.role,
                status: newMember.status
            });
        } else {
            console.log('❌ Member not found in members list');
        }

        console.log('\n🎉 Frontend approval should work with these exact IDs!');

    } catch (error) {
        console.error('❌ Test failed:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            error: error.response?.data?.error
        });
    }
}

testSpecificApproval();