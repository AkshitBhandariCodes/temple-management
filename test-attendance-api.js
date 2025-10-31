// Test attendance API
async function testAttendanceAPI() {
    try {
        console.log('🔵 Testing attendance API...');

        // Get volunteers
        const volunteersResponse = await fetch('http://localhost:5000/api/volunteers');
        const volunteersData = await volunteersResponse.json();
        console.log('👥 Volunteers:', volunteersData.data?.length || 0);

        // Get shifts
        const shiftsResponse = await fetch('http://localhost:5000/api/volunteers/shifts');
        const shiftsData = await shiftsResponse.json();
        console.log('📅 Shifts:', shiftsData.data?.length || 0);

        // Get attendance
        const attendanceResponse = await fetch('http://localhost:5000/api/volunteers/attendance');
        const attendanceData = await attendanceResponse.json();
        console.log('📊 Attendance records:', attendanceData.data?.length || 0);

        if (volunteersData.data?.length > 0 && shiftsData.data?.length > 0) {
            const volunteer = volunteersData.data[0];
            const shift = shiftsData.data[0];

            console.log('🧪 Testing attendance creation...');
            console.log('Volunteer:', volunteer.id, volunteer.first_name, volunteer.last_name);
            console.log('Shift:', shift.id, shift.title);

            // Test creating attendance record
            const createResponse = await fetch('http://localhost:5000/api/volunteers/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    volunteer_id: volunteer.id,
                    shift_id: shift.id,
                    status: 'scheduled',
                    notes: 'Test assignment'
                })
            });

            const createResult = await createResponse.json();
            console.log('📝 Create attendance result:', createResult);

            if (createResult.success) {
                console.log('✅ Attendance record created successfully!');

                // Test fetching updated attendance
                const updatedAttendanceResponse = await fetch('http://localhost:5000/api/volunteers/attendance');
                const updatedAttendanceData = await updatedAttendanceResponse.json();
                console.log('📊 Updated attendance records:', updatedAttendanceData.data?.length || 0);
            } else {
                console.log('❌ Failed to create attendance record:', createResult.message);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAttendanceAPI();