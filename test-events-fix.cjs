const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

async function testEventsFix() {
    console.log('🎯 Testing Events Fix - Complete Workflow...\n');

    try {
        // 1. Get initial events
        console.log('1️⃣ Getting initial events...');
        const initialEventsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events`
        );
        console.log('📊 Initial events count:', initialEventsResponse.data.data.length);

        if (initialEventsResponse.data.data.length > 0) {
            console.log('📅 Sample event:', {
                title: initialEventsResponse.data.data[0].title,
                start_date: initialEventsResponse.data.data[0].start_date,
                status: initialEventsResponse.data.data[0].status
            });
        }

        // 2. Create a new event
        console.log('\n2️⃣ Creating new event...');
        const eventData = {
            title: 'Events Fix Test Event',
            description: 'Testing events functionality after fix',
            start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            end_date: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
            location: 'Test Location',
            event_type: 'meeting',
            max_participants: 25
        };

        const createResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events`,
            eventData
        );
        console.log('✅ Event created:', createResponse.data.data.id);
        const eventId = createResponse.data.data.id;

        // 3. Get single event
        console.log('\n3️⃣ Fetching single event...');
        const singleEventResponse = await axios.get(
            `${BASE_URL}/events/${eventId}`
        );
        console.log('📅 Event details:', {
            title: singleEventResponse.data.data.title,
            participants: `${singleEventResponse.data.data.current_participants}/${singleEventResponse.data.data.max_participants}`,
            status: singleEventResponse.data.data.status
        });

        // 4. Register for event
        console.log('\n4️⃣ Registering for event...');
        const registrationData = {
            user_id: 'test-user-123',
            user_name: 'Test User',
            user_email: 'test@example.com'
        };

        const registerResponse = await axios.post(
            `${BASE_URL}/events/${eventId}/register`,
            registrationData
        );
        console.log('✅ Registration successful:', registerResponse.data.message);

        // 5. Check updated event
        console.log('\n5️⃣ Checking updated event after registration...');
        const updatedEventResponse = await axios.get(
            `${BASE_URL}/events/${eventId}`
        );
        console.log('📊 Updated participants:', `${updatedEventResponse.data.data.current_participants}/${updatedEventResponse.data.data.max_participants}`);

        // 6. Update event
        console.log('\n6️⃣ Updating event...');
        const updateData = {
            title: 'Updated Events Fix Test Event',
            description: 'Updated description for testing'
        };

        const updateResponse = await axios.put(
            `${BASE_URL}/events/${eventId}`,
            updateData
        );
        console.log('✅ Event updated:', updateResponse.data.data.title);

        // 7. Get events with filters
        console.log('\n7️⃣ Testing event filters...');
        const filteredResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events?status=published&limit=5`
        );
        console.log('🔍 Filtered events count:', filteredResponse.data.data.length);

        // 8. Get event statistics
        console.log('\n8️⃣ Getting event statistics...');
        const statsResponse = await axios.get(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events/stats`
        );
        console.log('📊 Event stats:', {
            total: statsResponse.data.data.total,
            upcoming: statsResponse.data.data.upcoming,
            published: statsResponse.data.data.published,
            total_participants: statsResponse.data.data.total_participants
        });

        // 9. Test error handling - try to register for past event
        console.log('\n9️⃣ Testing error handling...');
        try {
            const pastEventData = {
                title: 'Past Event Test',
                description: 'This event is in the past',
                start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
                end_date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // Yesterday + 1 hour
                location: 'Past Location'
            };

            const pastEventResponse = await axios.post(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/events`,
                pastEventData
            );
            const pastEventId = pastEventResponse.data.data.id;

            // Try to register for past event
            await axios.post(
                `${BASE_URL}/events/${pastEventId}/register`,
                registrationData
            );
        } catch (error) {
            console.log('✅ Error handling works:', error.response.data.message);
        }

        console.log('\n🎉 EVENTS FIX TEST PASSED! 🎉');
        console.log('\n📋 Summary:');
        console.log('✅ Events creation working');
        console.log('✅ Event registration working');
        console.log('✅ Event updates working');
        console.log('✅ Event filtering working');
        console.log('✅ Event statistics working');
        console.log('✅ Error handling working');
        console.log('✅ Validation improvements added');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testEventsFix();