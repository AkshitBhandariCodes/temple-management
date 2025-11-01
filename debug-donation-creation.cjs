// Debug donation creation issue
require('dotenv').config();
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

async function debugDonationCreation() {
    console.log('🔍 DEBUGGING DONATION CREATION ISSUE');
    console.log('='.repeat(50));

    try {
        // Step 1: Test if categories are available
        console.log('\n1️⃣ Checking available categories...');
        const categoriesResult = await testAPI('/api/finance/categories');

        if (categoriesResult.status === 200 && categoriesResult.data.success) {
            const categories = categoriesResult.data.data;
            console.log(`✅ Found ${categories.length} categories`);

            const incomeCategories = categories.filter(cat => cat.category_type === 'income');
            console.log(`💰 Income categories: ${incomeCategories.length}`);

            incomeCategories.forEach(cat => {
                console.log(`   - ${cat.name} (ID: ${cat.id})`);
            });

            // Find donation category
            const donationCategory = incomeCategories.find(cat =>
                cat.name.toLowerCase().includes('donation')
            );

            if (donationCategory) {
                console.log(`✅ Found donation category: ${donationCategory.name}`);
            } else {
                console.log('⚠️ No donation category found');
            }
        } else {
            console.log('❌ Failed to fetch categories');
            return;
        }

        // Step 2: Test donation creation with different scenarios
        console.log('\n2️⃣ Testing donation creation scenarios...');

        const testScenarios = [
            {
                name: 'Basic donation (no category)',
                data: {
                    type: 'income',
                    amount: 1000,
                    description: 'Test donation - basic',
                    payment_method: 'cash',
                    date: new Date().toISOString().split('T')[0]
                }
            },
            {
                name: 'Donation with category',
                data: {
                    type: 'income',
                    amount: 2000,
                    description: 'Test donation - with category',
                    category_id: categoriesResult.data.data.find(cat =>
                        cat.category_type === 'income' && cat.name.toLowerCase().includes('donation')
                    )?.id || null,
                    payment_method: 'upi',
                    date: new Date().toISOString().split('T')[0]
                }
            },
            {
                name: 'Donation exactly like frontend form',
                data: {
                    type: 'income',
                    amount: 5000,
                    description: 'Donation received',
                    category_id: categoriesResult.data.data.find(cat =>
                        cat.category_type === 'income' && cat.name.toLowerCase().includes('donation')
                    )?.id || '',
                    payment_method: 'cash',
                    date: new Date().toISOString().split('T')[0]
                }
            }
        ];

        for (const scenario of testScenarios) {
            console.log(`\n📝 Testing: ${scenario.name}`);
            console.log('Data:', JSON.stringify(scenario.data, null, 2));

            try {
                const result = await testAPI('/api/finance/transactions', 'POST', scenario.data);

                if (result.status === 201 && result.data.success) {
                    console.log('✅ SUCCESS - Transaction created');
                    console.log('   ID:', result.data.data.id);
                    console.log('   Amount:', result.data.data.amount);
                    console.log('   Type:', result.data.data.type);
                } else {
                    console.log('❌ FAILED - Status:', result.status);
                    console.log('   Error:', JSON.stringify(result.data, null, 2));
                }
            } catch (error) {
                console.log('💥 ERROR:', error.message);
            }
        }

        // Step 3: Check if transactions were actually created
        console.log('\n3️⃣ Verifying transactions were saved...');

        const transactionsResult = await testAPI('/api/finance/transactions');
        if (transactionsResult.status === 200 && transactionsResult.data.success) {
            const transactions = transactionsResult.data.data;
            const testTransactions = transactions.filter(t =>
                t.description.includes('Test donation')
            );

            console.log(`✅ Found ${testTransactions.length} test transactions in database`);

            testTransactions.forEach(t => {
                console.log(`   - ₹${t.amount} - ${t.description} (${t.date})`);
            });
        }

        // Step 4: Test summary calculation
        console.log('\n4️⃣ Testing summary calculation...');

        const summaryResult = await testAPI('/api/finance/summary');
        if (summaryResult.status === 200 && summaryResult.data.success) {
            const summary = summaryResult.data.data;
            console.log('✅ Summary calculated successfully:');
            console.log(`   💰 Total Income: ₹${summary.totalIncome}`);
            console.log(`   💸 Total Expenses: ₹${summary.totalExpenses}`);
            console.log(`   📊 Net Amount: ₹${summary.netAmount}`);
            console.log(`   📈 Transaction Count: ${summary.transactionCount}`);
        }

        console.log('\n' + '='.repeat(50));
        console.log('🔍 DIAGNOSIS:');
        console.log('If donations are not appearing in frontend:');
        console.log('1. Check browser console for React errors');
        console.log('2. Verify React Query is refetching data');
        console.log('3. Check if frontend is using correct API endpoints');
        console.log('4. Ensure React component is re-rendering after mutations');

    } catch (error) {
        console.error('💥 Debug failed:', error.message);
    }
}

debugDonationCreation();