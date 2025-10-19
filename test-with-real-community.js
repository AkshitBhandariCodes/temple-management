// Test with a real community ID from Supabase
async function testWithRealCommunity() {
    console.log('🧪 Testing with Real Community from Supabase...\n');

    const API_BASE = 'http://localhost:5000/api';

    // Use a known community ID that should exist in Supabase
    // Let's try creating a community first, then use it for tasks

    try {
        console.log('1️⃣ Creating a new community...');

        const newCommunity = {
            name: 'Tasks Test Community',
            slug: 'tasks-test-community',
            description: 'A community specifically for testing tasks',
            owner_id: 'test-owner-123',
            status: 'active'
        };

        const createResponse = await fetch(`${API_BASE}/communities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCommunity)
        });

        const createData = await createResponse.json();

        console.log('📊 Community Creation:');
        console.log('- Status:', createResponse.status);
        console.log('- Success:', createData.success);
        console.log('- Message:', createData.message);

        if (createData.success && createData.data?.id) {
            const communityId = createData.data.id;
            console.log('✅ Community created with ID:', communityId);

            // Now test tasks with this community
            console.log('\n2️⃣ Testing tasks with new community...');

            const taskData = {
                title: 'First Task in New Community',
                description: 'Testing task creation in newly created community',
                status: 'todo',
                priority: 'high'
            };

            const taskResponse = await fetch(`${API_BASE}/communities/${communityId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            const taskResult = await taskResponse.json();

            console.log('📝 Task Creation:');
            console.log('- Status:', taskResponse.status);
            console.log('- Success:', taskResult.success);
            console.log('- Message:', taskResult.message);

            if (taskResult.success) {
                console.log('✅ Task created successfully!');
                console.log('📝 Task ID:', taskResult.data?.id);

                // Get tasks to verify
                const getTasksResponse = await fetch(`${API_BASE}/communities/${communityId}/tasks`);
                const getTasksData = await getTasksResponse.json();

                console.log('\n3️⃣ Verifying tasks list...');
                console.log('📊 Tasks count:', getTasksData.data?.length || 0);

                if (getTasksData.data?.length > 0) {
                    console.log('✅ Tasks system working perfectly!');
                    console.log('📝 Tasks:', getTasksData.data.map(t => ({
                        id: t.id,
                        title: t.title,
                        status: t.status,
                        priority: t.priority
                    })));

                    console.log('\n🎉 SUCCESS! Tasks system is fully functional!');
                    console.log('🚀 You can now:');
                    console.log('1. Go to http://localhost:8081/communities');
                    console.log('2. Click on any community');
                    console.log('3. Go to Tasks tab');
                    console.log('4. Add, edit, and manage tasks');

                } else {
                    console.log('❌ Tasks not appearing in list');
                }

            } else {
                console.log('❌ Task creation failed:', taskResult.message);
            }

        } else {
            console.log('❌ Community creation failed:', createData.message);
            console.log('💡 This might be due to RLS policy issues');
            console.log('📋 Try running fix-rls-policies.sql in Supabase Dashboard');
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testWithRealCommunity().catch(console.error);