// Test Individual Features One by One
async function testIndividualFeatures() {
    console.log('🧪 Testing Individual Features...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        console.log('🆔 Using community ID:', COMMUNITY_ID);

        // Test 1: Tasks (we know this works)
        console.log('\n1️⃣ Testing Tasks (should work)...');
        try {
            const tasksResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`);
            const tasksData = await tasksResponse.json();
            console.log('📋 Tasks:', {
                status: tasksResponse.status,
                success: tasksData.success,
                count: tasksData.data?.length || 0
            });
        } catch (error) {
            console.log('❌ Tasks error:', error.message);
        }

        // Test 2: Members
        console.log('\n2️⃣ Testing Members...');
        try {
            const membersResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`);
            const membersData = await membersResponse.json();
            console.log('👥 Members GET:', {
                status: membersResponse.status,
                success: membersData.success,
                count: membersData.data?.length || 0,
                message: membersData.message
            });

            // Try to create a member
            console.log('   Creating member...');
            const memberCreateResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: `test-${Date.now()}`,
                    role: 'member',
                    email: `test@example.com`,
                    full_name: 'Test User'
                })
            });
            const memberCreateData = await memberCreateResponse.json();
            console.log('   Create result:', {
                status: memberCreateResponse.status,
                success: memberCreateData.success,
                message: memberCreateData.message
            });
        } catch (error) {
            console.log('❌ Members error:', error.message);
        }

        // Test 3: Applications
        console.log('\n3️⃣ Testing Applications...');
        try {
            const applicationsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/applications`);
            const applicationsData = await applicationsResponse.json();
            console.log('📝 Applications GET:', {
                status: applicationsResponse.status,
                success: applicationsData.success,
                count: applicationsData.data?.length || 0
            });

            // Try to create an application
            console.log('   Creating application...');
            const appCreateResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Applicant',
                    email: `applicant-${Date.now()}@example.com`,
                    message: 'Test application'
                })
            });
            const appCreateData = await appCreateResponse.json();
            console.log('   Create result:', {
                status: appCreateResponse.status,
                success: appCreateData.success,
                message: appCreateData.message
            });
        } catch (error) {
            console.log('❌ Applications error:', error.message);
        }

        // Test 4: Events
        console.log('\n4️⃣ Testing Events...');
        try {
            const eventsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/events`);
            const eventsData = await eventsResponse.json();
            console.log('📅 Events GET:', {
                status: eventsResponse.status,
                success: eventsData.success,
                count: eventsData.data?.length || 0
            });

            // Try to create an event
            console.log('   Creating event...');
            const eventCreateResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Test Event',
                    description: 'Test event description',
                    start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    location: 'Test Location'
                })
            });
            const eventCreateData = await eventCreateResponse.json();
            console.log('   Create result:', {
                status: eventCreateResponse.status,
                success: eventCreateData.success,
                message: eventCreateData.message
            });
        } catch (error) {
            console.log('❌ Events error:', error.message);
        }

        console.log('\n📊 SUMMARY:');
        console.log('If any feature shows "fetch failed", the backend crashed');
        console.log('If status is 500, there\'s a server error');
        console.log('If status is 200/201 and success is true, it\'s working');

    } catch (error) {
        console.error('❌ Overall Test Error:', error.message);
    }
}

testIndividualFeatures().catch(console.error);