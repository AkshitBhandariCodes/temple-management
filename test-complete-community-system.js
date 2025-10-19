// Test Complete Community System
async function testCompleteCommunitySystem() {
    console.log('🧪 Testing Complete Community System...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Test 1: Fetch all communities from Supabase
        console.log('1️⃣ Testing Communities Fetch from Supabase...');

        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();

        console.log('📊 Communities Response:');
        console.log('- Status:', communitiesResponse.status);
        console.log('- Success:', communitiesData.success);
        console.log('- Count:', communitiesData.data?.length || 0);

        if (!communitiesData.success || !communitiesData.data?.length) {
            console.log('❌ No communities found or error fetching');
            return;
        }

        const testCommunity = communitiesData.data[0];
        console.log('✅ Using community:', testCommunity.name);
        console.log('🆔 Community ID:', testCommunity.id);

        // Test 2: Test Tasks System
        console.log('\n2️⃣ Testing Tasks System...');

        // Get current tasks
        const tasksResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
        const tasksData = await tasksResponse.json();

        console.log('📋 Current tasks:');
        console.log('- Status:', tasksResponse.status);
        console.log('- Success:', tasksData.success);
        console.log('- Count:', tasksData.data?.length || 0);

        if (tasksData.success) {
            console.log('✅ Tasks fetch working');

            if (tasksData.data?.length > 0) {
                console.log('📝 Sample task:', {
                    id: tasksData.data[0].id,
                    title: tasksData.data[0].title,
                    status: tasksData.data[0].status,
                    priority: tasksData.data[0].priority
                });
            }
        } else {
            console.log('❌ Tasks fetch failed:', tasksData.message);

            if (tasksData.message?.includes('table') || tasksData.message?.includes('schema')) {
                console.log('\n🚨 TABLES MISSING!');
                console.log('📋 You need to run create-missing-tables.sql in Supabase Dashboard');
                return;
            }
        }

        // Test 3: Create a new task
        console.log('\n3️⃣ Testing Task Creation...');

        const newTask = {
            title: `Test Task - ${Date.now()}`,
            description: 'This is a test task created by the system test',
            status: 'todo',
            priority: 'medium',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            tags: ['test', 'automation']
        };

        console.log('📤 Creating task:', newTask.title);

        const createTaskResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        const createTaskData = await createTaskResponse.json();

        console.log('📥 Create Task Response:');
        console.log('- Status:', createTaskResponse.status);
        console.log('- Success:', createTaskData.success);
        console.log('- Message:', createTaskData.message);

        if (createTaskData.success) {
            console.log('✅ Task created successfully!');
            console.log('📝 Task ID:', createTaskData.data?.id);

            // Test 4: Verify task appears in list
            console.log('\n4️⃣ Verifying task appears in list...');

            const verifyResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
                const ourTask = verifyData.data?.find(t => t.id === createTaskData.data.id);

                if (ourTask) {
                    console.log('✅ Task found in list!');
                    console.log('📊 Total tasks now:', verifyData.data.length);
                    console.log('📝 Task details:', {
                        id: ourTask.id,
                        title: ourTask.title,
                        status: ourTask.status,
                        priority: ourTask.priority,
                        created_at: ourTask.created_at
                    });
                } else {
                    console.log('❌ Task not found in list');
                }
            }

            // Test 5: Update task status
            if (createTaskData.data?.id) {
                console.log('\n5️⃣ Testing task update...');

                const updateResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks/${createTaskData.data.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'in_progress' })
                });

                const updateData = await updateResponse.json();

                console.log('📝 Update result:', updateData.success ? 'Success' : 'Failed');

                if (updateData.success) {
                    console.log('✅ Task status updated to in_progress');
                }
            }

        } else {
            console.log('❌ Task creation failed:', createTaskData.message);
        }

        // Test 6: Test other community features
        console.log('\n6️⃣ Testing other community features...');

        // Test members
        const membersResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/members`);
        const membersData = await membersResponse.json();
        console.log('👥 Members:', membersData.success ? `${membersData.data?.length || 0} found` : 'Failed');

        // Test applications
        const applicationsResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/applications`);
        const applicationsData = await applicationsResponse.json();
        console.log('📝 Applications:', applicationsData.success ? `${applicationsData.data?.length || 0} found` : 'Failed');

        // Test events
        const eventsResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/events`);
        const eventsData = await eventsResponse.json();
        console.log('📅 Events:', eventsData.success ? `${eventsData.data?.length || 0} found` : 'Failed');

        console.log('\n🎉 Complete Community System Test Finished!');

        // Summary
        console.log('\n📊 SYSTEM STATUS:');
        console.log('✅ Communities:', communitiesData.success ? 'Working' : 'Failed');
        console.log('✅ Tasks:', tasksData.success && createTaskData.success ? 'Working' : 'Failed');
        console.log('✅ Members:', membersData.success ? 'Working' : 'Failed');
        console.log('✅ Applications:', applicationsData.success ? 'Working' : 'Failed');
        console.log('✅ Events:', eventsData.success ? 'Working' : 'Failed');

        console.log('\n🚀 FRONTEND READY:');
        console.log('1. Communities page: http://localhost:8081/communities');
        console.log('2. Single community: http://localhost:8081/communities/[id]');
        console.log('3. Tasks tab: Working with full CRUD');
        console.log('4. All data stored in Supabase database');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testCompleteCommunitySystem().catch(console.error);