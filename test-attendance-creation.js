// Test attendance creation
import fetch from 'node-fetch';

async function testAttendanceCreation() {
    try {
        // First get volunteers and shifts
        console.log('🔍 Getting volunteers...');
        const volunteersResponse = await fetch('http://localhost:5000/api/volunteers');
        const volunteersData = await volunteersResponse.json();
        console.log('Volunteers:', volunteersData.data.length);

        console.log('🔍 Getting shifts...');
        const shiftsResponse = await fetch('http://localhost:5000/api/volunteers/shifts');
        const shiftsData = await shiftsResponse.json();
        console.log('Shifts:', shiftsData.data.length);

        if (volunteersData.data.length > 0 && shiftsData.data.length > 0) {
            const volunteer = volunteersData.data[0];
            const shift = shiftsData.data[0];

            console.log('📝 Creating attendance record...');
            console.log('Volunteer ID:', volunteer.id);
            console.log('Shift ID:', shift.id);

            const attendanceData = {
                volunteer_id: volunteer.id,
                shift_id: shift.id,
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

            if (response.ok) {
                console.log('✅ Attendance created successfully!');

                // Verify by fetching attendance records
                console.log('🔍 Verifying attendance records...');
                const verifyResponse = await fetch('http://localhost:5000/api/volunteers/attendance');
                const verifyData = await verifyResponse.json();
                console.log('Attendance records:', verifyData.data.length);
                console.log('Latest record:', verifyData.data[0]);
            } else {
                console.log('❌ Failed to create attendance');
            }
        } else {
            console.log('❌ No volunteers or shifts found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAttendanceCreation();