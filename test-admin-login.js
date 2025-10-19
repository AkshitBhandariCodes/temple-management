// Test Admin Login
async function testAdminLogin() {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Admin Login...\n');
  
  try {
    const loginResponse = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@temple.com',
        password: 'password'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Admin Login Response:', loginData);
    
    if (loginData.success) {
      console.log('✅ Admin login successful!');
      console.log('User:', loginData.data.user);
      console.log('Role:', loginData.data.user.role);
      
      // Test creating a community
      console.log('\n🏛️ Testing Community Creation...');
      const createResponse = await fetch(`${baseUrl}/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.data.token}`
        },
        body: JSON.stringify({
          name: 'Test Community',
          description: 'A test community created via API',
          owner_id: loginData.data.user.id
        })
      });
      
      const createData = await createResponse.json();
      console.log('Create Community Response:', createData);
      
      if (createData.success) {
        console.log('✅ Community creation successful!');
      } else {
        console.log('❌ Community creation failed:', createData.message);
      }
    } else {
      console.log('❌ Admin login failed:', loginData.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAdminLogin().catch(console.error);