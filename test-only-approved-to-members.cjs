const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function testOnlyApprovedToMembers() {
    console.log('🎯 Testing: ONLY APPROVED Applications → Community Members...\n');

    try {
        // 1. Get initial state
        console.log('1️⃣ Getting initial state...');
        const initialMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const initialMembersCount = initialMembersResponse.data.data.length;
        console.log('📊 Initial members count:', initialMembersCount);

        const initialAppsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );
        const initialAppsCount = initialAppsResponse.data.data.length;
        console.log('📊 Initial applications count:', initialAppsCount);

        // 2. Create multiple test applications
        console.log('\n2️⃣ Creating multiple test applications...');
        const testApplications = [
            {
                email: 'approved-test-1@example.com',
                name: 'Approved Test User 1',
                message: 'Will be approved'
            },
            {
                email: 'approved-test-2@example.com',
                name: 'Approved Test User 2',
                message: 'Will be approved'
            },
            {
                email: 'rejected-test-1@example.com',
                name: 'Rejected Test User 1',
                message: 'Will be rejected'
            },
            {
                email: 'pending-test-1@example.com',
                name: 'Pending Test User 1',
                message: 'Will stay pending'
            }
        ];

        const createdApps = [];
        for (const app of testApplications) {
            const createResponse = await axios.post(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`,
                app
            );
            createdApps.push({
                ...createResponse.data.data,
                expectedAction: app.message.includes('approved') ? 'approve' :
                    app.message.includes('rejected') ? 'reject' : 'pending'
            });
            console.log(`✅ Created application: ${app.name} (${createdApps[createdApps.length - 1].expectedAction})`);
        }

        // 3. Process applications according to plan
        console.log('\n3️⃣ Processing applications...');

        // Approve the first two
        for (const app of createdApps.filter(a => a.expectedAction === 'approve')) {
            const approveResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${app.id}/approve`,
                { reviewed_by: null }
            );
            console.log(`✅ APPROVED: ${app.name} - ${approveResponse.data.message}`);
        }

        // Reject one
        for (const app of createdApps.filter(a => a.expectedAction === 'reject')) {
            const rejectResponse = await axios.put(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${app.id}/reject`,
                { reviewed_by: null, review_notes: 'Testing rejection' }
            );
            console.log(`❌ REJECTED: ${app.name} - ${rejectResponse.data.message}`);
        }

        // Leave one pending (no action)
        const pendingApps = createdApps.filter(a => a.expectedAction === 'pending');
        console.log(`⏳ LEFT PENDING: ${pendingApps[0].name} - No action taken`);

        // 4. Check final state
        console.log('\n4️⃣ Checking final state...');

        // Check members (should only include approved)
        const finalMembersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );
        const finalMembersCount = finalMembersResponse.data.data.length;
        console.log('📊 Final members count:', finalMembersCount);

        // Check applications by status
        const finalAppsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
        );
        const finalApps = finalAppsResponse.data.data;

        const approvedApps = finalApps.filter(app => app.status === 'approved');
        const rejectedApps = finalApps.filter(app => app.status === 'rejected');
        const pendingAppsCount = finalApps.filter(app => app.status === 'pending');

        console.log('📊 Final applications breakdown:');
        console.log(`   - Approved: ${approvedApps.length}`);
        console.log(`   - Rejected: ${rejectedApps.length}`);
        console.log(`   - Pending: ${pendingAppsCount.length}`);

        // 5. Verify ONLY approved applications are in members
        console.log('\n5️⃣ Verifying ONLY approved applications are members...');

        const approvedEmails = approvedApps.map(app => app.email);
        const memberEmails = finalMembersResponse.data.data.map(member => member.email);

        console.log('📋 Approved application emails:', approvedEmails);
        console.log('📋 Member emails:', memberEmails);

        // Check if all approved apps are in members
        const approvedInMembers = approvedEmails.filter(email => memberEmails.includes(email));
        console.log('✅ Approved apps found in members:', approvedInMembers.length, '/', approvedEmails.length);

        // Check if any rejected/pending apps are in members (should be 0)
        const rejectedEmails = rejectedApps.map(app => app.email);
        const pendingEmails = pendingAppsCount.map(app => app.email);
        const nonApprovedInMembers = [...rejectedEmails, ...pendingEmails].filter(email => memberEmails.includes(email));

        console.log('❌ Non-approved apps found in members:', nonApprovedInMembers.length, '(should be 0)');

        // 6. Results
        console.log('\n🎉 TEST RESULTS:');
        console.log('==========================================');
        console.log(`📊 Members increase: ${initialMembersCount} → ${finalMembersCount} (+${finalMembersCount - initialMembersCount})`);
        console.log(`✅ Approved apps in members: ${approvedInMembers.length}/${approvedEmails.length}`);
        console.log(`❌ Non-approved apps in members: ${nonApprovedInMembers.length} (should be 0)`);
        console.log('==========================================');

        if (approvedInMembers.length === approvedEmails.length && nonApprovedInMembers.length === 0) {
            console.log('🎉 SUCCESS: ONLY APPROVED APPLICATIONS ARE IN COMMUNITY MEMBERS! 🎉');
            console.log('✅ Approved applications → Community members ✓');
            console.log('✅ Rejected applications → NOT in members ✓');
            console.log('✅ Pending applications → NOT in members ✓');
        } else {
            console.log('❌ ISSUE: Some non-approved applications found in members or approved missing');
            if (approvedInMembers.length !== approvedEmails.length) {
                console.log('❌ Some approved applications are missing from members');
            }
            if (nonApprovedInMembers.length > 0) {
                console.log('❌ Some non-approved applications are in members:', nonApprovedInMembers);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testOnlyApprovedToMembers();