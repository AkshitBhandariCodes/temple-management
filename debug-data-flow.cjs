// Debug complete data flow from frontend to database
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

async function debugDataFlow() {
    console.log('🔍 DEBUGGING COMPLETE DATA FLOW');
    console.log('='.repeat(60));

    try {
        // Step 1: Test database connectivity
        console.log('\n1️⃣ Testing Database Connectivity...');

        const { data: dbTest, error: dbError } = await supabaseService.client
            .from('transactions')
            .select('count')
            .single();

        if (dbError) {
            console.log('❌ Database connection failed:', dbError.message);
            console.log('🔧 Solution: Check Supabase connection and run setup-finance-database.sql');
            return;
        } else {
            console.log('✅ Database connected successfully');
        }

        // Step 2: Test all API endpoints
        console.log('\n2️⃣ Testing All API Endpoints...');

        const endpoints = [
            '/api/finance/categories',
            '/api/finance/transactions',
            '/api/finance/summary'
        ];

        const apiData = {};

        for (const endpoint of endpoints) {
            try {
                const result = await testAPI(endpoint);
                apiData[endpoint] = result;

                if (result.status === 200 && result.data.success) {
                    const count = result.data.data?.length || 'N/A';
                    console.log(`✅ ${endpoint} - Status: ${result.status}, Items: ${count}`);
                } else {
                    console.log(`❌ ${endpoint} - Status: ${result.status}, Error: ${result.data.message || 'Unknown'}`);
                }
            } catch (error) {
                console.log(`💥 ${endpoint} - Network Error: ${error.message}`);
            }
        }

        // Step 3: Test transaction creation (simulating frontend)
        console.log('\n3️⃣ Testing Transaction Creation (Frontend Simulation)...');

        const testDonation = {
            type: 'income',
            amount: 2500,
            description: 'Debug Test Donation - Data Flow Check',
            payment_method: 'upi',
            date: new Date().toISOString().split('T')[0],
            category_id: null // Will be set if category exists
        };

        // Get a category if available
        if (apiData['/api/finance/categories']?.data?.success) {
            const categories = apiData['/api/finance/categories'].data.data;
            const incomeCategory = categories.find(cat => cat.category_type === 'income');
            if (incomeCategory) {
                testDonation.category_id = incomeCategory.id;
                console.log(`📝 Using category: ${incomeCategory.name} (${incomeCategory.id})`);
            }
        }

        console.log('📤 Sending donation data:', JSON.stringify(testDonation, null, 2));

        const createResult = await testAPI('/api/finance/transactions', 'POST', testDonation);

        if (createResult.status === 201 && createResult.data.success) {
            console.log('✅ Transaction created successfully!');
            console.log('📋 Created transaction:', {
                id: createResult.data.data.id,
                amount: createResult.data.data.amount,
                type: createResult.data.data.type,
                description: createResult.data.data.description
            });

            // Step 4: Verify transaction was saved to database
            console.log('\n4️⃣ Verifying Database Storage...');

            const { data: savedTransaction, error: fetchError } = await supabaseService.client
                .from('transactions')
                .select('*')
                .eq('id', createResult.data.data.id)
                .single();

            if (fetchError) {
                console.log('❌ Failed to fetch saved transaction:', fetchError.message);
            } else {
                console.log('✅ Transaction verified in database:', {
                    id: savedTransaction.id,
                    amount: savedTransaction.amount,
                    description: savedTransaction.description,
                    created_at: savedTransaction.created_at
                });
            }

            // Step 5: Test data refresh (simulating React Query)
            console.log('\n5️⃣ Testing Data Refresh (React Query Simulation)...');

            const refreshResults = await Promise.all([
                testAPI('/api/finance/transactions'),
                testAPI('/api/finance/summary')
            ]);

            const [newTransactions, newSummary] = refreshResults;

            if (newTransactions.status === 200 && newSummary.status === 200) {
                console.log('✅ Data refresh successful');
                console.log('📊 Updated counts:', {
                    transactions: newTransactions.data.data?.length || 0,
                    totalIncome: newSummary.data.data?.totalIncome || 0,
                    totalExpenses: newSummary.data.data?.totalExpenses || 0,
                    netAmount: newSummary.data.data?.netAmount || 0
                });

                // Check if our test transaction appears
                const ourTransaction = newTransactions.data.data?.find(t =>
                    t.description === 'Debug Test Donation - Data Flow Check'
                );

                if (ourTransaction) {
                    console.log('✅ Test transaction found in refreshed data');
                } else {
                    console.log('❌ Test transaction NOT found in refreshed data');
                }
            } else {
                console.log('❌ Data refresh failed');
            }

            // Clean up test transaction
            await supabaseService.client
                .from('transactions')
                .delete()
                .eq('id', createResult.data.data.id);
            console.log('🧹 Test transaction cleaned up');

        } else {
            console.log('❌ Transaction creation failed!');
            console.log('📋 Error details:', {
                status: createResult.status,
                error: createResult.data
            });
        }

        // Step 6: Check current database state
        console.log('\n6️⃣ Current Database State...');

        const { data: allTransactions } = await supabaseService.client
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        const { data: allCategories } = await supabaseService.client
            .from('budget_categories')
            .select('*');

        console.log('📊 Database Summary:');
        console.log(`   💳 Total Transactions: ${allTransactions?.length || 0}`);
        console.log(`   📁 Total Categories: ${allCategories?.length || 0}`);

        if (allTransactions && allTransactions.length > 0) {
            console.log('\n📋 Recent Transactions (Last 5):');
            allTransactions.slice(0, 5).forEach((t, index) => {
                console.log(`   ${index + 1}. ${t.type} - ₹${t.amount} - ${t.description} (${t.date})`);
            });
        }

        if (allCategories && allCategories.length > 0) {
            console.log('\n📁 Available Categories:');
            allCategories.forEach(cat => {
                console.log(`   - ${cat.name} (${cat.category_type}) - Budget: ₹${cat.budget_amount || 0}`);
            });
        }

        // Step 7: Diagnose issues
        console.log('\n7️⃣ Issue Diagnosis...');

        const issues = [];

        if (!apiData['/api/finance/transactions']?.data?.success) {
            issues.push('❌ Transactions API not working');
        }

        if (!apiData['/api/finance/summary']?.data?.success) {
            issues.push('❌ Summary API not working');
        }

        if (!allTransactions || allTransactions.length === 0) {
            issues.push('❌ No transactions in database');
        }

        if (!allCategories || allCategories.length === 0) {
            issues.push('❌ No categories in database');
        }

        if (issues.length === 0) {
            console.log('✅ No issues detected - system should be working!');
            console.log('💡 If frontend still not working, check:');
            console.log('   - React Query configuration');
            console.log('   - Browser console for errors');
            console.log('   - Network tab for failed requests');
            console.log('   - Component re-rendering issues');
        } else {
            console.log('🚨 Issues detected:');
            issues.forEach(issue => console.log(`   ${issue}`));
            console.log('\n🔧 Solutions:');
            console.log('   1. Run setup-finance-database.sql in Supabase');
            console.log('   2. Restart backend server');
            console.log('   3. Check environment variables');
            console.log('   4. Verify Supabase connection');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎯 DATA FLOW DEBUG COMPLETE');

    } catch (error) {
        console.error('💥 Debug failed:', error.message);
        console.error('🔧 Check backend server is running and database is accessible');
    }
}

debugDataFlow();