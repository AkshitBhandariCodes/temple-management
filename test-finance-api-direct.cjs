// Test finance API endpoint directly
const fetch = require('node-fetch');

async function testFinanceAPI() {
    try {
        console.log('🧪 Testing Finance API Endpoint...');

        const testTransaction = {
            type: 'income',
            amount: 500,
            description: 'Test donation via API',
            date: new Date().toISOString().split('T')[0],
            payment_method: 'cash',
            status: 'completed'
        };

        console.log('📝 Sending transaction:', testTransaction);

        const response = await fetch('http://localhost:5000/api/finance/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testTransaction)
        });

        console.log('📊 Response status:', response.status);

        const result = await response.json();
        console.log('📊 Response data:', result);

        if (response.ok) {
            console.log('✅ API endpoint working correctly!');
        } else {
            console.log('❌ API endpoint failed:', result.message);
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

testFinanceAPI();