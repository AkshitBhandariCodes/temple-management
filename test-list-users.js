// Test List Users
async function testListUsers() {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('👥 Listing all users...\n');
  
  try {
    // First register a test user to get a token
    const registerResponse = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'temp@temple.com',
        password: 'password123',
        full_name: 'Temp User'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      // Now try to list users with the token
      const usersResponse = await fetch(`${baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${registerData.data.token}`
        }
      });
      
      const usersData = await usersResponse.json();
      console.log('Users Response:', usersData);
      
      if (usersData.success) {
        console.log('✅ Users list retrieved!');
        console.log('Total users:', usersData.data.length);
        usersData.data.forEach((user, index) => {
          console.log(`${index + 1}. ${user.full_name} (${user.email}) - Role: ${user.role}`);
        });
      } else {
        console.log('❌ Failed to get users:', usersData.message);
      }
    } else {
      console.log('❌ Failed to register temp user:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testListUsers().catch(console.error);