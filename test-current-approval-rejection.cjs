const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testCurrentApprovalRejection() {
    console.log('🔍 Testing Current Approval/Rejection System...\n');

    try {
        // 1. Get current applications
        console.log('1️⃣ Getting current applications...');
        const applicationsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );
        console.log('📊 Current applications:', applicationsResponse.data.data.length);

        const pendingApps = applicationsResponse.data.data.filter(app => app.status === 'pending');
        console.log('📋 Pending applications:', pendingApps.length);

        if (pendingApps.length === 0) {
            // Create a test application
            console.log('\n2️⃣ Creating test application...');
            const testApp = {
                user_id: null,
                email: 'test-approval-current@example.com',
                name: 'Test Approval Current',
                phone: '+1-555-TEST-CURR',
                message: 'Testing current approval system',
                why_join: 'Testing purposes',
                skills: ['testing'],
                experience: 'Test experience'
            };

            const createResponse = await axios.post(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
                testApp
            );
            console.log('✅ Test application created:', createResponse.data.data.id);
            pendingApps.push(createResponse.data.data);
        }

        const testApplication = pendingApps[0];
        console.log('\n3️⃣ Testing approval on application:', testApplication.id);

        // 2. Test approval
        try {
            const approvalResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${testApplication.id}/approve`,
                { reviewed_by: null }
            );
            console.log('✅ Approval response:', {
                success: approvalResponse.data.success,
                message: approvalResponse.data.message
            });
        } catch (approvalError) {
            console.error('❌ Approval failed:', {
                status: approvalError.response?.status,
                message: approvalError.response?.data?.message,
                error: approvalError.response?.data?.error
            });
        }

        // 3. Check members after approval
        console.log('\n4️⃣ Checking members after approval...');
        const membersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        console.log('📊 Members count:', membersResponse.data.data.length);

        const approvedMember = membersResponse.data.data.find(m => m.email === testApplication.email);
        if (approvedMember) {
            console.log('✅ Approved member found:', {
                name: approvedMember.full_name,
                email: approvedMember.email,
                status: approvedMember.status
            });
        } else {
            console.log('❌ Approved member NOT found in members list');
        }

        // 4. Test rejection (create another app first)
        console.log('\n5️⃣ Testing rejection...');
        const rejectApp = {
            user_id: null,
            email: 'test-rejection-current@example.com',
            name: 'Test Rejection Current',
            message: 'Testing current rejection system'
        };

        const rejectCreateResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            rejectApp
        );
        const rejectAppId = rejectCreateResponse.data.data.id;
        console.log('✅ Rejection test application created:', rejectAppId);

        // First approve it
        await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Application approved (for rejection test)');

        // Then reject it
        try {
            const rejectionResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/reject`,
                {
                    reviewed_by: null,
                    review_notes: 'Testing rejection functionality'
                }
            );
            console.log('✅ Rejection response:', {
                success: rejectionResponse.data.success,
                message: rejectionResponse.data.message
            });
        } catch (rejectionError) {
            console.error('❌ Rejection failed:', {
                status: rejectionError.response?.status,
                message: rejectionError.response?.data?.message,
                error: rejectionError.response?.data?.error
            });
        }

        // 5. Final members check
        console.log('\n6️⃣ Final members check...');
        const finalMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        console.log('📊 Final members count:', finalMembersResponse.data.data.length);

        const rejectedMemberStillExists = finalMembersResponse.data.data.find(m => m.email === rejectApp.email);
        if (rejectedMemberStillExists) {
            console.log('❌ Rejected member still exists in members list');
        } else {
            console.log('✅ Rejected member properly removed from members list');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testCurrentApprovalRejection();