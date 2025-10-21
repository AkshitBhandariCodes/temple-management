const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4';

async function testTasksStructure() {
    console.log('🔍 Testing Tasks Structure and Kanban Functionality...\n');

    try {
        // 1. Get tasks for the community
        console.log('1️⃣ Getting tasks for community:', FRONTEND_COMMUNITY_ID);
        const tasksResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/tasks`
        );

        console.log('✅ Tasks API Response:', {
            success: tasksResponse.data.success,
            count: tasksResponse.data.data?.length || 0
        });

        if (tasksResponse.data.data && tasksResponse.data.data.length > 0) {
            console.log('\n📋 Sample Task Structure:');
            const sampleTask = tasksResponse.data.data[0];
            console.log('Raw task object:', JSON.stringify(sampleTask, null, 2));

            console.log('\n🔍 Task ID Analysis:');
            console.log('- task.id:', sampleTask.id);
            console.log('- task._id:', sampleTask._id);
            console.log('- Object.keys(task):', Object.keys(sampleTask));

            // Test what the frontend would get
            const frontendId = sampleTask.id || sampleTask._id;
            console.log('- Frontend would use:', frontendId);
            console.log('- Is undefined?:', frontendId === undefined);

            // Test updating the task status
            if (frontendId) {
                console.log('\n2️⃣ Testing task update (Kanban drag-and-drop simulation)...');
                try {
                    const updateResponse = await axios.put(
                        `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/tasks/${frontendId}`,
                        {
                            status: sampleTask.status === 'todo' ? 'in_progress' : 'todo',
                            updated_at: new Date().toISOString()
                        }
                    );
                    console.log('✅ Task update successful:', {
                        success: updateResponse.data.success,
                        message: updateResponse.data.message
                    });
                } catch (updateError) {
                    console.error('❌ Task update failed:', updateError.response?.data || updateError.message);
                }
            }
        } else {
            console.log('❌ No tasks found');

            // Create a test task to see the structure
            console.log('\n2️⃣ Creating test task to see structure...');
            const testTask = {
                title: 'Kanban Test Task',
                description: 'Testing kanban drag and drop functionality',
                status: 'todo',
                priority: 'medium',
                assigned_to: [],
                tags: ['test', 'kanban']
            };

            try {
                const createResponse = await axios.post(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/tasks`,
                    testTask
                );

                console.log('✅ Created task:', createResponse.data.data.id);

                // Now get tasks again to see the structure
                const newTasksResponse = await axios.get(
                    `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/tasks`
                );

                if (newTasksResponse.data.data && newTasksResponse.data.data.length > 0) {
                    console.log('\n📋 New Task Structure:');
                    const newTask = newTasksResponse.data.data.find(task => task.title === 'Kanban Test Task');
                    if (newTask) {
                        console.log('Raw task object:', JSON.stringify(newTask, null, 2));
                        console.log('\n🔍 Task ID Analysis:');
                        console.log('- task.id:', newTask.id);
                        console.log('- task._id:', newTask._id);
                        console.log('- Object.keys(task):', Object.keys(newTask));

                        // Test drag-and-drop update
                        console.log('\n3️⃣ Testing drag-and-drop update...');
                        const dragDropResponse = await axios.put(
                            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/tasks/${newTask.id}`,
                            { status: 'in_progress' }
                        );
                        console.log('✅ Drag-and-drop update successful:', dragDropResponse.data.message);
                    }
                }
            } catch (createError) {
                console.error('❌ Task creation failed:', createError.response?.data || createError.message);
            }
        }

        console.log('\n🎉 Kanban functionality should work with proper ID handling!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testTasksStructure();