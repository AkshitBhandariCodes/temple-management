// setup-super-admin.js - Node.js script for MongoDB
// Run with: node setup-super-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function setupSuperAdmin() {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/temple_management';
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db();

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create super admin user
    const superAdminUser = {
      id: 'admin-' + Date.now(), // Simple ID generation
      email: 'admin@temple.com',
      password: hashedPassword,
      full_name: 'Temple Administrator',
      phone: '+1234567890',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert user
    const userResult = await db.collection('users').insertOne(superAdminUser);
    console.log('✅ User created with ID:', userResult.insertedId);

    // Create super admin role
    const roleData = {
      id: 'role-' + Date.now(),
      user_id: superAdminUser.id,
      role: 'super_admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const roleResult = await db.collection('user_roles').insertOne(roleData);
    console.log('✅ Role created with ID:', roleResult.insertedId);

    console.log('\n🎉 Super Admin Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@temple.com');
    console.log('Password: password123');
    console.log('Roles: super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now:');
    console.log('1. Start your React app: npm run dev');
    console.log('2. Navigate to /auth');
    console.log('3. Sign in with the credentials above');

  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
  } finally {
    await client.close();
  }
}

setupSuperAdmin();
