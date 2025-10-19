// Debug Members in Detail
async function debugMembersDetailed() {
    console.log('🔍 Debugging Members in Detail...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        // Test 1: Create multiple members and track them
        console.log('1️⃣ Creating multiple members...');

        const membersToCreate = [
            { user_id: `member-1-${Date.now()}`, role: 'member', full_name: 'Member One' },
            { user_id: `member-2-${Date.now()}`, role: 'moderator', full_name: 'Member Two' },
            { user_id: `member-3-${Date.now()}`, role: 'lead', full_name: 'Member Three' }
        ];

        const createdMembers = [];

        for (const memberData of membersToCreate) {
            console.log(`   Creating: ${memberData.full_name}`);

            const createResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });

            const createData = await createResponse.json();

            console.log(`   Result: ${createData.success ? 'Success' : 'Failed'} (${createResponse.status})`);

            if (createData.success) {
                createdMembers.push({
                    ...memberData,
                    response: createData.data
                });
            }
        }

        console.log(`\n📊 Created ${createdMembers.length} members successfully`);

        // Test 2: Check with different filters
        console.log('\n2️⃣ Checking with different filters...');

        const filters = [
            { name: 'Default (active)', params: '' },
            { name: 'All status', params: '?status=all' },
            { name: 'Active only', params: '?status=active' },
            { name: 'Inactive only', params: '?status=inactive' },
            { name: 'Member role', params: '?role=member' },
            { name: 'All roles', params: '?role=all' }
        ];

        for (const filter of filters) {
            const response = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members${filter.params}`);
            const data = await response.json();

            console.log(`   ${filter.name}: ${data.success ? data.data?.length || 0 : 'Failed'} members`);

            if (data.data?.length > 0) {
                console.log(`      Sample: ${data.data[0].user_id} (${data.data[0].role})`);
            }
        }

        // Test 3: Compare with other working features
        console.log('\n3️⃣ Comparing with working features...');

        // Check applications (we know this works)
        const appsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/applications`);
        const appsData = await appsResponse.json();
        console.log(`   Applications: ${appsData.data?.length || 0} found`);

        // Check events (we know this works)
        const eventsResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/events`);
        const eventsData = await eventsResponse.json();
        console.log(`   Events: ${eventsData.data?.length || 0} found`);

        // Check tasks (we know this works)
        const tasksResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/tasks`);
        const tasksData = await tasksResponse.json();
        console.log(`   Tasks: ${tasksData.data?.length || 0} found`);

        console.log('\n🔍 DIAGNOSIS:');
        if (createdMembers.length > 0) {
            console.log('✅ Member creation API is working');
            console.log('❌ Members not appearing in GET requests');
            console.log('💡 Possible causes:');
            console.log('   • community_members table doesn\'t exist');
            console.log('   • RLS policies blocking reads');
            console.log('   • Data not actually being inserted');
            console.log('   • Query filtering out all results');
            console.log('\n📋 SOLUTION: Run create-all-missing-tables.sql in Supabase');
        } else {
            console.log('❌ Member creation is failing');
        }

    } catch (error) {
        console.error('❌ Debug Error:', error.message);
    }
}

debugMembersDetailed().catch(console.error);