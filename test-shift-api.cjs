// Test Volunteer Shift API
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

async function testShiftAPI() {
    console.log('🧪 Testing Volunteer Shift API...\n');

    try {
        // Test 1: Get all shifts
        console.log('1. Testing GET /volunteers/shifts');
        const getResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`);
        console.log('✅ GET shifts:', getResult.data?.length || 0, 'shifts found');
        if (getResult.data && getResult.data.length > 0) {
            console.log('Sample shift data:', JSON.stringify(getResult.data[0], null, 2));
        }

        // Test 2: Create a new shift
        console.log('\n2. Testing POST /volunteers/shifts');
        const newShift = {
            community_id: '5cf9beff-483d-43f0-8ca3-9fba851b283a',
            title: 'Test Shift',
            description: 'Test shift created via API',
            location: 'Main Temple',
            shift_date: '2024-12-01',
            start_time: '10:00:00',
            end_time: '12:00:00',
            required_volunteers: 2,
            skills_required: ['Temple Services']
        };

        const postResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShift)
        });

        if (postResult.success) {
            console.log('✅ POST shift successful:', postResult.data.id);
            console.log('   Title:', postResult.data.title);
            console.log('   Date:', postResult.data.shift_date);
            console.log('   Location:', postResult.data.location);
        } else {
            console.log('❌ POST shift failed:', postResult.message);
        }

        // Test 3: Get shifts again to verify creation
        console.log('\n3. Testing GET /volunteers/shifts (after creation)');
        const getResult2 = await makeRequest(`${API_BASE_URL}/volunteers/shifts`);
        console.log('✅ GET shifts:', getResult2.data?.length || 0, 'shifts found');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testShiftAPI();