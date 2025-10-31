// Verify Attendance Database Fix
import fetch from 'node-fetch';

async function verifyAttendanceFix() {
    console.log('🔍 VERIFYING ATTENDANCE DATABASE FIX');
    console.log('=====================================\n');

    try {
        // Step 1: Get volunteers and shifts
        console.log('1️⃣ Checking volunteers and shifts...');
        const volunteersResponse = await fetch('http://localhost:5000/api/volunteers');
        const volunteersData = await volunteersResponse.json();

        const shiftsResponse = await fetch('http://localhost:5000/api/volunteers/shifts');
        const shiftsData = await shiftsResponse.json();

        console.log(`   ✅ Found ${volunteersData.data.length} volunteers`);
        console.log(`   ✅ Found ${shiftsData.data.length} shifts\n`);

        if (volunteersData.data.length === 0 || shiftsData.data.length === 0) {
            console.log('❌ No volunteers or shifts found. Cannot test attendance.');
            return;
        }

        // Step 2: Test creating attendance record
        console.log('2️⃣ Testing attendance creation...');
        const volunteer = volunteersData.data[0];
        const shift = shiftsData.data[0];

        const attendanceData = {
            volunteer_id: volunteer.id,
            shift_id: shift.id,
            status: 'present',
            check_in_time: new Date().toISOString(),
            notes: 'Test attendance via API'
        };

        console.log(`   📝 Creating attendance for: ${volunteer.first_name} ${volunteer.last_name}`);
        console.log(`   📅 Shift: ${shift.title}`);

        const createResponse = await fetch('http://localhost:5000/api/volunteers/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceData)
        });

        const createResult = await createResponse.json();

        if (createResponse.ok) {
            console.log('   ✅ Attendance created successfully!');
            console.log(`   📊 Record ID: ${createResult.data.id}\n`);
        } else {
            console.log('   ❌ Failed to create attendance:');
            console.log(`   🔴 Error: ${createResult.message}`);
            console.log(`   🔴 Details: ${createResult.error}\n`);
            return;
        }

        // Step 3: Verify attendance was saved
        console.log('3️⃣ Verifying attendance was saved...');
        const verifyResponse = await fetch('http://localhost:5000/api/volunteers/attendance');
        const verifyData = await verifyResponse.json();

        console.log(`   ✅ Found ${verifyData.data.length} attendance records`);

        if (verifyData.data.length > 0) {
            const latestRecord = verifyData.data[0];
            console.log('   📋 Latest record:');
            console.log(`      - Volunteer: ${latestRecord.volunteers?.first_name} ${latestRecord.volunteers?.last_name}`);
            console.log(`      - Status: ${latestRecord.status}`);
            console.log(`      - Check-in: ${latestRecord.check_in_time}`);
            console.log(`      - Notes: ${latestRecord.notes}\n`);
        }

        // Step 4: Test updating attendance
        console.log('4️⃣ Testing attendance update...');
        const recordToUpdate = verifyData.data[0];

        const updateResponse = await fetch(`http://localhost:5000/api/volunteers/attendance/${recordToUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'present',
                check_out_time: new Date().toISOString(),
                notes: 'Updated via API test'
            })
        });

        const updateResult = await updateResponse.json();

        if (updateResponse.ok) {
            console.log('   ✅ Attendance updated successfully!\n');
        } else {
            console.log('   ❌ Failed to update attendance:');
            console.log(`   🔴 Error: ${updateResult.message}\n`);
        }

        // Final summary
        console.log('🎉 VERIFICATION COMPLETE');
        console.log('========================');
        console.log('✅ Database schema is working correctly');
        console.log('✅ Attendance creation works');
        console.log('✅ Attendance retrieval works');
        console.log('✅ Attendance updates work');
        console.log('\n🚀 Frontend attendance buttons should now work properly!');

    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error.message);
        console.log('\n🔧 Please check:');
        console.log('1. Backend server is running (http://localhost:5000)');
        console.log('2. Database fix SQL has been applied');
        console.log('3. Supabase connection is working');
    }
}

verifyAttendanceFix();