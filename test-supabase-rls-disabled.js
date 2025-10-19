// Test Supabase with RLS Disabled
async function testSupabaseRLSDisabled() {
  console.log('🧪 Testing Supabase with RLS Disabled...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    // Test 1: Create a community (should save to Supabase now)
    console.log('1️⃣ Testing Community Creation (should save to Supabase)...');
    
    const testCommunity = {
      name: 'RLS Disabled Test Community',
      description: 'Testing community creation with RLS disabled',
      owner_id: 'test-owner-uuid',
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
      
      // Test 2: Verify it was saved by fetching it
      console.log('\n2️⃣ Verifying community was saved...');
      
      const fetchResponse = await fetch(`${API_BASE}/communities`);
      const fetchData = await fetchResponse.json();
      
      const createdCommunity = fetchData.data?.find(c => c.id === createData.data.id);
      
      if (createdCommunity) {
        console.log('✅ Community found in database:', createdCommunity.name);
        console.log('📊 Total communities in DB:', fetchData.data.length);
      } else {
        console.log('❌ Community not found in database');
      }
      
      // Test 3: Update the community
      console.log('\n3️⃣ Testing community update...');
      
      const updateResponse = await fetch(`${API_BASE}/communities/${createData.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'Updated: RLS is now disabled and working!'
        })
      });
      
      const updateData = await updateResponse.json();
      
      console.log('📥 Update Response:', {
        status: updateResponse.status,
        success: updateData.success
      });
      
      if (updateData.success) {
        console.log('✅ Community updated successfully!');
      }
    }
    
    console.log('\n🎉 Test Complete!');
    console.log('\n📋 Instructions:');
    console.log('1. Run the SQL queries in your Supabase dashboard');
    console.log('2. Check the backend logs for Supabase save success messages');
    console.log('3. Verify communities are persisted in Supabase database');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testSupabaseRLSDisabled().catch(console.error);