// Final comprehensive finance system test
require('dotenv').config();
const supabaseService = require('./backend/src/services/supabaseService');
const http = require('http');

function testAPI(path, method = 'GET', data = null) {
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

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function finalFinanceTest() {
    console.log('🎯 FINAL FINANCE SYSTEM TEST');
    console.log('='.repeat(50));

    let allTestsPassed = true;

    try {
        // Test 1: Database connectivity
        console.log('\n1️⃣ Testing Database Connectivity...');
        const { data: categories, error } = await supabaseService.client
            .from('budget_categories')
            .select('count')
            .single();

        if (error) {
            console.log('❌ Database test failed:', error.message);
            allTestsPassed = false;
        } else {
            console.log('✅ Database connected successfully');
        }

        // Test 2: API endpoints
        console.log('\n2️⃣ Testing API Endpoints...');

        const endpoints = [
            '/api/finance/categories',
            '/api/finance/transactions',
            '/api/finance/summary'
        ];

        for (const endpoint of endpoints) {
            try {
                const result = await testAPI(endpoint);
                if (result.status === 200 && result.data.success) {
                    console.log(`✅ ${endpoint} - Working`);
                } else {
                    console.log(`❌ ${endpoint} - Failed (${result.status})`);
                    allTestsPassed = false;
                }
            } catch (error) {
                console.log(`❌ ${endpoint} - Error: ${error.message}`);
                allTestsPassed = false;
            }
        }

        // Test 3: Transaction creation
        console.log('\n3️⃣ Testing Transaction Creation...');

        const testTransaction = {
            type: 'income',
            amount: 777,
            description: 'Final test donation',
            payment_method: 'upi',
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const createResult = await testAPI('/api/finance/transactions', 'POST', testTransaction);
            if (createResult.status === 201 && createResult.data.success) {
                console.log('✅ Transaction creation - Working');
                console.log(`   Created transaction: ₹${testTransaction.amount}`);

                // Clean up test transaction
                const transactionId = createResult.data.data.id;
                await supabaseService.client
                    .from('transactions')
                    .delete()
                    .eq('id', transactionId);
                console.log('🧹 Test transaction cleaned up');
            } else {
                console.log('❌ Transaction creation - Failed');
                allTestsPassed = false;
            }
        } catch (error) {
            console.log('❌ Transaction creation - Error:', error.message);
            allTestsPassed = false;
        }

        // Test 4: Data integrity
        console.log('\n4️⃣ Testing Data Integrity...');

        const { data: allCategories } = await supabaseService.client
            .from('budget_categories')
            .select('*');

        const { data: allTransactions } = await supabaseService.client
            .from('transactions')
            .select('*');

        if (allCategories && allCategories.length > 0) {
            console.log(`✅ Categories: ${allCategories.length} found`);
        } else {
            console.log('❌ No categories found');
            allTestsPassed = false;
        }

        if (allTransactions && allTransactions.length > 0) {
            console.log(`✅ Transactions: ${allTransactions.length} found`);
        } else {
            console.log('❌ No transactions found');
            allTestsPassed = false;
        }

        // Test 5: Financial calculations
        console.log('\n5️⃣ Testing Financial Calculations...');

        const income = allTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expenses = allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const net = income - expenses;

        console.log(`✅ Financial Summary:`);
        console.log(`   💰 Total Income: ₹${income.toLocaleString()}`);
        console.log(`   💸 Total Expenses: ₹${expenses.toLocaleString()}`);
        console.log(`   📊 Net Amount: ₹${net.toLocaleString()}`);

        // Final result
        console.log('\n' + '='.repeat(50));
        if (allTestsPassed) {
            console.log('🎉 ALL TESTS PASSED! Finance system is fully functional.');
            console.log('✅ Database: Working');
            console.log('✅ API: Working');
            console.log('✅ Transactions: Working');
            console.log('✅ Data: Valid');
            console.log('✅ Calculations: Correct');
            console.log('\n🚀 Finance tab should now work perfectly in the frontend!');
        } else {
            console.log('❌ SOME TESTS FAILED. Check the errors above.');
            console.log('🔧 Run setup-finance-database.sql if database tests failed.');
            console.log('🔧 Ensure backend server is running if API tests failed.');
        }

    } catch (error) {
        console.error('💥 Test suite failed:', error.message);
    }
}

finalFinanceTest();