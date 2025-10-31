// Test Puja Creation Script
// Run this after creating the puja_series table in Supabase

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testPujaCreation() {
    try {
        console.log('🧪 Testing Puja Series Creation...');

        // First, get available communities
        console.log('📋 Fetching communities...');
        const communitiesResponse = await axios.get(`${API_BASE}/communities`);
        const communities = communitiesResponse.data.data;

        if (communities.length === 0) {
            console.log('❌ No communities found. Create a community first.');
            return;
        }

        const communityId = communities[0].id;
        console.log(`✅ Using community: ${communities[0].name} (${communityId})`);

        // Test creating a puja series
        console.log('🕉️ Creating test puja series...');
        const pujaData = {
            community_id: communityId,
            name: 'Test Evening Aarti',
            description: 'Test puja series creation',
            deity: 'Lord Krishna',
            type: 'aarti',
            start_date: '2025-01-01T18:00:00Z',
            location: 'Main Temple',
            duration_minutes: 45,
            registration_required: false
        };

        const createResponse = await axios.post(`${API_BASE}/pujas`, pujaData);
        console.log('✅ Puja series created successfully!');
        console.log('📄 Response:', createResponse.data);

        // Test fetching puja series
        console.log('📋 Fetching all puja series...');
        const fetchResponse = await axios.get(`${API_BASE}/pujas`);
        console.log(`✅ Found ${fetchResponse.data.data.length} puja series`);

        if (fetchResponse.data.data.length > 0) {
            console.log('📄 First puja series:', fetchResponse.data.data[0]);
        }

        console.log('🎉 All tests passed! Puja system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        if (error.response?.data?.error?.includes('puja_series')) {
            console.log('💡 Hint: Run the SQL script in create-puja-table-simple.sql in Supabase Dashboard');
        }
    }
}

// Run the test
testPujaCreation();