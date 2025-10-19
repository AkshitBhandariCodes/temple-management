// MongoDB Authentication & Roles Setup Script
// Run this in MongoDB shell to create proper authentication system

// 1. Create users collection
db.createCollection('users');

// 2. Create user_roles collection
db.createCollection('user_roles');

// 3. Insert super admin user
db.users.insertOne({
  id: 'admin-001',
  email: 'admin@temple.com',
  password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // "password123" hashed
  full_name: 'Temple Administrator',
  phone: '+1234567890',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
});

// 4. Insert super admin role
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

print('✅ Super Admin user and roles created successfully!');
print('Email: admin@temple.com');
print('Password: password123');
print('Role: super_admin');
