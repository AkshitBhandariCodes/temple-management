// MongoDB Demo Data Setup Script
// Run this in your MongoDB shell to create demo users and communities

// 1. Create demo users
db.users.insertMany([
  {
    id: 'user-001',
    email: 'admin@temple.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // "password123" hashed
    full_name: 'Temple Administrator',
    phone: '+1234567890',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'user-002',
    email: 'manager@temple.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
    full_name: 'Community Manager',
    phone: '+1234567891',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'user-003',
    email: 'finance@temple.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
    full_name: 'Finance Manager',
    phone: '+1234567892',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'user-004',
    email: 'volunteer@temple.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
    full_name: 'Volunteer Coordinator',
    phone: '+1234567893',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'user-005',
    email: 'devotee@temple.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
    full_name: 'Devotee Member',
    phone: '+1234567894',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// 2. Create user roles
db.user_roles.insertMany([
  {
    id: 'role-001',
    user_id: 'user-001',
    role: 'super_admin',
    permissions: ['users.read', 'users.write', 'users.delete', 'communities.read', 'communities.write', 'communities.delete', 'donations.read', 'donations.write', 'donations.delete', 'expenses.read', 'expenses.write', 'expenses.delete', 'events.read', 'events.write', 'events.delete', 'volunteers.read', 'volunteers.write', 'volunteers.delete', 'pujas.read', 'pujas.write', 'pujas.delete', 'reports.read', 'reports.write', 'reports.delete', 'settings.read', 'settings.write', 'settings.delete'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'role-002',
    user_id: 'user-002',
    role: 'temple_manager',
    permissions: ['communities.read', 'communities.write', 'events.read', 'events.write', 'volunteers.read', 'volunteers.write'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'role-003',
    user_id: 'user-003',
    role: 'finance_manager',
    permissions: ['donations.read', 'donations.write', 'expenses.read', 'expenses.write', 'reports.read'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'role-004',
    user_id: 'user-004',
    role: 'volunteer',
    permissions: ['events.read', 'volunteers.read'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'role-005',
    user_id: 'user-005',
    role: 'user',
    permissions: ['communities.read', 'events.read', 'donations.read'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// 3. Create demo communities
db.communities.insertMany([
  {
    id: 'community-001',
    name: 'Sri Ganesha Devotees',
    description: 'A vibrant community of devotees dedicated to Lord Ganesha worship and cultural activities.',
    status: 'active',
    logo_url: '/placeholder.svg',
    owner_id: 'user-002',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'community-002',
    name: 'Temple Youth Group',
    description: 'Young devotees connecting through spiritual activities, community service, and cultural programs.',
    status: 'active',
    logo_url: '/placeholder.svg',
    owner_id: 'user-004',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'community-003',
    name: 'Sanskrit Study Circle',
    description: 'Learn and study ancient Sanskrit texts, chants, and spiritual literature together.',
    status: 'active',
    logo_url: '/placeholder.svg',
    owner_id: 'user-005',
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// 4. Add members to communities
db.community_members.insertMany([
  // Sri Ganesha Devotees members
  {
    id: 'member-001',
    community_id: 'community-001',
    user_id: 'user-001',
    role: 'admin',
    joined_at: new Date(),
    is_active: true
  },
  {
    id: 'member-002',
    community_id: 'community-001',
    user_id: 'user-002',
    role: 'owner',
    joined_at: new Date(),
    is_active: true
  },
  {
    id: 'member-003',
    community_id: 'community-001',
    user_id: 'user-003',
    role: 'member',
    joined_at: new Date(),
    is_active: true
  },

  // Temple Youth Group members
  {
    id: 'member-004',
    community_id: 'community-002',
    user_id: 'user-004',
    role: 'owner',
    joined_at: new Date(),
    is_active: true
  },
  {
    id: 'member-005',
    community_id: 'community-002',
    user_id: 'user-005',
    role: 'member',
    joined_at: new Date(),
    is_active: true
  },

  // Sanskrit Study Circle members
  {
    id: 'member-006',
    community_id: 'community-003',
    user_id: 'user-005',
    role: 'owner',
    joined_at: new Date(),
    is_active: true
  },
  {
    id: 'member-007',
    community_id: 'community-003',
    user_id: 'user-002',
    role: 'member',
    joined_at: new Date(),
    is_active: true
  }
]);

// 5. Create some community events
db.community_events.insertMany([
  {
    id: 'event-001',
    community_id: 'community-001',
    title: 'Ganesh Chaturthi Celebration',
    description: 'Annual celebration of Lord Ganesha with prayers, music, and prasadam distribution.',
    start_date: new Date('2024-09-07T10:00:00Z'),
    end_date: new Date('2024-09-07T18:00:00Z'),
    location: 'Temple Main Hall',
    event_type: 'festival',
    max_attendees: 200,
    current_attendees: 0,
    status: 'upcoming',
    created_by: 'user-002',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'event-002',
    community_id: 'community-002',
    title: 'Youth Cultural Night',
    description: 'An evening of traditional dances, music performances, and cultural showcases.',
    start_date: new Date('2024-09-15T18:00:00Z'),
    end_date: new Date('2024-09-15T22:00:00Z'),
    location: 'Temple Community Center',
    event_type: 'cultural',
    max_attendees: 100,
    current_attendees: 0,
    status: 'upcoming',
    created_by: 'user-004',
    created_at: new Date(),
    updated_at: new Date()
  }
]);

print('🎉 Demo data created successfully!');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
print('📊 Summary:');
print('✅ Users created: 5');
print('✅ Roles assigned: 5');
print('✅ Communities created: 3');
print('✅ Community members added: 7');
print('✅ Events created: 2');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
print('');
print('🔐 Test Users:');
print('Email: admin@temple.com, Password: password123, Role: super_admin');
print('Email: manager@temple.com, Password: password123, Role: temple_manager');
print('Email: finance@temple.com, Password: password123, Role: finance_manager');
print('Email: volunteer@temple.com, Password: password123, Role: volunteer');
print('Email: devotee@temple.com, Password: password123, Role: user');
print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
