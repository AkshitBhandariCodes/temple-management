const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testReportsAndCalendar() {
    console.log('📊 Testing Reports and Calendar...\n');

    try {
        // 1. Test Reports
        console.log('1️⃣ Testing Community Reports...');
        const reportsResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/reports`
        );

        console.log('✅ Reports generated successfully!');
        console.log('📊 Statistics:', reportsResponse.data.data.statistics);
        console.log('📈 Charts data available:', Object.keys(reportsResponse.data.data.charts_data));

        // 2. Test Calendar
        console.log('\n2️⃣ Testing Calendar Events...');
        const calendarResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/calendar`
        );

        console.log('✅ Calendar events fetched successfully!');
        console.log('📅 Events found:', calendarResponse.data.data.length);

        if (calendarResponse.data.data.length > 0) {
            console.log('📋 Sample events:');
            calendarResponse.data.data.slice(0, 3).forEach(event => {
                console.log(`  - ${event.title} (${event.start})`);
            });
        }

        // 3. Test Calendar with date filter
        console.log('\n3️⃣ Testing Calendar with date filter...');
        const filteredCalendarResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/calendar?month=10&year=2025`
        );

        console.log('✅ Filtered calendar events:', filteredCalendarResponse.data.data.length);

        // 4. Test Reports with date range
        console.log('\n4️⃣ Testing Reports with date range...');
        const dateRangeReportsResponse = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/reports?startDate=2025-10-01&endDate=2025-10-31`
        );

        console.log('✅ Date range reports generated!');
        console.log('📊 Period:', dateRangeReportsResponse.data.data.period);

        console.log('\n🎉 All reports and calendar tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testReportsAndCalendar();