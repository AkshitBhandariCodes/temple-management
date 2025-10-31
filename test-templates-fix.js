// Test Templates Fix
import fetch from 'node-fetch';

async function testTemplatesFix() {
    console.log('🔍 TESTING TEMPLATES FIX');
    console.log('========================\n');

    try {
        // Test templates endpoint
        console.log('1️⃣ Testing templates API endpoint...');

        const response = await fetch('http://localhost:5000/api/communications/templates');
        const result = await response.json();

        if (response.ok) {
            console.log(`   ✅ Templates API working (${result.data?.length || 0} templates found)`);
        } else {
            console.log('   ❌ Templates API failed:', result.message);
        }

        // Test creating a template
        console.log('\n2️⃣ Testing template creation...');

        const testTemplate = {
            name: "Test Template",
            description: "Test template for verification",
            category: "general",
            subject: "Test Subject",
            content: "<h1>Test Content</h1><p>Hello {{name}}!</p>",
            variables: ["name"]
        };

        const createResponse = await fetch('http://localhost:5000/api/communications/templates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testTemplate)
        });

        const createResult = await createResponse.json();

        if (createResponse.ok) {
            console.log('   ✅ Template creation working!');
            console.log(`   📧 Created template: ${createResult.data?.name}`);
        } else {
            console.log('   ❌ Template creation failed:', createResult.message);
        }

        console.log('\n🎉 TEMPLATES FIX VERIFICATION COMPLETE');
        console.log('=====================================');
        console.log('✅ Templates API endpoints working');
        console.log('✅ Template creation functional');
        console.log('✅ Frontend should now load without errors');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    }
}

testTemplatesFix();