const axios = require('axios');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_COMMUNITY_ID = '3e80bddc-1f83-4935-a0cc-9c48f86bcae7';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugMembersIssue() {
    console.log('🔍 Debugging Members Issue...\n');

    try {
        // 1. Check if members are being added to the database when applications are approved
        console.log('1️⃣ Checking current members in database...');

        const { data: directMembers, error: directError } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID);

        console.log('Direct Supabase query result:');
        console.log('  Members count:', directMembers?.length || 0);
        console.log('  Error:', directError);

        if (directMembers && directMembers.length > 0) {
            console.log('  Sample member:', directMembers[0]);
        }

        // 2. Check what the API returns for members
        console.log('\n2️⃣ Checking API members endpoint...');

        try {
            const apiMembersResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
            );
            console.log('API members response:');
            console.log('  Success:', apiMembersResponse.data.success);
            console.log('  Members count:', apiMembersResponse.data.data?.length || 0);
            console.log('  Message:', apiMembersResponse.data.message);

            if (apiMembersResponse.data.data && apiMembersResponse.data.data.length > 0) {
                console.log('  Sample API member:', apiMembersResponse.data.data[0]);
            }
        } catch (apiError) {
            console.log('API members error:', apiError.response?.data);
        }

        // 3. Test the approval process to see if members are actually being added
        console.log('\n3️⃣ Testing approval process...');

        // Submit a new application
        const newAppData = {
            user_id: null,
            email: 'member-test@example.com',
            name: 'Member Test User',
            message: 'Testing member addition'
        };

        const appResponse = await axios.post(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/apply`,
            newAppData
        );
        const applicationId = appResponse.data.data.id;
        console.log('  Application submitted:', applicationId);

        // Check members count before approval
        const { data: beforeMembers } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID);
        console.log('  Members before approval:', beforeMembers?.length || 0);

        // Approve the application
        const approveResponse = await axios.put(
            `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/applications/${applicationId}/approve`,
            { reviewed_by: null }
        );
        console.log('  Approval result:', approveResponse.data.message);

        // Check members count after approval
        const { data: afterMembers } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', FRONTEND_COMMUNITY_ID);
        console.log('  Members after approval:', afterMembers?.length || 0);

        // 4. Check the members API again
        console.log('\n4️⃣ Checking API members after approval...');

        try {
            const finalApiResponse = await axios.get(
                `${BASE_URL}/communities/${FRONTEND_COMMUNITY_ID}/members`
            );
            console.log('  Final API members count:', finalApiResponse.data.data?.length || 0);
        } catch (finalError) {
            console.log('  Final API error:', finalError.response?.data);
        }

        // 5. Check the community_members table structure
        console.log('\n5️⃣ Checking community_members table structure...');

        if (afterMembers && afterMembers.length > 0) {
            console.log('  Sample member structure:', Object.keys(afterMembers[0]));
            console.log('  Sample member data:', afterMembers[0]);
        }

    } catch (error) {
        console.error('❌ Debug test failed:', error.message);
    }
}

debugMembersIssue();