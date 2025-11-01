// Test finance API endpoints
const http = require('http');

function testAPI(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testFinanceAPI() {
    try {
        console.log('🔍 Testing Finance API Endpoints...');

        // Test categories endpoint
        console.log('\n1. Testing GET /api/finance/categories');
        const categoriesResult = await testAPI('/api/finance/categories');
        console.log('Status:', categoriesResult.status);
        console.log('Data:', JSON.stringify(categoriesResult.data, null, 2));

        // Test transactions endpoint
        console.log('\n2. Testing GET /api/finance/transactions');
        const transactionsResult = await testAPI('/api/finance/transactions');
        console.log('Status:', transactionsResult.status);
        console.log('Data:', JSON.stringify(transactionsResult.data, null, 2));

        // Test summary endpoint
        console.log('\n3. Testing GET /api/finance/summary');
        const summaryResult = await testAPI('/api/finance/summary');
        console.log('Status:', summaryResult.status);
        console.log('Data:', JSON.stringify(summaryResult.data, null, 2));

        // Test creating a transaction
        console.log('\n4. Testing POST /api/finance/transactions');
        const newTransaction = {
            type: 'income',
            amount: 500,
            description: 'Test API donation',
            payment_method: 'cash',
            date: new Date().toISOString().split('T')[0]
        };

        const createResult = await testAPI('/api/finance/transactions', 'POST', newTransaction);
        console.log('Status:', createResult.status);
        console.log('Data:', JSON.stringify(createResult.data, null, 2));

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('🔧 Make sure backend server is running on port 5000');
    }
}

testFinanceAPI();