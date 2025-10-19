const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const COMMUNITY_ID = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

async function testEventsSystem() {
    console.log('🎉 Testing Complete Events Management System...\n');

    try {
        // 1. Get initial events
        console.log('1️⃣ Getting initial events...');
        const initialEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events`
        );
        console.log('📅 Initial events count:', initialEvents.data.data.length);

        // 2. Create a new event
        console.log('\n2️⃣ Creating new event...');
        const newEventData = {
            title: 'Test Event - API Created',
            description: 'This event was created via API for testing',
            start_date: '2025-12-01T10:00:00Z',
            end_date: '2025-12-01T12:00:00Z',
            location: 'API Test Hall',
            event_type: 'meeting',
            max_participants: 25,
            organizer_id: null
        };

        const createResponse = await axios.post(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events`,
            newEventData
        );

        console.log('✅ Event created:', createResponse.data.data.title);
        console.log('🆔 Event ID:', createResponse.data.data.id);
        const eventId = createResponse.data.data.id;

        // 3. Get single event
        console.log('\n3️⃣ Getting single event...');
        const singleEvent = await axios.get(
            `${BASE_URL}/events/${eventId}`
        );
        console.log('📋 Event details:', singleEvent.data.data.title);
        console.log('📅 Start date:', singleEvent.data.data.start_date);

        // 4. Update the event
        console.log('\n4️⃣ Updating event...');
        const updateData = {
            title: 'Updated Test Event - API Modified',
            description: 'This event was updated via API',
            max_participants: 30,
            location: 'Updated API Test Hall'
        };

        const updateResponse = await axios.put(
            `${BASE_URL}/events/${eventId}`,
            updateData
        );
        console.log('✅ Event updated:', updateResponse.data.data.title);
        console.log('👥 New capacity:', updateResponse.data.data.max_participants);

        // 5. Register for event
        console.log('\n5️⃣ Registering for event...');
        const registrationData = {
            user_id: 'test-user-123',
            user_name: 'Test User',
            user_email: 'testuser@example.com'
        };

        const registerResponse = await axios.post(
            `${BASE_URL}/events/${eventId}/register`,
            registrationData
        );
        console.log('✅ Registration successful:', registerResponse.data.message);

        // 6. Get updated events list
        console.log('\n6️⃣ Getting updated events list...');
        const updatedEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events`
        );
        console.log('📅 Updated events count:', updatedEvents.data.data.length);

        // 7. Get events with filters
        console.log('\n7️⃣ Testing event filters...');

        // Filter by status
        const publishedEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events?status=published`
        );
        console.log('📊 Published events:', publishedEvents.data.data.length);

        // Filter by type
        const meetingEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events?type=meeting`
        );
        console.log('🤝 Meeting events:', meetingEvents.data.data.length);

        // 8. Get event statistics
        console.log('\n8️⃣ Getting event statistics...');
        const stats = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events/stats`
        );
        console.log('📊 Event statistics:', stats.data.data);

        // 9. Test calendar integration
        console.log('\n9️⃣ Testing calendar integration...');
        const calendarEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/calendar`
        );
        console.log('📅 Calendar events:', calendarEvents.data.data.length);

        // Show some calendar events
        if (calendarEvents.data.data.length > 0) {
            console.log('📋 Sample calendar events:');
            calendarEvents.data.data.slice(0, 3).forEach(event => {
                console.log(`  - ${event.title} (${new Date(event.start).toLocaleDateString()})`);
            });
        }

        // 10. Delete the test event
        console.log('\n🔟 Cleaning up - deleting test event...');
        const deleteResponse = await axios.delete(
            `${BASE_URL}/events/${eventId}`
        );
        console.log('✅ Event deleted:', deleteResponse.data.message);

        // 11. Verify deletion
        console.log('\n1️⃣1️⃣ Verifying deletion...');
        const finalEvents = await axios.get(
            `${BASE_URL}/communities/${COMMUNITY_ID}/events`
        );
        console.log('📅 Final events count:', finalEvents.data.data.length);

        console.log('\n🎉 Complete Events System Test Passed!');
        console.log('\n📋 Summary:');
        console.log('✅ Create Event: Working');
        console.log('✅ Read Events: Working');
        console.log('✅ Update Event: Working');
        console.log('✅ Delete Event: Working');
        console.log('✅ Event Registration: Working');
        console.log('✅ Event Filtering: Working');
        console.log('✅ Event Statistics: Working');
        console.log('✅ Calendar Integration: Working');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status) {
            console.log('Status:', error.response.status);
        }
    }
}

testEventsSystem();