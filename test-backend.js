// Simple backend test script
const http = require('http');

console.log('🧪 Testing backend server...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/communities',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('📦 Response:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
  console.log('🔍 Backend server is not running or not accessible');
  console.log('💡 Try: cd backend && node src/server.js');
});

req.end();
