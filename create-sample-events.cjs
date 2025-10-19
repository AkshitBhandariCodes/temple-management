require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleEvents() {
    try {
        console.log('🎉 Creating sample events...');

        const communityId = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

        const sampleEvents = [
            {
                id: 'event-1',
                community_id: communityId,
                title: 'Morning Prayer Session',
                description: 'Daily morning prayer and meditation',
                start_date: '2025-10-20T06:00:00Z',
                end_date: '2025-10-20T07:00:00Z',
                location: 'Main Temple Hall',
                event_type: 'worship',
                status: 'active',
                max_attendees: 50,
                created_at: new Date().toISOString()
            },
            {
                id: 'event-2',
                community_id: communityId,
                title: 'Diwali Festival Celebration',
                description: 'Grand Diwali celebration with cultural programs',
                start_date: '2025-11-01T18:00:00Z',
                end_date: '2025-11-01T22:00:00Z',
                location: 'Temple Grounds',
                event_type: 'festival',
                status: 'active',
                max_attendees: 200,
                created_at: new Date().toISOString()
            },
            {
                id: 'event-3',
                community_id: communityId,
                title: 'Community Service Drive',
                description: 'Food distribution to underprivileged families',
                start_date: '2025-10-25T09:00:00Z',
                end_date: '2025-10-25T15:00:00Z',
                location: 'Community Center',
                event_type: 'volunteer',
                status: 'active',
                max_attendees: 30,
                created_at: new Date().toISOString()
            },
            {
                id: 'event-4',
                community_id: communityId,
                title: 'Yoga and Meditation Class',
                description: 'Weekly yoga and meditation session',
                start_date: '2025-10-22T07:00:00Z',
                end_date: '2025-10-22T08:30:00Z',
                location: 'Meditation Hall',
                event_type: 'education',
                status: 'active',
                max_attendees: 25,
                created_at: new Date().toISOString()
            },
            {
                id: 'event-5',
                community_id: communityId,
                title: 'Monthly Community Meeting',
                description: 'Monthly meeting to discuss community matters',
                start_date: '2025-10-30T19:00:00Z',
                end_date: '2025-10-30T21:00:00Z',
                location: 'Conference Room',
                event_type: 'meeting',
                status: 'active',
                max_attendees: 15,
                created_at: new Date().toISOString()
            }
        ];

        // Try to create events table first
        console.log('📋 Checking if events table exists...');

        for (const event of sampleEvents) {
            try {
                const { data, error } = await supabase
                    .from('community_events')
                    .insert(event)
                    .select('*')
                    .single();

                if (error) {
                    console.log('❌ Error creating event:', event.title, error.message);
                } else {
                    console.log('✅ Created event:', event.title);
                }
            } catch (err) {
                console.log('❌ Failed to create event:', event.title, err.message);
            }
        }

        console.log('🎉 Sample events creation completed!');

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createSampleEvents();