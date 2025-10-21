const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function debugCommunityMembersInsertion() {
    console.log('🔍 Debugging Community Members Table Insertion...\n');

    try {
        // 1. Test direct table access
        console.log('1️⃣ Testing direct table access...');
        const { data: existingMembers, error: selectError } = await supabase
            .from('community_members')
            .select('*')
            .limit(5);

        if (selectError) {
            console.log('❌ Select error:', selectError);
        } else {
            console.log('✅ Select successful, found', existingMembers?.length || 0, 'members');
            if (existingMembers && existingMembers.length > 0) {
                console.log('📋 Existing member structure:', Object.keys(existingMembers[0]));
            }
        }

        // 2. Test insertion with minimal data
        console.log('\n2️⃣ Testing minimal insertion...');
        const minimalMember = {
            community_id: 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
            user_id: null
        };

        const { data: minimalResult, error: minimalError } = await supabase
            .from('community_members')
            .insert(minimalMember)
            .select('*');

        if (minimalError) {
            console.log('❌ Minimal insertion error:', minimalError);
        } else {
            console.log('✅ Minimal insertion successful:', minimalResult[0]?.id);
            // Clean up
            if (minimalResult[0]?.id) {
                await supabase.from('community_members').delete().eq('id', minimalResult[0].id);
            }
        }

        // 3. Test insertion with only existing columns
        console.log('\n3️⃣ Testing insertion with existing columns only...');
        const basicMember = {
            community_id: 'c2625a88-07c5-4135-a0a0-a5e625f8c3b4',
            user_id: null
        };

        const { data: basicResult, error: basicError } = await supabase
            .from('community_members')
            .insert(basicMember)
            .select('*');

        if (basicError) {
            console.log('❌ Basic insertion error:', basicError);
        } else {
            console.log('✅ Basic insertion successful:', basicResult[0]?.id);
            // Clean up
            if (basicResult[0]?.id) {
                await supabase.from('community_members').delete().eq('id', basicResult[0].id);
            }
        }

        // 4. Get table schema info
        console.log('\n4️⃣ Checking table schema...');
        const { data: schemaData, error: schemaError } = await supabase
            .rpc('get_table_columns', { table_name: 'community_members' })
            .single();

        if (schemaError) {
            console.log('❌ Schema check failed:', schemaError.message);
        } else {
            console.log('✅ Schema info:', schemaData);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugCommunityMembersInsertion();