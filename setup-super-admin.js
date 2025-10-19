// MongoDB Super Admin Setup Script
// Run this in your MongoDB shell or through your backend API

// 1. First, create the user in your users collection
// Replace these values with your actual data

const superAdminUser = {
  _id: ObjectId(), // or use UUID
  email: "admin@temple.com",
  password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi", // "password123" hashed
  full_name: "Temple Administrator",
  phone: "+1234567890",
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
};

// 2. Insert the user into your MongoDB users collection
db.users.insertOne(superAdminUser);

// 3. Create user roles entry for super_admin
const superAdminRole = {
  _id: ObjectId(),
  user_id: superAdminUser._id, // Reference to the user
  role: "super_admin",
  is_active: true,
  assigned_by: null, // or reference to another admin
  assigned_at: new Date(),
  created_at: new Date(),
  updated_at: new Date()
};

// 4. Insert the role
db.user_roles.insertOne(superAdminRole);

console.log("✅ Super Admin user created successfully!");
console.log("Email: admin@temple.com");
console.log("Password: password123");
console.log("Roles: super_admin");

// Alternative: If using a script file, save this as setup-admin.js
// and run: mongo < setup-admin.js
