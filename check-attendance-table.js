// Check attendance table structure
import fetch from 'node-fetch';

async function checkAttendanceTable() {
    try {
        // Test creating attendance without shift_assignment_id
        console.log('🔍 Testing attendance creation without shift_assignment_id...');

        const attendanceData = {
            volunteer_id: '8dc70de0-1b56-4fb2-96da-99d71960594c',
            shift_id: 'b1255c79-0251-4d9e-81a7-acc466215470',
            status: 'present',
            check_in_time: new Date().toISOString()
        };

        const response = await fetch('http://localhost:5000/api/volunteers/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', result);

        if (result.error && result.error.includes('shift_assignment_id')) {
            console.log('❌ Confirmed: shift_assignment_id is required but not provided');
            console.log('💡 Solution: Need to make shift_assignment_id optional in database');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAttendanceTable();