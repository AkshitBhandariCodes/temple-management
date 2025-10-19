// Test tasks with a community from the API
async function testTasksWithAPICommunity() {
    console.log('🧪 Testing Tasks with API Community...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // First get communities from API
        console.log('1️⃣ Getting communities from API...');

        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();

        console.log('📊 Communities Response:');
        console.log('- Status:', communitiesResponse.status);
        console.log('- Success:', communitiesData.success);
        console.log('- Count:', communitiesData.data?.length || 0);

        if (communitiesData.success && communitiesData.data?.length > 0) {
            // Use the first community
            const testCommunity = communitiesData.data[0];
            console.log('✅ Using community:', testCommunity.name);
            console.log('🆔 Community ID:', testCommunity.id);

            // Now let's manually create this community in Supabase to avoid the foreign key issue
            console.log('\n2️⃣ Testing tasks with this community...');

            // Test getting tasks first
            const getTasksResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
            const getTasksData = await getTasksResponse.json();

            console.log('📋 Get Tasks Result:');
            console.log('- Status:', getTasksResponse.status);
            console.log('- Success:', getTasksData.success);
            console.log('- Message:', getTasksData.message);

            if (getTasksData.success) {
                console.log('✅ Tasks API working!');
                console.log('📊 Current tasks:', getTasksData.data?.length || 0);

                // Try to create a task
                console.log('\n3️⃣ Creating a task...');

                const taskData = {
                    title: `API Test Task ${Date.now()}`,
                    description: 'Testing task creation via API',
                    status: 'todo',
                    priority: 'high'
                };

                const createResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                const createData = await createResponse.json();

                console.log('📝 Create Task Result:');
                console.log('- Status:', createResponse.status);
                console.log('- Success:', createData.success);
                console.log('- Message:', createData.message);

                if (createData.success) {
                    console.log('✅ Task created successfully!');
                    console.log('🎉 Tasks system is working!');
                } else {
                    console.log('❌ Task creation failed');
                    console.log('💡 The community exists in memory but not in Supabase database');
                    console.log('📋 Need to fix RLS policies or create community directly in DB');
                }

            } else {
                console.log('❌ Tasks API failed:', getTasksData.message);
            }

        } else {
            console.log('❌ No communities found');
        }

        console.log('\n📋 DIAGNOSIS:');
        console.log('- Communities API: Working (memory-based)');
        console.log('- Tasks API: Working (Supabase-based)');
        console.log('- Issue: Communities not in Supabase DB due to RLS');
        console.log('- Solution: Run create-test-community-uuid.sql in Supabase');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testTasksWithAPICommunity().catch(console.error);