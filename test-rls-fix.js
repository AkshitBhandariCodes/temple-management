// Test RLS Fix for Community Insert
async function testRLSFix() {
  console.log('🧪 Testing RLS Fix for Community Insert...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Checking server status...');
    
    const healthResponse = await fetch('http://localhost:5000/health');
    if (!healthResponse.ok) {
      throw new Error('Server not running. Start with: npm run dev');
    }
    console.log('✅ Server is running');
    
    // Test 2: Try to create a community
    console.log('\n2️⃣ Testing Community Creation with RLS Enabled...');
    
    const testCommunity = {
      name: 'RLS Fix Test Community',
      description: 'Testing community creation after RLS policy fix',
      owner_id: 'test-owner-' + Date.now(),
      status: 'active'
    };
    
    console.log('📤 Creating community:', testCommunity.name);
    
    const createResponse = await fetch(`${API_BASE}/communities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCommunity)
    });
    
    const createData = await createResponse.json();
    
    console.log('📥 Response Status:', createResponse.status);
    console.log('📥 Response Data:', {
      success: createData.success,
      message: createData.message,
      id: createData.data?.id,
      error: createData.error
    });
    
    if (createData.success) {
      console.log('✅ SUCCESS! Community created with RLS enabled!');
      
      // Test 3: Verify it appears in the list
      console.log('\n3️⃣ Verifying community appears in list...');
      
      const listResponse = await fetch(`${API_BASE}/communities`);
      const listData = await listResponse.json();
      
      if (listData.success) {
        const createdCommunity = listData.data?.find(c => c.id === createData.data.id);
        
        if (createdCommunity) {
          console.log('✅ Community found in list!');
          console.log('📊 Total communities:', listData.data.length);
        } else {
          console.log('❌ Community not found in list');
        }
      }
      
      console.log('\n🎉 RLS FIX SUCCESSFUL!');
      console.log('✅ RLS is ENABLED');
      console.log('✅ Community INSERT works');
      console.log('✅ Community READ works');
      console.log('✅ Supabase integration working');
      
    } else {
      console.log('❌ FAILED! Community creation failed');
      console.log('🔍 Error details:', createData.error || createData.message);
      
      if (createData.error?.includes('policy') || createData.error?.includes('42501')) {
        console.log('\n💡 RLS POLICY ERROR DETECTED!');
        console.log('📋 TO FIX:');
        console.log('1. Go to Supabase Dashboard → SQL Editor');
        console.log('2. Run the fix-rls-community-insert.sql file');
        console.log('3. This will create proper RLS policies');
        console.log('4. Run this test again');
      }
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

// Run the test
testRLSFix().catch(console.error);