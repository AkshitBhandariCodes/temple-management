// Test All Community Features
async function testAllCommunityFeatures() {
    console.log('🧪 Testing All Community Features...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        console.log('🎯 Testing all community features with working community...');
        console.log('🆔 Community ID:', COMMUNITY_ID);

        // Test 1: Members
        console.log('\n1️⃣ Testing Members...');
        const membersResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`);
        const membersData = await membersResponse.json();
        console.log('👥 Members:', {
            status: membersResponse.status,
            success: membersData.success,
            count: membersData.data?.length || 0,
            message: membersData.message
        });

        // Test 2: Applications
        console.log('\n2️⃣ Testing Applications...');
        const applicationsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/applications`);
        const applicationsData = await applicationsResponse.json();
        console.log('📝 Applications:', {
            status: applicationsResponse.status,
            success: applicationsData.success,
            count: applicationsData.data?.length || 0,
            message: applicationsData.message
        });

        // Test 3: Events/Calendar
        console.log('\n3️⃣ Testing Events/Calendar...');
        const eventsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/events`);
        const eventsData = await eventsResponse.json();
        console.log('📅 Events:', {
            status: eventsResponse.status,
            success: eventsData.success,
            count: eventsData.data?.length || 0,
            message: eventsData.message
        });

        // Test 4: Tasks (we know this works)
        console.log('\n4️⃣ Testing Tasks (should work)...');
        const tasksResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`);
        const tasksData = await tasksResponse.json();
        console.log('📋 Tasks:', {
            status: tasksResponse.status,
            success: tasksData.success,
            count: tasksData.data?.length || 0,
            message: tasksData.message
        });

        console.log('\n📊 FEATURE STATUS SUMMARY:');
        console.log('✅ Tasks:', tasksData.success ? 'Working' : 'Failed');
        console.log('📝 Members:', membersData.success ? 'Working' : 'Failed');
        console.log('📝 Applications:', applicationsData.success ? 'Working' : 'Failed');
        console.log('📝 Events:', eventsData.success ? 'Working' : 'Failed');

        // Identify what needs fixing
        const needsFix = [];
        if (!membersData.success) needsFix.push('Members');
        if (!applicationsData.success) needsFix.push('Applications');
        if (!eventsData.success) needsFix.push('Events');

        if (needsFix.length > 0) {
            console.log('\n🔧 NEEDS FIXING:', needsFix.join(', '));
            console.log('💡 Will fix these to work like Tasks');
        } else {
            console.log('\n🎉 ALL FEATURES WORKING!');
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testAllCommunityFeatures().catch(console.error);