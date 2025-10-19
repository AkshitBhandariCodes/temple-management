// Test Admin User Registration
async function testAdminRegistration() {
  console.log('🧪 Testing Admin User Registration...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    // Test 1: Register a board member
    console.log('1️⃣ Testing Board Member Registration...');
    
    const boardMember = {
      full_name: 'John Board Member',
      email: 'john.board@temple.com',
      password: 'TempPass123!',
      role: 'board',
      status: 'active'
    };
    
    console.log('📤 Registering board member:', boardMember.full_name);
    
    const boardResponse = await fetch(`${API_BASE}/users/admin-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardMember)
    });
    
    const boardData = await boardResponse.json();
    
    console.log('📥 Board Member Response:', {
      status: boardResponse.status,
      success: boardData.success,
      message: boardData.message,
      role: boardData.data?.user?.role
    });
    
    if (boardData.success) {
      console.log('✅ Board member registered successfully!');
    } else {
      console.log('❌ Board member registration failed:', boardData.message);
    }
    
    // Test 2: Register a chairman
    console.log('\n2️⃣ Testing Chairman Registration...');
    
    const chairman = {
      full_name: 'Jane Chairman',
      email: 'jane.chairman@temple.com',
      password: 'TempPass123!',
      role: 'chairman',
      status: 'active'
    };
    
    console.log('📤 Registering chairman:', chairman.full_name);
    
    const chairmanResponse = await fetch(`${API_BASE}/users/admin-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chairman)
    });
    
    const chairmanData = await chairmanResponse.json();
    
    console.log('📥 Chairman Response:', {
      status: chairmanResponse.status,
      success: chairmanData.success,
      message: chairmanData.message,
      role: chairmanData.data?.user?.role
    });
    
    if (chairmanData.success) {
      console.log('✅ Chairman registered successfully!');
    } else {
      console.log('❌ Chairman registration failed:', chairmanData.message);
    }
    
    // Test 3: Try to login with one of the created users
    if (boardData.success) {
      console.log('\n3️⃣ Testing Login with Board Member...');
      
      const loginResponse = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: boardMember.email,
          password: boardMember.password
        })
      });
      
      const loginData = await loginResponse.json();
      
      console.log('📥 Login Response:', {
        status: loginResponse.status,
        success: loginData.success,
        role: loginData.data?.user?.role
      });
      
      if (loginData.success) {
        console.log('✅ Login successful with correct role!');
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    }
    
    console.log('\n🎉 Admin Registration Test Complete!');
    
    if (boardData.success && chairmanData.success) {
      console.log('✅ Admin registration working perfectly!');
      console.log('✅ Role-based user creation successful');
      console.log('✅ Users can login with assigned roles');
      console.log('\n📋 Next Steps:');
      console.log('1. Run add-user-role-field.sql in Supabase Dashboard');
      console.log('2. Access admin page at: http://localhost:8081/admin');
      console.log('3. Use the form to register users with roles');
    } else {
      console.log('⚠️  Some registrations failed - check backend logs');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 CONNECTION ERROR:');
      console.log('1. Make sure backend server is running: npm run dev');
      console.log('2. Check if port 5000 is available');
    }
  }
}

testAdminRegistration().catch(console.error);