// Debug Members Issue
async function debugMembers() {
    console.log('🔍 Debugging Members Issue...\n');

    const API_BASE = 'http://localhost:5000/api';
    const COMMUNITY_ID = '12345678-1234-1234-1234-123456789abc';

    try {
        // Test 1: Get members with different status filters
        console.log('1️⃣ Testing different status filters...');

        const statuses = ['active', 'inactive', 'all'];

        for (const status of statuses) {
            const response = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members?status=${status}`);
            const data = await response.json();

            console.log(`📊 Status "${status}":`, {
                success: data.success,
                count: data.data?.length || 0,
                message: data.message
            });

            if (data.data?.length > 0) {
                console.log('   Sample member:', data.data[0]);
            }
        }

        // Test 2: Create a member and check immediately
        console.log('\n2️⃣ Creating member and checking immediately...');

        const memberData = {
            user_id: `debug-user-${Date.now()}`,
            role: 'member',
            email: `debug.member.${Date.now()}@temple.com`,
            full_name: 'Debug Member'
        };

        console.log('📤 Creating member:', memberData.full_name);

        const createResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });

        const createData = await createResponse.json();

        console.log('📥 Create result:', {
            status: createResponse.status,
            success: createData.success,
            message: createData.message,
            data: createData.data
        });

        if (createData.success) {
            // Check immediately with all status
            console.log('\n3️⃣ Checking members immediately after creation...');

            const checkResponse = await fetch(`${API_BASE}/communities/${COMMUNITY_ID}/members?status=all`);
            const checkData = await checkResponse.json();

            console.log('📊 Members after creation:', {
                success: checkData.success,
                count: checkData.data?.length || 0
            });

            if (checkData.data?.length > 0) {
                console.log('✅ Members found!');
                checkData.data.forEach((member, index) => {
                    console.log(`   ${index + 1}. ${member.user_id} (${member.role}) - ${member.status}`);
                });
            } else {
                console.log('❌ No members found even after creation');
                console.log('💡 This suggests the member is not being saved to database');
            }
        }

    } catch (error) {
        console.error('❌ Debug Error:', error.message);
    }
}

debugMembers().catch(console.error);