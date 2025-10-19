// Test Tasks Only
async function testTasksOnly() {
    console.log('🧪 Testing Tasks System Only...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get a community first
        const communitiesResponse = await fetch(`${API_BASE}/communities`);
        const communitiesData = await communitiesResponse.json();

        if (!communitiesData.success || !communitiesData.data?.length) {
            console.log('❌ No communities found');
            return;
        }

        const testCommunity = communitiesData.data[0];
        console.log('📋 Using community:', testCommunity.name);
        console.log('🆔 Community ID:', testCommunity.id);

        // Test 1: Get tasks
        console.log('\n1️⃣ Testing get tasks...');

        const tasksResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
        const tasksData = await tasksResponse.json();

        console.log('📊 Tasks Response:');
        console.log('- Status:', tasksResponse.status);
        console.log('- Success:', tasksData.success);
        console.log('- Message:', tasksData.message);
        console.log('- Count:', tasksData.data?.length || 0);

        if (tasksData.success) {
            console.log('✅ Tasks table exists and is accessible');

            if (tasksData.data?.length > 0) {
                console.log('📝 Existing tasks:');
                tasksData.data.forEach((task, index) => {
                    console.log(`${index + 1}. ${task.title} (${task.status}) - ${task.priority}`);
                });
            }

            // Test 2: Create a task
            console.log('\n2️⃣ Testing create task...');

            const newTask = {
                title: `API Test Task - ${Date.now()}`,
                description: 'This task was created via API test',
                status: 'todo',
                priority: 'high',
                tags: ['api-test', 'automation']
            };

            console.log('📤 Creating task:', newTask.title);

            const createResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            const createData = await createResponse.json();

            console.log('📥 Create Response:');
            console.log('- Status:', createResponse.status);
            console.log('- Success:', createData.success);
            console.log('- Message:', createData.message);

            if (createData.success) {
                console.log('✅ Task created successfully!');
                console.log('📝 Task ID:', createData.data?.id);

                // Test 3: Verify task appears
                console.log('\n3️⃣ Verifying task appears in list...');

                const verifyResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                    const ourTask = verifyData.data?.find(t => t.id === createData.data.id);

                    if (ourTask) {
                        console.log('✅ Task found in list!');
                        console.log('📊 Total tasks:', verifyData.data.length);
                        console.log('📝 Our task:', {
                            id: ourTask.id,
                            title: ourTask.title,
                            status: ourTask.status,
                            priority: ourTask.priority
                        });

                        // Test 4: Update task
                        console.log('\n4️⃣ Testing task update...');

                        const updateResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks/${ourTask.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                status: 'in_progress',
                                description: 'Updated: Task is now in progress'
                            })
                        });

                        const updateData = await updateResponse.json();

                        console.log('📝 Update result:', updateData.success ? 'Success' : 'Failed');

                        if (updateData.success) {
                            console.log('✅ Task updated successfully!');
                        }

                    } else {
                        console.log('❌ Task not found in list');
                    }
                }

            } else {
                console.log('❌ Task creation failed:', createData.message);
            }

        } else {
            console.log('❌ Tasks system not working:', tasksData.message);

            if (tasksData.message?.includes('table') || tasksData.message?.includes('schema')) {
                console.log('\n🚨 COMMUNITY_TASKS TABLE MISSING!');
                console.log('📋 TO FIX:');
                console.log('1. Go to Supabase Dashboard → SQL Editor');
                console.log('2. Copy and run create-tasks-table-only.sql');
                console.log('3. Run this test again');
            }
        }

        console.log('\n🎉 Tasks Test Complete!');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testTasksOnly().catch(console.error);