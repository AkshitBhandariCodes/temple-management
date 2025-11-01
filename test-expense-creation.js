// Test script to verify expense creation

const API_BASE_URL = 'http://localhost:5000/api';

async function testExpenseCreation() {
    console.log('🧪 Testing expense creation...');

    try {
        // Test 1: Get current transactions
        console.log('\n1. Fetching current transactions...');
        const getResponse = await fetch(`${API_BASE_URL}/finance/transactions`);
        const currentData = await getResponse.json();
        console.log('Current transactions count:', currentData.data?.length || 0);
        console.log('Current expenses:', currentData.data?.filter(t => t.type === 'expense').length || 0);

        // Test 2: Create a new expense
        console.log('\n2. Creating new expense...');
        const expenseData = {
            type: 'expense',
            description: 'Test expense from script',
            amount: 999,
            payment_method: 'cash',
            date: '2025-11-01',
            notes: 'Test expense for debugging'
        };

        const createResponse = await fetch(`${API_BASE_URL}/finance/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });

        const createResult = await createResponse.json();
        console.log('Create response status:', createResponse.status);
        console.log('Create result:', createResult);

        // Test 3: Fetch transactions again to verify
        console.log('\n3. Fetching transactions after creation...');
        const getResponse2 = await fetch(`${API_BASE_URL}/finance/transactions`);
        const newData = await getResponse2.json();
        console.log('New transactions count:', newData.data?.length || 0);
        console.log('New expenses count:', newData.data?.filter(t => t.type === 'expense').length || 0);

        // Test 4: Check if our expense is in the list
        const ourExpense = newData.data?.find(t => t.description === 'Test expense from script');
        console.log('Our expense found:', !!ourExpense);
        if (ourExpense) {
            console.log('Expense details:', {
                id: ourExpense.id,
                type: ourExpense.type,
                amount: ourExpense.amount,
                description: ourExpense.description,
                date: ourExpense.date
            });
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testExpenseCreation();