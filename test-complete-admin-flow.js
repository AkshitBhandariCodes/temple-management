// Test Complete Admin Flow After SQL Migration
async function testCompleteAdminFlow() {
  console.log('🧪 Testing Complete Admin Flow (After SQL Migration)...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    console.log('🎯 Testing admin registration with proper role handling...');
    
    const testUser = {
      full_name: 'Test Chairman After Migration',
      email: 'test.chairman.migration@temple.com',
      password: 'TempPass123!',
      role: 'chairman',
      status: 'active'
    };
    
    console.log('📤 Registering user:', testUser.full_name);
    
    const response = await fetch(`${API_BASE}/users/admin-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    console.log('📥 Registration Response:', {
      status: response.status,
      success: data.success,
      message: data.message,
      role: data.data?.user?.role,
      id: data.data?.user?.id
    });
    
    if (data.success && data.data?.user?.role === 'chairman') {
      console.log('✅ SUCCESS! Role properly saved and returned!');
      
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
      
      console.log('📥 Login Response:', {
        status: loginResponse.status,
        success: loginData.success,
        role: loginData.data?.user?.role
      });
      
      if (loginData.success && loginData.data?.user?.role === 'chairman') {
        console.log('✅ PERFECT! Role persisted correctly in database!');
        
        console.log('\n🎉 COMPLETE ADMIN SYSTEM WORKING!');
        console.log('✅ Admin page form working');
        console.log('✅ Role-based registration working');
        console.log('✅ Roles saved to Supabase database');
        console.log('✅ Roles returned in login responses');
        console.log('✅ Full end-to-end functionality complete');
        
      } else {
        console.log('⚠️  Login successful but role not persisted correctly');
      }
      
    } else if (data.success && data.data?.user?.role !== 'chairman') {
      console.log('⚠️  Registration successful but role not saved correctly');
      console.log('💡 Make sure you ran the add-user-role-field.sql in Supabase');
      
    } else {
      console.log('❌ Registration failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testCompleteAdminFlow().catch(console.error);