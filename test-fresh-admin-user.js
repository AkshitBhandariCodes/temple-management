// Test Admin Registration with Fresh User
async function testFreshAdminUser() {
    console.log('🧪 Testing Admin Registration with Fresh User...\n');

    const API_BASE = 'http://localhost:5000/api';
    const timestamp = Date.now();

    try {
        console.log('🎯 Testing admin registration with unique email...');

        const testUser = {
            full_name: `Fresh Chairman ${timestamp}`,
            email: `fresh.chairman.${timestamp}@temple.com`,
            password: 'TempPass123!',
            role: 'chairman',
            status: 'active'
        };

        console.log('📤 Registering user:', testUser.full_name);
        console.log('📧 Email:', testUser.email);
        console.log('👑 Role:', testUser.role);

        const response = await fetch(`${API_BASE}/users/admin-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        console.log('\n📥 Registration Response:');
        console.log('- Status:', response.status);
        console.log('- Success:', data.success);
        console.log('- Message:', data.message);
        console.log('- User ID:', data.data?.user?.id);
        console.log('- User Role:', data.data?.user?.role);
        console.log('- User Name:', data.data?.user?.full_name);

        if (data.success) {
            if (data.data?.user?.role === 'chairman') {
                console.log('\n✅ SUCCESS! Role properly saved as chairman!');

                // Test login to verify role persistence
                console.log('\n🔐 Testing login to verify role persistence...');

                const loginResponse = await fetch(`${API_BASE}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: testUser.email,
                        password: testUser.password
                    })
                });

                const loginData = await loginResponse.json();

                console.log('\n📥 Login Response:');
                console.log('- Status:', loginResponse.status);
                console.log('- Success:', loginData.success);
                console.log('- User Role:', loginData.data?.user?.role);
                console.log('- User Name:', loginData.data?.user?.full_name);

                if (loginData.success && loginData.data?.user?.role === 'chairman') {
                    console.log('\n🎉 PERFECT! Complete admin system working!');
                    console.log('✅ Admin registration saves role correctly');
                    console.log('✅ Role persists in database');
                    console.log('✅ Login returns correct role');
                    console.log('✅ End-to-end functionality complete');

                    console.log('\n🚀 Ready to use:');
                    console.log('1. Navigate to http://localhost:8081/admin');
                    console.log('2. Fill out the form with name, email, and role');
                    console.log('3. Click submit to register users');
                    console.log('4. Users can login with their assigned roles');

                } else {
                    console.log('\n⚠️  Login successful but role not correct');
                    console.log('Expected: chairman, Got:', loginData.data?.user?.role);
                }

            } else {
                console.log('\n⚠️  Registration successful but role not correct');
                console.log('Expected: chairman, Got:', data.data?.user?.role);
            }

        } else {
            console.log('\n❌ Registration failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testFreshAdminUser().catch(console.error);