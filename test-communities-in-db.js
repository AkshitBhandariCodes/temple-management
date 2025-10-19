// Test what communities actually exist in Supabase
async function testCommunitiesInDB() {
    console.log('🔍 Testing Communities in Supabase DB...\n');

    const API_BASE = 'http://localhost:5000/api';

    try {
        // Get communities from API
        console.log('1️⃣ Getting communities from API...');
        const apiResponse = await fetch(`${API_BASE}/communities`);
        const apiData = await apiResponse.json();

        console.log('📊 API Communities:');
        console.log('- Status:', apiResponse.status);
        console.log('- Success:', apiData.success);
        console.log('- Count:', apiData.data?.length || 0);

        if (apiData.data?.length > 0) {
            console.log('\n📋 Communities from API:');
            apiData.data.forEach((community, index) => {
                console.log(`${index + 1}. ${community.name} (ID: ${community.id})`);
            });

            // Try to create a task with the first community
            const testCommunity = apiData.data[0];
            console.log('\n2️⃣ Testing task creation with first community...');
            console.log('🆔 Using community ID:', testCommunity.id);

            const taskData = {
                title: 'Simple Test Task',
                description: 'Testing task creation',
                status: 'todo',
                priority: 'medium'
            };

            const taskResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            const taskResult = await taskResponse.json();

            console.log('📝 Task Creation Result:');
            console.log('- Status:', taskResponse.status);
            console.log('- Success:', taskResult.success);
            console.log('- Message:', taskResult.message);

            if (taskResult.success) {
                console.log('✅ Task created successfully!');
                console.log('📝 Task ID:', taskResult.data?.id);

                // Verify task appears in list
                const verifyResponse = await fetch(`${API_BASE}/communities/${testCommunity.id}/tasks`);
                const verifyData = await verifyResponse.json();

                console.log('📊 Tasks after creation:', verifyData.data?.length || 0);

                if (verifyData.data?.length > 0) {
                    console.log('✅ Task appears in list!');
                    console.log('📝 Latest task:', verifyData.data[0]);
                }
            } else {
                console.log('❌ Task creation failed:', taskResult.message);
            }
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testCommunitiesInDB().catch(console.error);