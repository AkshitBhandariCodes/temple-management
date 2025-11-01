// Test donations API endpoint
const http = require('http');

function testAPI(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });
        req.end();
    });
}

async function testDonationsAPI() {
    console.log('🔍 Testing Donations API...');

    try {
        // Test if server is running
        console.log('\n1️⃣ Testing server connectivity...');
        const healthResult = await testAPI('/api/health');
        console.log('Health check:', healthResult.status);

        // Test donations endpoint
        console.log('\n2️⃣ Testing donations endpoint...');
        const donationsResult = await testAPI('/api/donations');
        console.log('Donations API Status:', donationsResult.status);
        console.log('Donations API Response:', JSON.stringify(donationsResult.data, null, 2));

        if (donationsResult.status === 404) {
            console.log('\n❌ ISSUE FOUND: Donations route not found');
            console.log('🔧 Possible solutions:');
            console.log('   1. Backend server needs restart');
            console.log('   2. Donations routes not properly registered');
            console.log('   3. Route file path incorrect');
        } else if (donationsResult.status === 200) {
            console.log('\n✅ Donations API working correctly');
        } else {
            console.log('\n⚠️ Unexpected status:', donationsResult.status);
        }

        // Test other finance endpoints for comparison
        console.log('\n3️⃣ Testing other finance endpoints...');
        const financeResult = await testAPI('/api/finance/transactions');
        console.log('Finance API Status:', financeResult.status);

        if (financeResult.status === 200 && donationsResult.status === 404) {
            console.log('\n🔍 DIAGNOSIS: Finance API works but donations API doesn\'t');
            console.log('   This confirms donations routes are not loaded');
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('🔧 Make sure backend server is running on port 5000');
    }
}

testDonationsAPI();