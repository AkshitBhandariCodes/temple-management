// Quick test for expenses API
const API_BASE_URL = 'http://localhost:5000/api';

async function testExpensesAPI() {
    console.log('🧪 Testing Expenses API...');

    try {
        // Test 1: Get expenses
        console.log('\n1. Testing GET /api/expenses...');
        const getResponse = await fetch(`${API_BASE_URL}/expenses`);
        const getData = await getResponse.json();
        console.log('Status:', getResponse.status);
        console.log('Response:', getData);

        if (getData.success) {
            console.log('✅ GET expenses working!');
            console.log('📊 Found', getData.data?.length || 0, 'expenses');
        } else {
            console.log('❌ GET expenses failed:', getData.message);
        }

        // Test 2: Create expense
        console.log('\n2. Testing POST /api/expenses...');
        const expenseData = {
            vendor_name: 'Test Vendor',
            description: 'Test expense from API',
            amount: 1000,
            expense_type: 'operational',
            payment_method: 'cash',
            expense_date: '2025-11-01',
            notes: 'Test expense for debugging'
        };

        const createResponse = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });

        const createData = await createResponse.json();
        console.log('Status:', createResponse.status);
        console.log('Response:', createData);

        if (createData.success) {
            console.log('✅ POST expense working!');
            console.log('💰 Created expense ID:', createData.data?.id);
        } else {
            console.log('❌ POST expense failed:', createData.message);
        }

    } catch (error) {
        console.error('❌ API Test failed:', error.message);
        console.log('\n🔧 Make sure:');
        console.log('1. Backend server is running on port 5000');
        console.log('2. Expenses table exists in database');
        console.log('3. Server was restarted after adding expenses routes');
    }
}

testExpensesAPI();