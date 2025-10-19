require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCorrectEvents() {
    try {
        console.log('🎉 Creating events with correct structure...');

        const communityId = 'cb9d0802-1664-4a83-a0af-8a1444919d47';

        const sampleEvents = [
            {
                community_id: communityId,
                title: 'Morning Prayer Session',
                description: 'Daily morning prayer and meditation',
                start_date: '2025-10-20T06:00:00Z',
                end_date: '2025-10-20T07:00:00Z',
                location: 'Main Temple Hall',
                event_type: 'meeting',
                status: 'published',
                max_participants: 50,
                current_participants: 0
            },
            {
                community_id: communityId,
                title: 'Diwali Festival Celebration',
                description: 'Grand Diwali celebration with cultural programs',
                start_date: '2025-11-01T18:00:00Z',
                end_date: '2025-11-01T22:00:00Z',
                location: 'Temple Grounds',
                event_type: 'meeting',
                status: 'published',
                max_participants: 200,
                current_participants: 0
            },
            {
                community_id: communityId,
                title: 'Community Service Drive',
                description: 'Food distribution to underprivileged families',
                start_date: '2025-10-25T09:00:00Z',
                end_date: '2025-10-25T15:00:00Z',
                location: 'Community Center',
                event_type: 'meeting',
                status: 'published',
                max_participants: 30,
                current_participants: 0
            },
            {
                community_id: communityId,
                title: 'Yoga and Meditation Class',
                description: 'Weekly yoga and meditation session',
                start_date: '2025-10-22T07:00:00Z',
                end_date: '2025-10-22T08:30:00Z',
                location: 'Meditation Hall',
                event_type: 'meeting',
                status: 'published',
                max_participants: 25,
                current_participants: 0
            },
            {
                community_id: communityId,
                title: 'Monthly Community Meeting',
                description: 'Monthly meeting to discuss community matters',
                start_date: '2025-10-30T19:00:00Z',
                end_date: '2025-10-30T21:00:00Z',
                location: 'Conference Room',
                event_type: 'meeting',
                status: 'published',
                max_participants: 15,
                current_participants: 0
            }
        ];

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
                    console.log('✅ Created event:', event.title, 'ID:', data.id);
                }
            } catch (err) {
                console.log('❌ Failed to create event:', event.title, err.message);
            }
        }

        console.log('🎉 Events creation completed!');

    } catch (err) {
        console.error('Script error:', err.message);
    }
}

createCorrectEvents();