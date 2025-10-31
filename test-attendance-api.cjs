// Test Attendance API
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

async function testAttendanceAPI() {
    console.log('🧪 Testing Attendance API...\n');

    try {
        // Test 1: Get volunteers
        console.log('1. Getting volunteers');
        const volunteersResult = await makeRequest(`${API_BASE_URL}/volunteers`);
        const volunteers = volunteersResult.data || [];
        console.log(`✅ Found ${volunteers.length} volunteers`);

        // Test 2: Get shifts
        console.log('\n2. Getting shifts');
        const shiftsResult = await makeRequest(`${API_BASE_URL}/volunteers/shifts`);
        const shifts = shiftsResult.data || [];
        console.log(`✅ Found ${shifts.length} shifts`);

        if (volunteers.length === 0 || shifts.length === 0) {
            console.log('❌ Need volunteers and shifts to test attendance');
            return;
        }

        // Test 3: Get current attendance
        console.log('\n3. Getting current attendance');
        const attendanceResult = await makeRequest(`${API_BASE_URL}/volunteers/attendance`);
        console.log(`✅ Found ${attendanceResult.data?.length || 0} attendance records`);

        // Test 4: Create attendance record
        console.log('\n4. Creating attendance record');
        const newAttendance = {
            volunteer_id: volunteers[0].id,
            shift_id: shifts[0].id,
            status: 'present',
            check_in_time: new Date().toISOString(),
            notes: 'Test attendance record'
        };

        const createResult = await makeRequest(`${API_BASE_URL}/volunteers/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAttendance)
        });

        if (createResult.success) {
            console.log('✅ Attendance record created:', createResult.data.id);
            console.log(`   Volunteer: ${volunteers[0].first_name} ${volunteers[0].last_name}`);
            console.log(`   Shift: ${shifts[0].title}`);
            console.log(`   Status: ${createResult.data.status}`);
        } else {
            console.log('❌ Failed to create attendance:', createResult.message);
        }

        // Test 5: Get attendance again
        console.log('\n5. Getting updated attendance');
        const attendanceResult2 = await makeRequest(`${API_BASE_URL}/volunteers/attendance`);
        console.log(`✅ Found ${attendanceResult2.data?.length || 0} attendance records`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAttendanceAPI();