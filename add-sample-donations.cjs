// Add sample donation data to finance system
require('dotenv').config();
const supabaseService = require('./backend/src/services/supabaseService');

async function addSampleDonations() {
    try {
        console.log('💰 Adding Sample Donation Data...');

        // Get donation category ID
        const { data: categories } = await supabaseService.client
            .from('budget_categories')
            .select('id, name')
            .eq('category_type', 'income');

        const donationCategory = categories.find(cat =>
            cat.name.toLowerCase().includes('donation')
        );

        if (!donationCategory) {
            console.log('❌ No donation category found. Creating one...');

            const { data: newCategory } = await supabaseService.client
                .from('budget_categories')
                .insert({
                    name: 'General Donations',
                    description: 'Regular donations from devotees',
                    category_type: 'income',
                    budget_amount: 100000
                })
                .select('*')
                .single();

            donationCategory = newCategory;
            console.log('✅ Created donation category:', newCategory.name);
        }

        // Sample donation data
        const sampleDonations = [
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 5000,
                description: 'Monthly donation - Sharma Family',
                payment_method: 'bank_transfer',
                date: '2025-11-01',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 2500,
                description: 'Festival donation - Diwali celebration',
                payment_method: 'cash',
                date: '2025-10-31',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 10000,
                description: 'Annual donation - Gupta Family',
                payment_method: 'cheque',
                date: '2025-10-30',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 1500,
                description: 'Online donation via UPI',
                payment_method: 'upi',
                date: '2025-10-29',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 3000,
                description: 'Puja sponsorship - Satyanarayan Puja',
                payment_method: 'cash',
                date: '2025-10-28',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 7500,
                description: 'Temple construction fund',
                payment_method: 'bank_transfer',
                date: '2025-10-27',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 2000,
                description: 'Weekly collection - Sunday service',
                payment_method: 'cash',
                date: '2025-10-26',
                status: 'completed'
            },
            {
                category_id: donationCategory.id,
                type: 'income',
                amount: 4000,
                description: 'Birthday celebration donation',
                payment_method: 'upi',
                date: '2025-10-25',
                status: 'completed'
            }
        ];

        console.log(`📝 Adding ${sampleDonations.length} sample donations...`);

        // Insert donations
        const { data: insertedDonations, error } = await supabaseService.client
            .from('transactions')
            .insert(sampleDonations)
            .select('*');

        if (error) {
            console.error('❌ Error inserting donations:', error);
            return;
        }

        console.log(`✅ Successfully added ${insertedDonations.length} donations`);

        // Calculate totals
        const totalAmount = sampleDonations.reduce((sum, d) => sum + d.amount, 0);
        console.log(`💰 Total donation amount: ₹${totalAmount.toLocaleString()}`);

        // Show summary
        console.log('\n📊 Donation Summary:');
        insertedDonations.forEach(donation => {
            console.log(`   ₹${donation.amount.toLocaleString()} - ${donation.description} (${donation.date})`);
        });

        // Get updated financial summary
        console.log('\n🔄 Fetching updated financial summary...');

        const { data: allTransactions } = await supabaseService.client
            .from('transactions')
            .select('type, amount');

        const totalIncome = allTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpenses = allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        console.log('\n📈 Updated Financial Summary:');
        console.log(`   💰 Total Income: ₹${totalIncome.toLocaleString()}`);
        console.log(`   💸 Total Expenses: ₹${totalExpenses.toLocaleString()}`);
        console.log(`   📊 Net Amount: ₹${(totalIncome - totalExpenses).toLocaleString()}`);
        console.log(`   📋 Total Transactions: ${allTransactions.length}`);

        console.log('\n🎉 Sample donations added successfully!');
        console.log('💡 Now check the dashboard to see updated donation totals.');

    } catch (error) {
        console.error('❌ Failed to add sample donations:', error.message);
    }
}

addSampleDonations();