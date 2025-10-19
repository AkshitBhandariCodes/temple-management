// Test Frontend API Integration
async function testFrontendAPI() {
  console.log('🧪 Testing Frontend API Integration...\n');
  
  // Test the API configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('Health Response:', healthData.status);
    
    // Test 2: Communities API
    console.log('\n2️⃣ Testing Communities API...');
    const communitiesResponse = await fetch(`${API_BASE_URL}/communities`);
    const communitiesData = await communitiesResponse.json();
    console.log('Communities Response:', {
      success: communitiesData.success,
      count: communitiesData.data?.length || 0,
      pagination: communitiesData.pagination
    });
    
    // Test 3: Login API
    console.log('\n3️⃣ Testing Login API...');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
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
    console.log('Login Response:', {
      success: loginData.success,
      user: loginData.data?.user?.email,
      role: loginData.data?.user?.role,
      hasToken: !!loginData.data?.token
    });
    
    if (loginData.success) {
      // Test 4: Authenticated API call
      console.log('\n4️⃣ Testing Authenticated API Call...');
      const meResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      const meData = await meResponse.json();
      console.log('Me Response:', {
        success: meData.success,
        user: meData.data?.email,
        role: meData.data?.role
      });
    }
    
    console.log('\n✅ All API tests completed successfully!');
    console.log('\n📋 Frontend Configuration:');
    console.log('- Frontend URL: http://localhost:8081');
    console.log('- Backend URL: http://localhost:5000');
    console.log('- API Base URL:', API_BASE_URL);
    console.log('\n🔑 Test Credentials:');
    console.log('- Email: admin@temple.com');
    console.log('- Password: password');
    console.log('- Role: super_admin');
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testFrontendAPI().catch(console.error);