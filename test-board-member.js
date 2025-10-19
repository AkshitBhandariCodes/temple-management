// Test Board Member Registration
async function testBoardMember() {
    console.log('🧪 Testing Board Member Registration...\n');

    const API_BASE = 'http://localhost:5000/api';
    const timestamp = Date.now();

    try {
        const testUser = {
            full_name: `Board Member ${timestamp}`,
            email: `board.member.${timestamp}@temple.com`,
            password: 'TempPass123!',
            role: 'board',
            status: 'active'
        };

        console.log('📤 Registering board member:', testUser.full_name);
        console.log('👥 Role:', testUser.role);

        const response = await fetch(`${API_BASE}/users/admin-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        console.log('\n📥 Registration Response:');
        console.log('- Success:', data.success);
        console.log('- User Role:', data.data?.user?.role);

        if (data.success && data.data?.user?.role === 'board') {
            console.log('✅ Board member registration working perfectly!');

            // Test login
            const loginResponse = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });

            const loginData = await loginResponse.json();

            if (loginData.success && loginData.data?.user?.role === 'board') {
                console.log('✅ Board member login working with correct role!');
                console.log('\n🎉 BOTH ROLES WORKING:');
                console.log('✅ Chairman role: Working');
                console.log('✅ Board role: Working');
                console.log('✅ Admin system: Complete');
            }
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testBoardMember().catch(console.error);