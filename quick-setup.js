// Quick MongoDB Setup Script
// Run this in your MongoDB shell

// 1. Create collections
db.createCollection('users');
db.createCollection('user_roles');

// 2. Create indexes for performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "id": 1 }, { unique: true });
db.user_roles.createIndex({ "user_id": 1 });
db.user_roles.createIndex({ "role": 1 });

// 3. Insert super admin user
db.users.insertOne({
  id: 'admin-001',
  email: 'admin@temple.com',
  password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
  full_name: 'Temple Administrator',
  phone: '+1234567890',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
});

// 4. Insert super admin role with permissions
db.user_roles.insertOne({
  id: 'role-admin-001',
  user_id: 'admin-001',
  role: 'super_admin',
  permissions: [
    'users.read', 'users.write', 'users.delete',
    'communities.read', 'communities.write', 'communities.delete',
    'donations.read', 'donations.write', 'donations.delete',
    'expenses.read', 'expenses.write', 'expenses.delete',
    'events.read', 'events.write', 'events.delete',
    'volunteers.read', 'volunteers.write', 'volunteers.delete',
    'pujas.read', 'pujas.write', 'pujas.delete',
    'reports.read', 'reports.write', 'reports.delete',
    'settings.read', 'settings.write', 'settings.delete'
  ],
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
});

print('🎉 MongoDB setup complete!');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
print('Super Admin Credentials:');
print('Email: admin@temple.com');
print('Password: password123');
print('Role: super_admin');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 5. Test the setup
const admin = db.users.findOne({email: 'admin@temple.com'});
const roles = db.user_roles.find({user_id: 'admin-001'}).toArray();
print('✅ User found:', !!admin);
print('✅ Roles found:', roles.length);
