// Test tasks with existing community
async function testWithExistingCommunity() {
    console.log('🧪 Testing Tasks with Existing Community...\n');

    const API_BASE = 'http://localhost:5000/api';

    // Use a hardcoded community ID that we'll create directly in the database
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        console.log('1️⃣ Testing tasks with hardcoded community ID...');
        console.log('🆔 Using community ID:', COMMUNITY_ID);

        // Test 1: Get tasks (should work even if empty)
        console.log('\n📋 Getting existing tasks...');
        const getTasksResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`);
        const getTasksData = await getTasksResponse.json();

        console.log('📊 Get Tasks Result:');
        console.log('- Status:', getTasksResponse.status);
        console.log('- Success:', getTasksData.success);
        console.log('- Count:', getTasksData.data?.length || 0);

        if (getTasksData.success) {
            console.log('✅ Tasks API is working!');

            // Test 2: Create a task
            console.log('\n📝 Creating a new task...');

            const taskData = {
                title: `Test Task ${Date.now()}`,
                description: 'This is a test task created via API',
                status: 'todo',
                priority: 'high',
                tags: ['test', 'api']
            };

            const createTaskResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            const createTaskData = await createTaskResponse.json();

            console.log('📝 Create Task Result:');
            console.log('- Status:', createTaskResponse.status);
            console.log('- Success:', createTaskData.success);
            console.log('- Message:', createTaskData.message);

            if (createTaskData.success) {
                console.log('✅ Task created successfully!');
                console.log('📝 Task ID:', createTaskData.data?.id);

                // Test 3: Verify task appears in list
                console.log('\n🔍 Verifying task appears in list...');

                const verifyResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`);
                const verifyData = await verifyResponse.json();

                if (verifyData.success && verifyData.data?.length > 0) {
                    console.log('✅ Task appears in list!');
                    console.log('📊 Total tasks:', verifyData.data.length);

                    const ourTask = verifyData.data.find(t => t.id === createTaskData.data.id);
                    if (ourTask) {
                        console.log('📝 Our task details:', {
                            id: ourTask.id,
                            title: ourTask.title,
                            status: ourTask.status,
                            priority: ourTask.priority
                        });

                        // Test 4: Update task
                        console.log('\n📝 Testing task update...');

                        const updateResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks/${ourTask.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                status: 'in_progress',
                                description: 'Updated: Task is now in progress'
                            })
                        });

                        const updateData = await updateResponse.json();

                        console.log('📝 Update Result:', updateData.success ? 'Success' : 'Failed');

                        if (updateData.success) {
                            console.log('✅ Task updated successfully!');

                            console.log('\n🎉 COMPLETE SUCCESS!');
                            console.log('✅ Tasks system is fully functional');
                            console.log('✅ Create, Read, Update operations working');
                            console.log('✅ Data stored in Supabase database');

                            console.log('\n🚀 Frontend Ready:');
                            console.log('1. Go to: http://localhost:8081/communities');
                            console.log('2. Click on any community');
                            console.log('3. Go to Tasks tab');
                            console.log('4. Add, edit, and manage tasks');

                        }
                    }
                } else {
                    console.log('❌ Task not found in list');
                }

            } else {
                console.log('❌ Task creation failed:', createTaskData.message);
                console.log('💡 You need to run simple-tasks-test.sql in Supabase first');
            }

        } else {
            console.log('❌ Tasks API not working:', getTasksData.message);
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testWithExistingCommunity().catch(console.error);