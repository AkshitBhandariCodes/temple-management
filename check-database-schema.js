// Check if role column exists in Supabase users table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDatabaseSchema() {
    console.log('🔍 Checking Supabase Database Schema...\n');

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
    );

    try {
        // Try to query the users table to see what columns exist
        console.log('1️⃣ Checking users table structure...');

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error querying users table:', error.message);
            return;
        }

        if (data && data.length > 0) {
            console.log('✅ Users table exists');
            console.log('📋 Available columns:', Object.keys(data[0]));

            if ('role' in data[0]) {
                console.log('✅ Role column EXISTS in database');
                console.log('🔍 Sample role value:', data[0].role);
            } else {
                console.log('❌ Role column MISSING from database');
                console.log('💡 You need to run the add-user-role-field.sql in Supabase Dashboard');
            }

            if ('password_hash' in data[0]) {
                console.log('✅ Password_hash column EXISTS in database');
            } else {
                console.log('❌ Password_hash column MISSING from database');
            }
        } else {
            console.log('⚠️  Users table is empty');
        }

        // Try to insert a test record with role to see if it works
        console.log('\n2️⃣ Testing role field insertion...');

        const testData = {
            id: 'test-role-' + Date.now(),
            email: 'test-role@example.com',
            full_name: 'Test Role User',
            role: 'chairman',
            password_hash: 'test_hash'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(testData)
            .select('*')
            .single();

        if (insertError) {
            console.log('❌ Role insertion failed:', insertError.message);

            if (insertError.message.includes('column "role" of relation "users" does not exist')) {
                console.log('\n🚨 CONFIRMED: Role column does not exist in database');
                console.log('📋 TO FIX:');
                console.log('1. Go to Supabase Dashboard → SQL Editor');
                console.log('2. Copy and run the content from add-user-role-field.sql');
                console.log('3. This will add the role and password_hash columns');
            }
        } else {
            console.log('✅ Role insertion successful!');
            console.log('📝 Inserted data:', {
                id: insertData.id,
                email: insertData.email,
                role: insertData.role
            });

            // Clean up test data
            await supabase.from('users').delete().eq('id', testData.id);
            console.log('🧹 Test data cleaned up');
        }

    } catch (error) {
        console.error('❌ Schema check failed:', error.message);
    }
}

checkDatabaseSchema().catch(console.error);