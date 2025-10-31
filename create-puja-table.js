// Create Puja Series Table Programmatically
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ntxqedcyxsqdpauphunc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eHFlZGN5eHNxZHBhdXBodW5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkzMDcyNCwiZXhwIjoyMDc1NTA2NzI0fQ.'; // You need to complete this key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPujaTable() {
    console.log('🏛️ Creating puja_series table...');

    const createTableSQL = `
    -- Drop table if exists (for clean creation)
    DROP TABLE IF EXISTS public.puja_series CASCADE;

    -- Create puja_series table
    CREATE TABLE public.puja_series (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      community_id uuid,
      name text NOT NULL,
      description text DEFAULT '',
      deity text DEFAULT '',
      type text DEFAULT 'puja' CHECK (type IN ('aarti', 'havan', 'puja', 'special_ceremony', 'festival', 'other')),
      status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'draft')),
      schedule_config jsonb DEFAULT '{}'::jsonb,
      start_date timestamp with time zone NOT NULL,
      end_date timestamp with time zone,
      max_participants integer,
      registration_required boolean DEFAULT false,
      priest_id uuid,
      location text DEFAULT '',
      duration_minutes integer DEFAULT 60,
      requirements text[] DEFAULT '{}',
      notes text DEFAULT '',
      created_by uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      CONSTRAINT puja_series_pkey PRIMARY KEY (id)
    );

    -- Enable RLS (but allow all operations for now)
    ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;

    -- Create permissive RLS policies for development
    CREATE POLICY "allow_all_puja_operations" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

    -- Create indexes for performance
    CREATE INDEX idx_puja_series_community_id ON public.puja_series(community_id);
    CREATE INDEX idx_puja_series_status ON public.puja_series(status);
    CREATE INDEX idx_puja_series_type ON public.puja_series(type);
    CREATE INDEX idx_puja_series_start_date ON public.puja_series(start_date);
  `;

    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

        if (error) {
            console.error('❌ Error creating table:', error);
            return;
        }

        console.log('✅ Table created successfully!');

        // Insert sample data
        const sampleData = [
            {
                name: 'Daily Morning Aarti',
                description: 'Daily morning prayers for devotees',
                deity: 'Lord Ganesha',
                type: 'aarti',
                status: 'active',
                start_date: '2025-01-01T06:00:00Z',
                location: 'Main Temple Hall',
                duration_minutes: 30,
                schedule_config: { frequency: 'daily', time: '06:00' }
            },
            {
                name: 'Weekly Havan',
                description: 'Weekly fire ceremony for prosperity',
                deity: 'Agni Dev',
                type: 'havan',
                status: 'active',
                start_date: '2025-01-01T18:00:00Z',
                location: 'Havan Kund',
                duration_minutes: 90,
                schedule_config: { frequency: 'weekly', day: 'sunday', time: '18:00' }
            },
            {
                name: 'Monthly Satyanarayan Puja',
                description: 'Monthly puja for Lord Vishnu',
                deity: 'Lord Vishnu',
                type: 'puja',
                status: 'active',
                start_date: '2025-01-01T10:00:00Z',
                location: 'Prayer Hall',
                duration_minutes: 120,
                schedule_config: { frequency: 'monthly', date: 1, time: '10:00' }
            }
        ];

        const { data: insertData, error: insertError } = await supabase
            .from('puja_series')
            .insert(sampleData);

        if (insertError) {
            console.error('❌ Error inserting sample data:', insertError);
        } else {
            console.log('✅ Sample data inserted successfully!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createPujaTable();