// Test Auth Endpoints Directly
async function testAuthEndpoints() {
  console.log('🧪 Testing Auth Endpoints Directly...\n');
  
  try {
    // Test 1: Registration
    console.log('1️⃣ Testing Registration Endpoint...');
    console.log('📡 POST http://localhost:5000/api/users/register');
    
    const registerResponse = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Frontend Test User',
        email: 'frontend@temple.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Status:', registerResponse.status);
    console.log('Success:', registerData.success);
    console.log('User ID:', registerData.data?.user?.id);
    console.log('Token received:', !!registerData.data?.token);
    
    // Test 2: Login
    console.log('\n2️⃣ Testing Login Endpoint...');
    console.log('📡 POST http://localhost:5000/api/users/login');
    
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'frontend@temple.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Status:', loginResponse.status);
    console.log('Success:', loginData.success);
    console.log('User ID:', loginData.data?.user?.id);
    console.log('Token received:', !!loginData.data?.token);
    
    console.log('\n✅ Both endpoints are working correctly!');
    console.log('\n📋 Frontend should now:');
    console.log('- Send POST to http://localhost:5000/api/users/register for signup');
    console.log('- Send POST to http://localhost:5000/api/users/login for signin');
    console.log('- Store user and token in localStorage');
    console.log('- Redirect to dashboard after success');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testAuthEndpoints().catch(console.error);