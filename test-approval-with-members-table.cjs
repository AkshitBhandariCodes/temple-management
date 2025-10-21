const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function testApprovalWithMembersTable() {
    console.log('🎯 Testing Approval with Community Members Table...\n');

    try {
        // 1. Create a test application
        console.log('1️⃣ Creating test application...');
        const testApp = {
            user_id: null,
            email: 'members-table-test@example.com',
            name: 'Members Table Test User',
            phone: '+1-555-MEMBERS',
            message: 'Testing members table insertion',
            why_join: 'Testing community members table',
            skills: ['testing', 'community'],
            experience: 'Testing experience'
        };

        const createResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            testApp
        );
        console.log('✅ Application created:', createResponse.data.data.id);
        const applicationId = createResponse.data.data.id;

        // 2. Check community_members table before approval
        console.log('\n2️⃣ Checking community_members table before approval...');
        try {
            const beforeMembersResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
            );
            console.log('📊 Members before approval:', beforeMembersResponse.data.data.length);
        } catch (error) {
            console.log('❌ Could not fetch members:', error.response?.data?.message);
        }

        // 3. Approve the application
        console.log('\n3️⃣ Approving application...');
        const approvalResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Approval response:', {
            success: approvalResponse.data.success,
            message: approvalResponse.data.message
        });

        // 4. Check community_members table after approval
        console.log('\n4️⃣ Checking community_members table after approval...');
        try {
            const afterMembersResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
            );
            console.log('📊 Members after approval:', afterMembersResponse.data.data.length);

            // Look for the new member
            const newMember = afterMembersResponse.data.data.find(m => m.email === testApp.email);
            if (newMember) {
                console.log('✅ New member found in members table:', {
                    id: newMember.id,
                    name: newMember.full_name,
                    email: newMember.email,
                    role: newMember.role,
                    status: newMember.status,
                    joined_at: newMember.joined_at
                });
            } else {
                console.log('❌ New member NOT found in members table');
            }
        } catch (error) {
            console.log('❌ Could not fetch members after approval:', error.response?.data?.message);
        }

        // 5. Check server logs for any errors
        console.log('\n5️⃣ Check the server logs for any community_members insertion errors');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testApprovalWithMembersTable();