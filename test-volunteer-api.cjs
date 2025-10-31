// Test Volunteer API
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

async function testVolunteerAPI() {
    console.log('🧪 Testing Volunteer API...\n');

    try {
        // Test 1: Get all volunteers
        console.log('1. Testing GET /volunteers');
        const getResult = await makeRequest(`${API_BASE_URL}/volunteers`);
        console.log('✅ GET volunteers:', getResult.data?.length || 0, 'volunteers found');

        // Test 2: Create a new volunteer
        console.log('\n2. Testing POST /volunteers');
        const newVolunteer = {
            community_id: '5cf9beff-483d-43f0-8ca3-9fba851b283a',
            first_name: 'Test',
            last_name: 'Volunteer',
            email: `test.volunteer.${Date.now()}@example.com`,
            phone: '+1-555-123-4567',
            skills: ['Event Management', 'Teaching'],
            interests: ['Cultural Events', 'Education'],
            notes: 'Test volunteer created via API'
        };

        const postResult = await makeRequest(`${API_BASE_URL}/volunteers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVolunteer)
        });
        
        if (postResult.success) {
            console.log('✅ POST volunteer successful:', postResult.data.id);
            console.log('   Name:', postResult.data.first_name, postResult.data.last_name);
            console.log('   Email:', postResult.data.email);
        } else {
            console.log('❌ POST volunteer failed:', postResult.message);
        }

        // Test 3: Get volunteers again to verify creation
        console.log('\n3. Testing GET /volunteers (after creation)');
        const getResult2 = await makeRequest(`${API_BASE_URL}/volunteers`);
        console.log('✅ GET volunteers:', getResult2.data?.length || 0, 'volunteers found');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testVolunteerAPI();