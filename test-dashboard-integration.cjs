// Test dashboard integration with finance data
require('dotenv').config();
const supabaseService = require('./backend/src/services/supabaseService');
const http = require('http');

function testAPI(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
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
        req.end();
    });
}

async function testDashboardIntegration() {
    console.log('📊 TESTING DASHBOARD INTEGRATION');
    console.log('='.repeat(50));

    try {
        // Test 1: Verify finance API endpoints
        console.log('\n1️⃣ Testing Finance API Endpoints...');

        const endpoints = [
            '/api/finance/transactions',
            '/api/finance/summary',
            '/api/finance/categories'
        ];

        const apiResults = {};

        for (const endpoint of endpoints) {
            try {
                const result = await testAPI(endpoint);
                apiResults[endpoint] = result;

                if (result.status === 200 && result.data.success) {
                    console.log(`✅ ${endpoint} - Working (${result.data.data?.length || 'N/A'} items)`);
                } else {
                    console.log(`❌ ${endpoint} - Failed (${result.status})`);
                }
            } catch (error) {
                console.log(`💥 ${endpoint} - Error: ${error.message}`);
            }
        }

        // Test 2: Calculate dashboard metrics
        console.log('\n2️⃣ Calculating Dashboard Metrics...');

        const transactionsResult = apiResults['/api/finance/transactions'];
        const summaryResult = apiResults['/api/finance/summary'];

        if (transactionsResult?.data?.success) {
            const transactions = transactionsResult.data.data;

            // Calculate metrics like dashboard would
            const donations = transactions.filter(t => t.type === 'income');
            const expenses = transactions.filter(t => t.type === 'expense');

            const totalDonations = donations.reduce((sum, t) => sum + Number(t.amount), 0);
            const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
            const netIncome = totalDonations - totalExpenses;

            console.log('📈 Calculated Metrics:');
            console.log(`   💰 Total Donations: ₹${totalDonations.toLocaleString()} (${donations.length} transactions)`);
            console.log(`   💸 Total Expenses: ₹${totalExpenses.toLocaleString()} (${expenses.length} transactions)`);
            console.log(`   📊 Net Income: ₹${netIncome.toLocaleString()}`);
            console.log(`   📋 Total Transactions: ${transactions.length}`);

            // Recent donations for dashboard
            const recentDonations = donations
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);

            console.log('\n💝 Recent Donations (Top 5):');
            recentDonations.forEach((donation, index) => {
                console.log(`   ${index + 1}. ₹${donation.amount.toLocaleString()} - ${donation.description} (${donation.date})`);
            });

            // This month donations
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            const thisMonthDonations = donations.filter(d => {
                const donationDate = new Date(d.date);
                return donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
            });

            const thisMonthTotal = thisMonthDonations.reduce((sum, t) => sum + Number(t.amount), 0);

            console.log('\n📅 This Month Analysis:');
            console.log(`   💰 This Month Donations: ₹${thisMonthTotal.toLocaleString()} (${thisMonthDonations.length} donations)`);
            console.log(`   📊 Average Donation: ₹${donations.length > 0 ? Math.round(totalDonations / donations.length).toLocaleString() : '0'}`);
            console.log(`   📈 Daily Average: ${Math.round((donations.length / 30) * 100) / 100} donations/day`);

        } else {
            console.log('❌ Cannot calculate metrics - transactions API failed');
        }

        // Test 3: Verify summary API matches calculations
        console.log('\n3️⃣ Verifying Summary API...');

        if (summaryResult?.data?.success) {
            const summary = summaryResult.data.data;

            console.log('📊 API Summary:');
            console.log(`   💰 Total Income: ₹${summary.totalIncome?.toLocaleString() || '0'}`);
            console.log(`   💸 Total Expenses: ₹${summary.totalExpenses?.toLocaleString() || '0'}`);
            console.log(`   📊 Net Amount: ₹${summary.netAmount?.toLocaleString() || '0'}`);
            console.log(`   📋 Transaction Count: ${summary.transactionCount || 0}`);

            // Compare with calculated values
            if (transactionsResult?.data?.success) {
                const transactions = transactionsResult.data.data;
                const calculatedIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
                const calculatedExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

                const incomeMatch = Math.abs(summary.totalIncome - calculatedIncome) < 1;
                const expensesMatch = Math.abs(summary.totalExpenses - calculatedExpenses) < 1;

                console.log('\n🔍 Data Consistency Check:');
                console.log(`   ${incomeMatch ? '✅' : '❌'} Income matches: API(₹${summary.totalIncome}) vs Calculated(₹${calculatedIncome})`);
                console.log(`   ${expensesMatch ? '✅' : '❌'} Expenses match: API(₹${summary.totalExpenses}) vs Calculated(₹${calculatedExpenses})`);
            }
        } else {
            console.log('❌ Summary API failed');
        }

        // Test 4: Dashboard component data simulation
        console.log('\n4️⃣ Dashboard Component Simulation...');

        console.log('🎯 Dashboard should display:');
        console.log('   📊 4 main stats cards with financial data');
        console.log('   💝 Recent donations component with latest 5-6 donations');
        console.log('   📈 Donation insights with monthly totals and averages');
        console.log('   🔄 Real-time updates when new donations are added');

        console.log('\n✅ Expected Dashboard Features:');
        console.log('   - Total Donations card showing current total');
        console.log('   - Net Income card showing profit/loss');
        console.log('   - Recent Donations list with payment methods');
        console.log('   - This month analysis with trends');
        console.log('   - Add donation button for quick entry');

        console.log('\n' + '='.repeat(50));
        console.log('🎉 DASHBOARD INTEGRATION TEST COMPLETE');
        console.log('💡 Check the main dashboard to see donation data displayed');

    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

testDashboardIntegration();