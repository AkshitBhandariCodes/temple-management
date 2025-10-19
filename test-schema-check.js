// Test schema check endpoint
async function testSchemaCheck() {
    console.log('🔍 Checking Database Schema via API...\n');

    try {
        const response = await fetch('http://localhost:5000/api/debug/check-schema');
        const data = await response.json();

        console.log('📋 Schema Check Results:');
        console.log('Success:', data.success);

        if (data.success) {
            const schema = data.schema;

            console.log('\n📊 Database Info:');
            console.log('- Total users in table:', schema.totalUsers);
            console.log('- Available columns:', schema.availableColumns.join(', '));

            console.log('\n🔍 Column Check:');
            console.log('- Has role column:', schema.hasRoleColumn ? '✅ YES' : '❌ NO');
            console.log('- Has password_hash column:', schema.hasPasswordHashColumn ? '✅ YES' : '❌ NO');

            console.log('\n🧪 Role Test Result:');
            if (schema.roleTestResult.success) {
                console.log('✅ Role insertion test PASSED');
                console.log('- Inserted role value:', schema.roleTestResult.insertedRole);
            } else {
                console.log('❌ Role insertion test FAILED');
                console.log('- Error:', schema.roleTestResult.error);
            }

            console.log('\n💡 Recommendation:');
            console.log(data.recommendation);

            if (!schema.hasRoleColumn) {
                console.log('\n🚨 ACTION REQUIRED:');
                console.log('1. Go to Supabase Dashboard → SQL Editor');
                console.log('2. Copy and run the content from add-user-role-field.sql');
                console.log('3. This will add the missing role and password_hash columns');
                console.log('4. After running SQL, test admin registration again');
            } else {
                console.log('\n✅ Database schema is ready for admin functionality!');
            }

        } else {
            console.log('❌ Schema check failed:', data.error);
        }

    } catch (error) {
        console.error('❌ API Error:', error.message);
    }
}

testSchemaCheck().catch(console.error);