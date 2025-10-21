const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function testMembersTabDisplay() {
    console.log('🎯 Testing Members Tab Display - Approved Community Members...\n');

    try {
        // 1. Get the community details
        console.log('1️⃣ Getting community details...');
        const communityResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}`
        );
        console.log('✅ Community:', {
            name: communityResponse.data.data.name,
            id: communityResponse.data.data.id
        });

        // 2. Get members for the Members tab
        console.log('\n2️⃣ Fetching members for Members tab...');
        const membersResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
        );

        console.log('✅ Members API Response:', {
            success: membersResponse.data.success,
            total: membersResponse.data.total,
            count: membersResponse.data.data?.length || 0,
            source: membersResponse.data.source || 'unknown'
        });

        if (membersResponse.data.data && membersResponse.data.data.length > 0) {
            console.log('\n📋 Members Tab Data Structure:');
            const sampleMember = membersResponse.data.data[0];
            console.log('Sample member object:', JSON.stringify(sampleMember, null, 2));

            console.log('\n👥 All Members in this Community:');
            membersResponse.data.data.forEach((member, index) => {
                console.log(`${index + 1}. ${member.full_name} (${member.email}) - ${member.role} - ${member.status}`);
                if (member.skills && member.skills.length > 0) {
                    console.log(`   Skills: ${member.skills.join(', ')}`);
                }
                if (member.experience) {
                    console.log(`   Experience: ${member.experience}`);
                }
                console.log(`   Joined: ${member.joined_at}`);
                console.log('');
            });

            // 3. Verify these are only approved members
            console.log('3️⃣ Verifying these are ONLY approved members...');

            // Get all applications to cross-check
            const applicationsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
            );

            const allApplications = applicationsResponse.data.data;
            const approvedApplications = allApplications.filter(app => app.status === 'approved');
            const rejectedApplications = allApplications.filter(app => app.status === 'rejected');
            const pendingApplications = allApplications.filter(app => app.status === 'pending');

            console.log('📊 Applications breakdown:');
            console.log(`   - Total applications: ${allApplications.length}`);
            console.log(`   - Approved: ${approvedApplications.length}`);
            console.log(`   - Rejected: ${rejectedApplications.length}`);
            console.log(`   - Pending: ${pendingApplications.length}`);

            // Check if members match approved applications
            const memberEmails = membersResponse.data.data.map(m => m.email);
            const approvedEmails = approvedApplications.map(app => app.email);

            console.log('\n🔍 Cross-verification:');
            console.log('Members emails:', memberEmails);
            console.log('Approved application emails:', approvedEmails);

            const membersMatchApproved = memberEmails.every(email => approvedEmails.includes(email));
            const approvedMatchMembers = approvedEmails.every(email => memberEmails.includes(email));

            console.log('\n✅ Verification Results:');
            console.log(`   - All members are from approved applications: ${membersMatchApproved ? '✅ YES' : '❌ NO'}`);
            console.log(`   - All approved applications are in members: ${approvedMatchMembers ? '✅ YES' : '❌ NO'}`);

            // 4. Check for any non-approved members
            const rejectedEmails = rejectedApplications.map(app => app.email);
            const pendingEmails = pendingApplications.map(app => app.email);

            const rejectedInMembers = memberEmails.filter(email => rejectedEmails.includes(email));
            const pendingInMembers = memberEmails.filter(email => pendingEmails.includes(email));

            console.log('\n🚫 Non-approved check:');
            console.log(`   - Rejected applications in members: ${rejectedInMembers.length} (should be 0)`);
            console.log(`   - Pending applications in members: ${pendingInMembers.length} (should be 0)`);

            if (rejectedInMembers.length > 0) {
                console.log('❌ Found rejected applications in members:', rejectedInMembers);
            }
            if (pendingInMembers.length > 0) {
                console.log('❌ Found pending applications in members:', pendingInMembers);
            }

            // 5. Final assessment
            console.log('\n🎉 MEMBERS TAB ASSESSMENT:');
            console.log('==========================================');
            if (membersMatchApproved && approvedMatchMembers && rejectedInMembers.length === 0 && pendingInMembers.length === 0) {
                console.log('🎉 PERFECT! Members tab shows ONLY approved community members! 🎉');
                console.log('✅ Frontend Members tab will display:');
                console.log(`   - ${membersResponse.data.data.length} approved community members`);
                console.log('   - Complete member profiles with skills and experience');
                console.log('   - Proper member roles and status');
                console.log('   - Join dates and contact information');
            } else {
                console.log('❌ Issues found with members display');
            }
            console.log('==========================================');

        } else {
            console.log('📭 No members found for this community');
            console.log('💡 This could mean:');
            console.log('   - No applications have been approved yet');
            console.log('   - API endpoint issue');
            console.log('   - Community has no members');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testMembersTabDisplay();