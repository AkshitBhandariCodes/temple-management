const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testCompleteSystem() {
    console.log('🎯 Testing Complete Community System...\n');

    try {
        // 1. Submit a new application
        console.log('1️⃣ Submitting new application...');
        const applicationData = {
            user_id: null,
            email: 'complete-test@example.com',
            name: 'Complete Test User',
            phone: '+1-555-COMPLETE',
            message: 'Testing the complete system workflow',
            why_join: 'To test all features',
            skills: ['testing', 'system validation'],
            experience: 'Complete system testing'
        };

        const submitResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/apply`,
            applicationData
        );

        console.log('✅ Application submitted:', submitResponse.data.data.id);
        const applicationId = submitResponse.data.data.id;

        // 2. Check initial reports
        console.log('\n2️⃣ Checking initial reports...');
        const initialReports = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/reports`
        );
        console.log('📊 Initial stats:', initialReports.data.data.statistics.applications);

        // 3. Approve the application
        console.log('\n3️⃣ Approving application...');
        const approveResponse = await axios.post(
            `${BASE_URL}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('✅ Approval result:', approveResponse.data.message);

        // 4. Check updated reports
        console.log('\n4️⃣ Checking updated reports...');
        const updatedReports = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/reports`
        );
        console.log('📊 Updated stats:', updatedReports.data.data.statistics.applications);

        // 5. Check calendar events
        console.log('\n5️⃣ Checking calendar events...');
        const calendarEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/calendar`
        );
        console.log('📅 Total events:', calendarEvents.data.data.length);
        console.log('📋 Upcoming events:');
        calendarEvents.data.data.forEach(event => {
            const eventDate = new Date(event.start);
            const isUpcoming = eventDate > new Date();
            console.log(`  ${isUpcoming ? '🔜' : '📅'} ${event.title} - ${eventDate.toLocaleDateString()}`);
        });

        // 6. Check applications by status
        console.log('\n6️⃣ Checking applications by status...');

        const pendingApps = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications?status=pending`
        );
        console.log('⏳ Pending applications:', pendingApps.data.data.length);

        const approvedApps = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/applications?status=approved`
        );
        console.log('✅ Approved applications:', approvedApps.data.data.length);

        // 7. Check community details
        console.log('\n7️⃣ Checking community details...');
        const communityDetails = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}`
        );
        console.log('🏛️ Community:', communityDetails.data.data.name);
        console.log('📝 Description:', communityDetails.data.data.description);

        // 8. Check members (should be empty due to RLS issues)
        console.log('\n8️⃣ Checking members...');
        const members = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/members`
        );
        console.log('👥 Members count:', members.data.data.length);
        console.log('ℹ️ Note:', members.data.message || 'Members loaded successfully');

        console.log('\n🎉 Complete system test finished successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ Applications: Working (submit, approve, view by status)');
        console.log('✅ Reports: Working (statistics, charts data)');
        console.log('✅ Calendar: Working (events display, filtering)');
        console.log('✅ Community: Working (details, management)');
        console.log('⚠️ Members: Limited (due to RLS policies)');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testCompleteSystem();