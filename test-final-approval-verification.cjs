const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function testFinalApprovalVerification() {
    console.log('🎯 Final Approval Verification - Community Members Table...\n');

    try {
        // 1. Get current members count
        console.log('1️⃣ Getting current members count...');
        const initialMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const initialCount = initialMembersResponse.data.data.length;
        console.log('📊 Initial members count:', initialCount);

        // 2. Create and approve a new application
        console.log('\n2️⃣ Creating and approving new application...');
        const testApp = {
            user_id: null,
            email: 'final-verification@example.com',
            name: 'Final Verification User',
            phone: '+1-555-FINAL',
            message: 'Final verification test',
            why_join: 'Testing final approval process',
            skills: ['verification', 'testing'],
            experience: 'Final testing experience'
        };

        // Create application
        const createResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            testApp
        );
        const applicationId = createResponse.data.data.id;
        console.log('✅ Application created:', applicationId);

        // Approve application
        const approvalResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Application approved:', approvalResponse.data.message);

        // 3. Check if member was added
        console.log('\n3️⃣ Checking if member was added to community_members table...');
        const finalMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const finalCount = finalMembersResponse.data.data.length;
        console.log('📊 Final members count:', finalCount);

        // Find the new member
        const newMember = finalMembersResponse.data.data.find(m => m.email === testApp.email);
        if (newMember) {
            console.log('✅ New member found in community_members table:', {
                id: newMember.id,
                name: newMember.full_name,
                email: newMember.email,
                role: newMember.role,
                status: newMember.status,
                joined_at: newMember.joined_at,
                skills: newMember.skills,
                experience: newMember.experience
            });
        } else {
            console.log('❌ New member NOT found in community_members table');
        }

        // 4. Verify the count increased
        console.log('\n4️⃣ Verification Results:');
        console.log('==========================================');
        console.log(`📊 Members before: ${initialCount}`);
        console.log(`📊 Members after: ${finalCount}`);
        console.log(`📈 Increase: ${finalCount - initialCount} (${finalCount > initialCount ? '✅ SUCCESS' : '❌ FAILED'})`);
        console.log('==========================================');

        if (finalCount > initialCount && newMember) {
            console.log('🎉 APPROVAL PROCESS WORKING PERFECTLY! 🎉');
            console.log('✅ Applications are being approved');
            console.log('✅ Users are being added to community_members table');
            console.log('✅ Members are visible in the members list');
            console.log('✅ All member data is properly stored');
        } else {
            console.log('❌ APPROVAL PROCESS NEEDS ATTENTION');
        }

        // 5. Test rejection process
        console.log('\n5️⃣ Testing rejection process...');
        const rejectApp = {
            user_id: null,
            email: 'reject-verification@example.com',
            name: 'Reject Verification User',
            message: 'Testing rejection process'
        };

        // Create and approve first
        const rejectCreateResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
            rejectApp
        );
        const rejectAppId = rejectCreateResponse.data.data.id;

        await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Application approved (for rejection test)');

        // Check count before rejection
        const beforeRejectionResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const beforeRejectionCount = beforeRejectionResponse.data.data.length;

        // Now reject it
        await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${rejectAppId}/reject`,
            { reviewed_by: null, review_notes: 'Testing rejection' }
        );
        console.log('✅ Application rejected');

        // Check count after rejection
        const afterRejectionResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const afterRejectionCount = afterRejectionResponse.data.data.length;

        console.log('\n6️⃣ Rejection Results:');
        console.log('==========================================');
        console.log(`📊 Members before rejection: ${beforeRejectionCount}`);
        console.log(`📊 Members after rejection: ${afterRejectionCount}`);
        console.log(`📉 Decrease: ${beforeRejectionCount - afterRejectionCount} (${afterRejectionCount < beforeRejectionCount ? '✅ SUCCESS' : '❌ FAILED'})`);
        console.log('==========================================');

        if (afterRejectionCount < beforeRejectionCount) {
            console.log('🎉 REJECTION PROCESS ALSO WORKING! 🎉');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testFinalApprovalVerification();