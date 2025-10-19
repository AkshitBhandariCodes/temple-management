// Test Frontend Login API
async function testFrontendLogin() {
  console.log('🧪 Testing Frontend Login API...\n');
  
  // This simulates what the frontend does
  const BASE_URL = 'http://localhost:5000/api'; // This should match VITE_API_URL
  
  try {
    console.log('🔗 API Base URL:', BASE_URL);
    console.log('📡 Testing login endpoint:', `${BASE_URL}/users/login`);
    
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@temple.com',
        password: 'password'
      })
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('👤 User:', data.data.user.email);
      console.log('🔑 Role:', data.data.user.role);
      console.log('🎫 Token received:', !!data.data.token);
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('❌ Login failed:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testFrontendLogin().catch(console.error);