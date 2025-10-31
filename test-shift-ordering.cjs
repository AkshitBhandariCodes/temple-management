// Test Shift Ordering - Latest First
const https = require('https');
const http = require('http');

const API_BASE_URL = 'http://localhost:5000/api';

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestModule = urlObj.protocol === 'https:' ? https : http;

        const req = requestModule.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

async function testShiftOrdering() {
    console.log('🧪 Testing Shift Ordering (Latest First)...\n');

    try {
        // Get current shifts and note the first one
        console.log('1. Getting current shifts');
        const beforeResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`);
        const beforeCount = beforeResult.data?.length || 0;
        const firstShiftBefore = beforeResult.data?.[0];

        console.log(`✅ Found ${beforeCount} shifts`);
        console.log(`   First shift: "${firstShiftBefore?.title}" (created: ${firstShiftBefore?.created_at})`);

        // Create a new shift with unique title
        const timestamp = Date.now();
        console.log('\n2. Creating new shift with unique title');
        const newShift = {
            community_id: '5cf9beff-483d-43f0-8ca3-9fba851b283a',
            title: `Latest Shift ${timestamp}`,
            description: 'This should appear first in the list',
            location: 'Main Temple',
            shift_date: '2024-12-15',
            start_time: '14:00:00',
            end_time: '16:00:00',
            required_volunteers: 3,
            skills_required: ['Event Management']
        };

        const createResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShift)
        });

        if (createResult.success) {
            console.log(`✅ Created shift: "${createResult.data.title}"`);
            console.log(`   Created at: ${createResult.data.created_at}`);
        } else {
            console.log('❌ Failed to create shift:', createResult.message);
            return;
        }

        // Get shifts again and check if new one is first
        console.log('\n3. Checking if new shift appears first');
        const afterResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`);
        const afterCount = afterResult.data?.length || 0;
        const firstShiftAfter = afterResult.data?.[0];

        console.log(`✅ Found ${afterCount} shifts`);
        console.log(`   First shift: "${firstShiftAfter?.title}" (created: ${firstShiftAfter?.created_at})`);

        // Verify ordering
        if (firstShiftAfter?.title === newShift.title) {
            console.log('\n🎉 SUCCESS: Latest shift appears first!');
            console.log('   ✅ Backend ordering: Working correctly');
            console.log('   ✅ Latest first: Confirmed');
        } else {
            console.log('\n❌ ISSUE: Latest shift is not first');
            console.log(`   Expected: "${newShift.title}"`);
            console.log(`   Got: "${firstShiftAfter?.title}"`);
        }

        // Show first 3 shifts to verify ordering
        console.log('\n📋 First 3 shifts (should be newest to oldest):');
        afterResult.data?.slice(0, 3).forEach((shift, index) => {
            console.log(`   ${index + 1}. "${shift.title}" (${shift.created_at})`);
        });

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testShiftOrdering();