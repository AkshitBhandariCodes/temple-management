const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash is valid:', isValid);
  
  // Test the existing hash
  const existingHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const isExistingValid = await bcrypt.compare('password', existingHash);
  const isExistingValid123 = await bcrypt.compare('password123', existingHash);
  console.log('Existing hash with "password":', isExistingValid);
  console.log('Existing hash with "password123":', isExistingValid123);
}

generateHash().catch(console.error);