const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testApprovalRejectionFix() {
    console.log('🎯 Testing Approval/Rejection Fix - Complete Workflow...\n');

    try {
        // 1. Get initial members count
        console.log('1️⃣ Getting initial members count...');
        const initialMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const initialMembersCount = initialMembersResponse.data.data.length;
        console.log('📊 Initial members count:', initialMembersCount);

        // 2. Submit a new application
        console.log('\n2️⃣ Submitting new application...');
        const applicationData = {
            user_id: null,
            email: 'approval-test-v2@example.com',
            name: 'Approval Test User V2',
            phone: '+1-555-APPROVAL-V2',
            message: 'Testing approval process v2',
            why_join: 'Testing approval functionality v2',
            skills: ['testing', 'approval'],
            experience: 'Approval testing experience v2'
        };

        const appResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            applicationData
        );
        console.log('✅ Application submitted:', appResponse.data.data.id);
        const applicationId = appResponse.data.data.id;

        // 3. Check members before approval (should be same count)
        const beforeApprovalResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        console.log('📊 Members before approval:', beforeApprovalResponse.data.data.length);

        // 4. Approve the application (using null for reviewed_by)
        console.log('\n3️⃣ Approving application...');
        const approveResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Approval result:', approveResponse.data.message);

        // 5. Check members after approval (should increase by 1)
        console.log('\n4️⃣ Checking members after approval...');
        const afterApprovalResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const afterApprovalCount = afterApprovalResponse.data.data.length;
        console.log('📊 Members after approval:', afterApprovalCount);

        // Find the new member
        const newMember = afterApprovalResponse.data.data.find(m => m.email === 'approval-test-v2@example.com');
        if (newMember) {
            console.log('👤 New member found:', {
                id: newMember.id,
                name: newMember.full_name,
                email: newMember.email,
                role: newMember.role,
                status: newMember.status,
                joined_at: newMember.joined_at
            });
        } else {
            console.log('❌ New member NOT found in members list');
        }

        // 6. Test rejection process - submit another application
        console.log('\n5️⃣ Testing rejection process...');
        const rejectAppData = {
            user_id: null,
            email: 'reject-test-v2@example.com',
            name: 'Reject Test User V2',
            message: 'Testing rejection process v2'
        };

        const rejectAppResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            rejectAppData
        );
        const rejectAppId = rejectAppResponse.data.data.id;
        console.log('✅ Second application submitted:', rejectAppId);

        // First approve it
        await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Second application approved');

        // Check members count (should increase)
        const beforeRejectionResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const beforeRejectionCount = beforeRejectionResponse.data.data.length;
        console.log('📊 Members before rejection:', beforeRejectionCount);

        // Now reject it
        const rejectResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/reject`,
            {
                reviewed_by: null,
                review_notes: 'Testing rejection functionality'
            }
        );
        console.log('✅ Application rejected:', rejectResponse.data.message);

        // Check members count (should decrease)
        const afterRejectionResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const afterRejectionCount = afterRejectionResponse.data.data.length;
        console.log('📊 Members after rejection:', afterRejectionCount);

        // 7. Check community stats
        console.log('\n6️⃣ Checking community stats...');
        const statsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/stats`
        );
        console.log('📊 Community stats:', {
            member_count: statsResponse.data.data.member_count,
            status: statsResponse.data.data.status
        });

        // 8. Verify the workflow
        console.log('\n🎉 APPROVAL/REJECTION TEST RESULTS:');
        console.log('==========================================');
        console.log(`📊 Initial members: ${initialMembersCount}`);
        console.log(`📊 After approval: ${afterApprovalCount} (${afterApprovalCount > initialMembersCount ? '✅ INCREASED' : '❌ NO CHANGE'})`);
        console.log(`📊 After rejection: ${afterRejectionCount} (${afterRejectionCount < beforeRejectionCount ? '✅ DECREASED' : '❌ NO CHANGE'})`);
        console.log('==========================================');

        if (afterApprovalCount > initialMembersCount && afterRejectionCount < beforeRejectionCount) {
            console.log('🎉 APPROVAL/REJECTION WORKFLOW WORKING CORRECTLY! 🎉');
            console.log('✅ Approval adds members to community_members table');
            console.log('✅ Rejection removes members from community_members table');
            console.log('✅ Member counts update correctly');
        } else {
            console.log('❌ APPROVAL/REJECTION WORKFLOW NEEDS FIXING');
            if (afterApprovalCount <= initialMembersCount) {
                console.log('❌ Approval is not adding members');
            }
            if (afterRejectionCount >= beforeRejectionCount) {
                console.log('❌ Rejection is not removing members');
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.data?.error) {
            console.error('Detailed error:', error.response.data.error);
        }
    }
}

testApprovalRejectionFix();