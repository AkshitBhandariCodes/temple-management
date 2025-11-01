// Test puja creation directly
const fetch = require('node-fetch');

async function testPujaCreation() {
    try {
        console.log('🧪 Testing Puja Creation API...');

        const testData = {
            name: 'Direct API Test Puja',
            description: 'Testing direct API call',
            type: 'puja',
            location: 'Main Temple',
            priest: 'Test Priest',
            start_time: '06:00',
            duration_minutes: 60,
            recurrence_type: 'none'
        };

        console.log('📝 Sending data:', testData);

        const response = await fetch('http://localhost:5000/api/pujas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        console.log('📊 Response status:', response.status);
        console.log('📊 Response data:', result);

        if (response.ok) {
            console.log('✅ Puja creation successful!');
        } else {
            console.log('❌ Puja creation failed:', result.message);
            if (result.error) {
                console.log('❌ Error details:', result.error);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testPujaCreation();