// Test All Community Features with Supabase
async function testCommunityFeatures() {
    console.log('🧪 Testing Community Features with Supabase...\n');

    const API_BASE = 'http://localhost:5000/api';

    // First, get a community to test with
    console.log('1️⃣ Getting communities...');
    const communitiesResponse = await fetch(`${API_BASE}/communities`);
    const communitiesData = await communitiesResponse.json();

    if (!communitiesData.success || !communitiesData.data.length) {
        console.log('❌ No communities found. Create a community first.');
        return;
    }

    const testCommunity = communitiesData.data[0];
    console.log('✅ Using community:', testCommunity.name, '(ID:', testCommunity.id, ')');

    try {
        // Test Members
        console.log('\n2️⃣ Testing Members...');

        // Get members
        const membersResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const membersData = await membersResponse.json();
        console.log('📋 Current members:', membersData.success ? membersData.data.length : 'Error');

        // Add a member
        const newMember = {
            user_id: 'test-user-' + Date.now(),
            role: 'member',
            email: `test.member.${Date.now()}@temple.com`,
            full_name: 'Test Member'
        };

        const addMemberResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember)
        });

        const addMemberData = await addMemberResponse.json();
        console.log('👥 Add member result:', addMemberData.success ? 'Success' : addMemberData.message);

        // Test Tasks
        console.log('\n3️⃣ Testing Tasks...');

        // Get tasks
        const tasksResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
        const tasksData = await tasksResponse.json();
        console.log('📋 Current tasks:', tasksData.success ? tasksData.data.length : 'Error');

        // Create a task
        const newTask = {
            title: 'Test Task - ' + Date.now(),
            description: 'This is a test task created by the test script',
            status: 'todo',
            priority: 'medium',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        const createTaskResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        const createTaskData = await createTaskResponse.json();
        console.log('📝 Create task result:', createTaskData.success ? 'Success' : createTaskData.message);

        if (createTaskData.success) {
            const taskId = createTaskData.data._id || createTaskData.data.id;

            // Update task status
            const updateTaskResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'in_progress' })
            });

            const updateTaskData = await updateTaskResponse.json();
            console.log('📝 Update task result:', updateTaskData.success ? 'Success' : updateTaskData.message);
        }

        // Test Applications
        console.log('\n4️⃣ Testing Applications...');

        // Get applications
        const applicationsResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/applications`);
        const applicationsData = await applicationsResponse.json();
        console.log('📋 Current applications:', applicationsData.success ? applicationsData.data.length : 'Error');

        // Create an application
        const newApplication = {
            name: 'Test Applicant',
            email: `test.applicant.${Date.now()}@temple.com`,
            phone: '+91 9876543210',
            message: 'I would like to join this community',
            why_join: 'To contribute to the community activities',
            skills: ['organizing', 'communication'],
            experience: 'Previous volunteer experience'
        };

        const createApplicationResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newApplication)
        });

        const createApplicationData = await createApplicationResponse.json();
        console.log('📝 Create application result:', createApplicationData.success ? 'Success' : createApplicationData.message);

        // Test Events/Calendar
        console.log('\n5️⃣ Testing Events/Calendar...');

        // Get events
        const eventsResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/events`);
        const eventsData = await eventsResponse.json();
        console.log('📋 Current events:', eventsData.success ? eventsData.data.length : 'Error');

        // Create an event
        const newEvent = {
            title: 'Test Event - ' + Date.now(),
            description: 'This is a test event',
            start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
            location: 'Test Location',
            event_type: 'meeting',
            max_participants: 50
        };

        const createEventResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        const createEventData = await createEventResponse.json();
        console.log('📅 Create event result:', createEventData.success ? 'Success' : createEventData.message);

        console.log('\n🎉 Community Features Test Complete!');

        // Summary
        console.log('\n📊 Test Summary:');
        console.log('✅ Members:', membersData.success ? 'Working' : 'Failed');
        console.log('✅ Tasks:', tasksData.success ? 'Working' : 'Failed');
        console.log('✅ Applications:', applicationsData.success ? 'Working' : 'Failed');
        console.log('✅ Events:', eventsData.success ? 'Working' : 'Failed');

        console.log('\n🚀 Frontend Features Ready:');
        console.log('1. Navigate to a community detail page');
        console.log('2. Use the tabs: Members, Applications, Calendar, Tasks, Kanban, Reports, Timeline');
        console.log('3. All CRUD operations should work with Supabase');
        console.log('4. Search, filtering, and sorting should work');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testCommunityFeatures().catch(console.error);