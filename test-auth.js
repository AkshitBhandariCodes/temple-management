// Test Authentication Script
// This script tests the authentication flow

async function testAuth() {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Authentication Flow...\n');
  
  // Test 1: Register a new user
  console.log('1️⃣ Testing User Registration...');
  try {
    const registerResponse = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@temple.com',
        password: 'password123',
        full_name: 'Test User'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);
    
    if (registerData.success) {
      console.log('✅ Registration successful!');
      console.log('Token:', registerData.data.token);
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: Login with the user
  console.log('2️⃣ Testing User Login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@temple.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    
    if (loginData.success) {
      console.log('✅ Login successful!');
      console.log('User:', loginData.data.user);
      console.log('Token:', loginData.data.token);
      
      // Test 3: Get current user with token
      console.log('\n3️⃣ Testing Get Current User...');
      const meResponse = await fetch(`${baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      const meData = await meResponse.json();
      console.log('Me Response:', meData);
      
      if (meData.success) {
        console.log('✅ Get current user successful!');
      } else {
        console.log('❌ Get current user failed:', meData.message);
      }
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  console.log('\n');
  
  // Test 4: Test Communities API
  console.log('4️⃣ Testing Communities API...');
  try {
    const communitiesResponse = await fetch(`${baseUrl}/communities`);
    const communitiesData = await communitiesResponse.json();
    console.log('Communities Response:', communitiesData);
    
    if (communitiesData.success) {
      console.log('✅ Communities API working!');
      console.log('Communities count:', communitiesData.data.length);
    } else {
      console.log('❌ Communities API failed:', communitiesData.message);
    }
  } catch (error) {
    console.log('❌ Communities API error:', error.message);
  }
}

// Run the test
testAuth().catch(console.error);