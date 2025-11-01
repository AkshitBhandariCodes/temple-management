// Test finance database connectivity and data
require('dotenv').config();
const supabaseService = require('./backend/src/services/supabaseService');

async function testFinanceDatabase() {
    try {
        console.log('💰 Testing Finance Database...');

        // Test 1: Check if budget_categories table exists
        console.log('\n1. Testing budget_categories table...');

        const { data: categories, error: categoriesError } = await supabaseService.client
            .from('budget_categories')
            .select('*')
            .limit(3);

        if (categoriesError) {
            console.error('❌ Budget categories table error:', categoriesError);
            console.log('🔧 Solution: Run setup-finance-database.sql in Supabase Dashboard');
        } else {
            console.log('✅ Budget categories table exists');
            console.log('📊 Found', categories?.length || 0, 'categories');
            if (categories?.[0]) {
                console.log('Sample:', categories[0].name, '-', categories[0].category_type);
            }
        }

        // Test 2: Check if transactions table exists
        console.log('\n2. Testing transactions table...');

        const { data: transactions, error: transactionsError } = await supabaseService.client
            .from('transactions')
            .select('*, budget_categories(name)')
            .limit(3);

        if (transactionsError) {
            console.error('❌ Transactions table error:', transactionsError);
        } else {
            console.log('✅ Transactions table exists');
            console.log('📊 Found', transactions?.length || 0, 'transactions');
            if (transactions?.[0]) {
                console.log('Sample:', transactions[0].type, '-', transactions[0].amount, '-', transactions[0].description);
            }
        }

        // Test 3: Try creating a test transaction
        console.log('\n3. Testing transaction creation...');

        // First, get a category to use
        const { data: testCategories } = await supabaseService.client
            .from('budget_categories')
            .select('id, name')
            .eq('category_type', 'income')
            .limit(1);

        if (testCategories && testCategories.length > 0) {
            const testTransaction = {
                category_id: testCategories[0].id,
                type: 'income',
                amount: 100,
                description: 'Test donation - API Test',
                payment_method: 'cash',
                status: 'completed'
            };

            console.log('📝 Creating test transaction:', testTransaction.description);

            const { data: created, error: createError } = await supabaseService.client
                .from('transactions')
                .insert(testTransaction)
                .select('*')
                .single();

            if (createError) {
                console.error('❌ Transaction creation error:', createError);
                console.error('❌ Error details:', JSON.stringify(createError, null, 2));
            } else {
                console.log('✅ Transaction created successfully!');
                console.log('Created transaction ID:', created.id);
                console.log('Amount:', created.amount, 'Type:', created.type);

                // Clean up - delete the test transaction
                await supabaseService.client
                    .from('transactions')
                    .delete()
                    .eq('id', created.id);
                console.log('🧹 Test transaction cleaned up');
            }
        } else {
            console.log('⚠️ No income categories found for testing');
        }

        // Test 4: Test financial summary calculation
        console.log('\n4. Testing financial summary...');

        const { data: allTransactions, error: summaryError } = await supabaseService.client
            .from('transactions')
            .select('type, amount');

        if (summaryError) {
            console.error('❌ Summary calculation error:', summaryError);
        } else {
            const totalIncome = allTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            const totalExpenses = allTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            console.log('✅ Financial summary calculated');
            console.log('💰 Total Income:', totalIncome);
            console.log('💸 Total Expenses:', totalExpenses);
            console.log('📊 Net Amount:', totalIncome - totalExpenses);
            console.log('📈 Transaction Count:', allTransactions.length);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFinanceDatabase();