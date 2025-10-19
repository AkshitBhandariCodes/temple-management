// Test After RLS Fix
async function testAfterRLSFix() {
  console.log('🧪 Testing After RLS Policy Fix...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    console.log('🎯 Creating a new community to test RLS fix...');
    
    const testCommunity = {
      name: 'Post-RLS-Fix Test Community',
      description: 'Testing after running the RLS policy fix',
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
    
    console.log('📥 Create Response:', {
      status: createResponse.status,
      success: createData.success,
      id: createData.data?.id,
      message: createData.message
    });
    
    if (createData.success) {
      console.log('✅ Community created successfully!');
      
      // Wait a moment then check the list
      console.log('\n⏳ Waiting 2 seconds then checking list...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const listResponse = await fetch(`${API_BASE}/communities`);
      const listData = await listResponse.json();
      
      if (listData.success) {
        const createdCommunity = listData.data?.find(c => c.id === createData.data.id);
        
        console.log('📊 Total communities in list:', listData.data.length);
        
        if (createdCommunity) {
          console.log('✅ SUCCESS! Community found in Supabase list!');
          console.log('📝 Community details:', {
            id: createdCommunity.id,
            name: createdCommunity.name,
            status: createdCommunity.status
          });
        } else {
          console.log('❌ Community not found in list (still using memory fallback)');
          console.log('💡 This means RLS policies still need to be fixed in Supabase');
        }
      }
      
      console.log('\n🎉 TEST COMPLETE!');
      
      if (createdCommunity) {
        console.log('✅ RLS POLICIES WORKING');
        console.log('✅ Communities saving to Supabase');
        console.log('✅ Full integration working');
      } else {
        console.log('⚠️  Still using memory fallback');
        console.log('📋 Run the fix-rls-community-insert.sql in Supabase Dashboard');
      }
      
    } else {
      console.log('❌ Community creation failed');
      console.log('🔍 Error:', createData.error || createData.message);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testAfterRLSFix().catch(console.error);