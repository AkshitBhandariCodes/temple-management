// Test finance database connection and structure
require('dotenv').config();
const supabaseService = require('./backend/src/services/supabaseService');

async function testFinanceDatabase() {
    try {
        console.log('🧪 Testing Finance Database...');

        // Test 1: Check if tables exist
        console.log('\n1. Testing table existence...');

        const { data: categories, error: catError } = await supabaseService.client
            .from('budget_categories')
            .select('*')
            .limit(1);

        if (catError) {
            console.error('❌ Budget categories table error:', catError);
        } else {
            console.log('✅ Budget categories table exists, sample:', categories[0] || 'No data');
        }

        const { data: transactions, error: transError } = await supabaseService.client
            .from('transactions')
            .select('*')
            .limit(1);

        if (transError) {
            console.error('❌ Transactions table error:', transError);
        } else {
            console.log('✅ Transactions table exists, sample:', transactions[0] || 'No data');
        }

        // Test 2: Try creating a test transaction
        console.log('\n2. Testing transaction creation...');

        const testTransaction = {
            type: 'income',
            amount: 1000,
            description: 'Test donation',
            date: new Date().toISOString().split('T')[0],
            payment_method: 'cash',
            status: 'completed'
        };

        console.log('📝 Creating test transaction:', testTransaction);

        const { data: created, error: createError } = await supabaseService.client
            .from('transactions')
            .insert(testTransaction)
            .select('*')
            .single();

        if (createError) {
            console.error('❌ Transaction creation error:', createError);
            console.error('❌ Error details:', JSON.stringify(createError, null, 2));
        } else {
            console.log('✅ Transaction created successfully:', created);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFinanceDatabase();