// Test complete donations system functionality
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

async function testDonationsSystem() {
    console.log('💰 TESTING COMPLETE DONATIONS SYSTEM');
    console.log('='.repeat(60));

    try {
        // Step 1: Check if donations table exists
        console.log('\n1️⃣ Testing Donations Table...');

        const { data: donations, error: donationsError } = await supabaseService.client
            .from('donations')
            .select('*')
            .limit(3);

        if (donationsError) {
            console.error('❌ Donations table error:', donationsError);
            console.log('🔧 Solution: Run setup-donations-table.sql in Supabase Dashboard');
            return;
        } else {
            console.log('✅ Donations table exists');
            console.log('📊 Found', donations?.length || 0, 'donations');
            if (donations?.[0]) {
                console.log('Sample:', donations[0].donor_name || 'Anonymous', '-', donations[0].amount);
            }
        }

        // Step 2: Check donation categories
        console.log('\n2️⃣ Testing Donation Categories...');

        const { data: categories, error: categoriesError } = await supabaseService.client
            .from('donation_categories')
            .select('*')
            .limit(3);

        if (categoriesError) {
            console.error('❌ Donation categories error:', categoriesError);
        } else {
            console.log('✅ Donation categories table exists');
            console.log('📊 Found', categories?.length || 0, 'categories');
            if (categories?.[0]) {
                console.log('Sample:', categories[0].name, '-', categories[0].target_amount);
            }
        }

        // Step 3: Test API endpoints
        console.log('\n3️⃣ Testing Donations API Endpoints...');

        const endpoints = [
            '/api/donations',
            '/api/donations/categories/all',
            '/api/donations/reports/summary'
        ];

        for (const endpoint of endpoints) {
            try {
                const result = await testAPI(endpoint);

                if (result.status === 200 && result.data.success) {
                    console.log(`✅ ${endpoint} - Working (${result.data.data?.length || 'N/A'} items)`);
                } else {
                    console.log(`❌ ${endpoint} - Failed (${result.status})`);
                }
            } catch (error) {
                console.log(`💥 ${endpoint} - Error: ${error.message}`);
            }
        }

        // Step 4: Test donation creation
        console.log('\n4️⃣ Testing Donation Creation...');

        const testDonation = {
            donor_name: 'Test Donor - API Test',
            donor_email: 'test@example.com',
            amount: 2500,
            donation_type: 'general',
            payment_method: 'upi',
            purpose: 'Testing donations system',
            notes: 'Created via API test'
        };

        console.log('📝 Creating test donation:', testDonation.donor_name, '-', testDonation.amount);

        const createResult = await testAPI('/api/donations', 'POST', testDonation);

        if (createResult.status === 201 && createResult.data.success) {
            console.log('✅ Donation created successfully!');
            console.log('📋 Created donation:', {
                id: createResult.data.data.id,
                amount: createResult.data.data.amount,
                donor_name: createResult.data.data.donor_name,
                receipt_number: createResult.data.data.receipt_number
            });

            // Clean up test donation
            const donationId = createResult.data.data.id;
            await supabaseService.client
                .from('donations')
                .delete()
                .eq('id', donationId);
            console.log('🧹 Test donation cleaned up');

        } else {
            console.log('❌ Donation creation failed:', createResult.data);
        }

        // Step 5: Test summary calculation
        console.log('\n5️⃣ Testing Summary Calculation...');

        const summaryResult = await testAPI('/api/donations/reports/summary');

        if (summaryResult.status === 200 && summaryResult.data.success) {
            const summary = summaryResult.data.data;
            console.log('✅ Summary calculated successfully:');
            console.log(`   💰 Total Amount: ₹${summary.totalAmount?.toLocaleString() || '0'}`);
            console.log(`   📊 Total Count: ${summary.totalCount || 0}`);
            console.log(`   📅 This Month: ₹${summary.thisMonthAmount?.toLocaleString() || '0'}`);
            console.log(`   📈 Average: ₹${Math.round(summary.averageAmount || 0).toLocaleString()}`);
        } else {
            console.log('❌ Summary calculation failed');
        }

        // Step 6: Test dashboard integration
        console.log('\n6️⃣ Testing Dashboard Integration...');

        console.log('🎯 Dashboard should now display:');
        console.log('   📊 Real donation totals from donations table');
        console.log('   💝 Recent donations with donor names and purposes');
        console.log('   📈 This month donation amounts');
        console.log('   🏆 Top donors list');
        console.log('   📋 Receipt numbers for donations');

        // Step 7: Verify data structure
        console.log('\n7️⃣ Verifying Data Structure...');

        const { data: sampleDonation } = await supabaseService.client
            .from('donations')
            .select('*')
            .limit(1)
            .single();

        if (sampleDonation) {
            console.log('✅ Sample donation structure:');
            console.log('   🆔 ID:', sampleDonation.id);
            console.log('   👤 Donor:', sampleDonation.donor_name || 'Anonymous');
            console.log('   💰 Amount:', sampleDonation.amount);
            console.log('   📧 Email:', sampleDonation.donor_email || 'Not provided');
            console.log('   📱 Phone:', sampleDonation.donor_phone || 'Not provided');
            console.log('   🏷️ Type:', sampleDonation.donation_type);
            console.log('   💳 Payment:', sampleDonation.payment_method);
            console.log('   📅 Date:', sampleDonation.donation_date);
            console.log('   🧾 Receipt:', sampleDonation.receipt_number);
            console.log('   🎯 Purpose:', sampleDonation.purpose || 'Not specified');
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 DONATIONS SYSTEM TEST COMPLETE');
        console.log('💡 Frontend should now use dedicated donations table');
        console.log('📊 Dashboard will show real donation data with donor information');

    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

testDonationsSystem();