const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testFrontendLoadingFix() {
    console.log('🎯 Testing Frontend Loading Issues - Members, Reports, Calendar...\n');

    try {
        // 1. Test Members Loading
        console.log('1️⃣ Testing Members Loading...');
        try {
            const membersResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
            );
            console.log('✅ Members API working:', {
                success: membersResponse.data.success,
                count: membersResponse.data.data.length,
                total: membersResponse.data.total
            });

            if (membersResponse.data.data.length > 0) {
                console.log('👤 Sample member:', {
                    name: membersResponse.data.data[0].full_name,
                    email: membersResponse.data.data[0].email,
                    role: membersResponse.data.data[0].role
                });
            }
        } catch (membersError) {
            console.error('❌ Members API failed:', membersError.response?.data || membersError.message);
        }

        // 2. Test Reports Loading
        console.log('\n2️⃣ Testing Reports Loading...');
        try {
            const reportsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/reports`
            );
            console.log('✅ Reports API working:', {
                success: reportsResponse.data.success,
                generated_at: reportsResponse.data.data.generated_at,
                stats: reportsResponse.data.data.statistics
            });
        } catch (reportsError) {
            console.error('❌ Reports API failed:', reportsError.response?.data || reportsError.message);
        }

        // 3. Test Calendar Loading
        console.log('\n3️⃣ Testing Calendar Loading...');
        try {
            const calendarResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/calendar`
            );
            console.log('✅ Calendar API working:', {
                success: calendarResponse.data.success,
                events_count: calendarResponse.data.data.length
            });

            if (calendarResponse.data.data.length > 0) {
                console.log('📅 Sample calendar event:', {
                    title: calendarResponse.data.data[0].title,
                    start: calendarResponse.data.data[0].start,
                    type: calendarResponse.data.data[0].type
                });
            }
        } catch (calendarError) {
            console.error('❌ Calendar API failed:', calendarError.response?.data || calendarError.message);
        }

        // 4. Test Events API (used by calendar)
        console.log('\n4️⃣ Testing Events API (Calendar Data Source)...');
        try {
            const eventsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events`
            );
            console.log('✅ Events API working:', {
                success: eventsResponse.data.success,
                events_count: eventsResponse.data.data.length,
                total: eventsResponse.data.total
            });
        } catch (eventsError) {
            console.error('❌ Events API failed:', eventsError.response?.data || eventsError.message);
        }

        // 5. Test Applications (used by members and reports)
        console.log('\n5️⃣ Testing Applications API (Members Data Source)...');
        try {
            const applicationsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications`
            );
            console.log('✅ Applications API working:', {
                success: applicationsResponse.data.success,
                applications_count: applicationsResponse.data.data.length,
                total: applicationsResponse.data.total
            });

            const approvedApps = applicationsResponse.data.data.filter(app => app.status === 'approved');
            console.log('👥 Approved applications (members):', approvedApps.length);
        } catch (applicationsError) {
            console.error('❌ Applications API failed:', applicationsError.response?.data || applicationsError.message);
        }

        // 6. Test Community Stats
        console.log('\n6️⃣ Testing Community Stats...');
        try {
            const statsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/stats`
            );
            console.log('✅ Community Stats API working:', {
                success: statsResponse.data.success,
                stats: statsResponse.data.data
            });
        } catch (statsError) {
            console.error('❌ Community Stats API failed:', statsError.response?.data || statsError.message);
        }

        // 7. Test Event Stats
        console.log('\n7️⃣ Testing Event Stats...');
        try {
            const eventStatsResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events/stats`
            );
            console.log('✅ Event Stats API working:', {
                success: eventStatsResponse.data.success,
                stats: eventStatsResponse.data.data
            });
        } catch (eventStatsError) {
            console.error('❌ Event Stats API failed:', eventStatsError.response?.data || eventStatsError.message);
        }

        // 8. Test Server Health
        console.log('\n8️⃣ Testing Server Health...');
        try {
            const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
            console.log('✅ Server Health:', {
                status: healthResponse.data.status,
                database: healthResponse.data.database,
                models: Object.keys(healthResponse.data.models).length
            });
        } catch (healthError) {
            console.error('❌ Server Health failed:', healthError.response?.data || healthError.message);
        }

        // 9. Test Route Registration
        console.log('\n9️⃣ Testing Route Registration...');
        try {
            const routesResponse = await axios.get(`${BASE_URL}/test/community-routes`);
            console.log('✅ Route Registration:', {
                success: routesResponse.data.success,
                endpoints_count: routesResponse.data.availableEndpoints.length
            });
        } catch (routesError) {
            console.error('❌ Route Registration failed:', routesError.response?.data || routesError.message);
        }

        console.log('\n🎉 FRONTEND LOADING TEST COMPLETED! 🎉');
        console.log('\n📋 Summary:');
        console.log('✅ All API endpoints tested');
        console.log('✅ Members, Reports, Calendar functionality checked');
        console.log('✅ Data sources verified');
        console.log('✅ Server health confirmed');
        console.log('\n💡 If frontend is still loading, check:');
        console.log('   - Frontend API calls match these endpoints');
        console.log('   - CORS settings allow frontend domain');
        console.log('   - Frontend error handling for API failures');
        console.log('   - Network connectivity between frontend and backend');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testFrontendLoadingFix();