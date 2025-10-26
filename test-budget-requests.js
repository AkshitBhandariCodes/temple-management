// test-budget-requests.js - Test Budget Requests API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testBudgetRequest = {
    community_id: '550e8400-e29b-41d4-a716-446655440000', // Replace with actual community ID
    budget_amount: 15000.50,
    purpose: 'Sound system rental and decorations for Diwali festival celebration. We need professional audio equipment for the main stage and colorful decorations for the temple premises.',
    event_name: 'Diwali Festival 2025',
    documents: [
        {
            name: 'sound_system_quote.pdf',
            url: '/uploads/quotes/sound_system_quote.pdf',
            type: 'application/pdf'
        },
        {
            name: 'decoration_receipt.jpg',
            url: '/uploads/receipts/decoration_receipt.jpg',
            type: 'image/jpeg'
        },
        {
            name: 'venue_booking_confirmation.pdf',
            url: '/uploads/confirmations/venue_booking.pdf',
            type: 'application/pdf'
        }
    ],
    requested_by: '123e4567-e89b-12d3-a456-426614174000' // Replace with actual user ID
};

async function testBudgetRequestsAPI() {
    console.log('🧪 Testing Budget Requests API');
    console.log('================================\n');

    try {
        // Test 1: Create Budget Request
        console.log('📝 Test 1: Creating Budget Request');
        console.log('Request Data:', JSON.stringify(testBudgetRequest, null, 2));

        const createResponse = await axios.post(`${API_BASE_URL}/budget-requests`, testBudgetRequest);
        console.log('✅ Create Response:', createResponse.data);

        const createdRequestId = createResponse.data.data.id;
        console.log('📋 Created Request ID:', createdRequestId);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Get All Budget Requests
        console.log('📋 Test 2: Getting All Budget Requests');
        const getAllResponse = await axios.get(`${API_BASE_URL}/budget-requests`);
        console.log('✅ Get All Response:', getAllResponse.data);
        console.log('📊 Total Requests:', getAllResponse.data.total);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Get Budget Requests by Community
        console.log('🏢 Test 3: Getting Budget Requests by Community');
        const getCommunityResponse = await axios.get(`${API_BASE_URL}/budget-requests/community/${testBudgetRequest.community_id}`);
        console.log('✅ Get Community Response:', getCommunityResponse.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 4: Get Pending Budget Requests
        console.log('⏳ Test 4: Getting Pending Budget Requests');
        const getPendingResponse = await axios.get(`${API_BASE_URL}/budget-requests?status=pending`);
        console.log('✅ Get Pending Response:', getPendingResponse.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 5: Approve Budget Request
        console.log('✅ Test 5: Approving Budget Request');
        const approvalData = {
            approved_by: 'finance_manager_id',
            approval_notes: 'Approved for Diwali celebration. Please ensure proper receipts are maintained.',
            approved_amount: 14000.00 // Slightly less than requested
        };

        console.log('Approval Data:', JSON.stringify(approvalData, null, 2));
        const approveResponse = await axios.put(`${API_BASE_URL}/budget-requests/${createdRequestId}/approve`, approvalData);
        console.log('✅ Approve Response:', approveResponse.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 6: Create Another Request for Rejection Test
        console.log('📝 Test 6: Creating Another Request for Rejection Test');
        const testBudgetRequest2 = {
            ...testBudgetRequest,
            budget_amount: 50000.00,
            purpose: 'Expensive sound system that exceeds budget limits',
            event_name: 'Over Budget Event'
        };

        const createResponse2 = await axios.post(`${API_BASE_URL}/budget-requests`, testBudgetRequest2);
        const createdRequestId2 = createResponse2.data.data.id;
        console.log('✅ Second Request Created:', createdRequestId2);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 7: Reject Budget Request
        console.log('❌ Test 7: Rejecting Budget Request');
        const rejectionData = {
            rejected_by: 'finance_manager_id',
            rejection_reason: 'Budget amount exceeds allocated funds for community events. Please submit a revised request with a lower amount.'
        };

        console.log('Rejection Data:', JSON.stringify(rejectionData, null, 2));
        const rejectResponse = await axios.put(`${API_BASE_URL}/budget-requests/${createdRequestId2}/reject`, rejectionData);
        console.log('✅ Reject Response:', rejectResponse.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 8: Get Final Status
        console.log('📊 Test 8: Final Status Check');
        const finalStatusResponse = await axios.get(`${API_BASE_URL}/budget-requests`);
        console.log('✅ Final Status:', finalStatusResponse.data);

        console.log('\n📈 Summary:');
        console.log('- Total Requests:', finalStatusResponse.data.total);
        console.log('- Approved Requests:', finalStatusResponse.data.data.filter(r => r.status === 'approved').length);
        console.log('- Rejected Requests:', finalStatusResponse.data.data.filter(r => r.status === 'rejected').length);
        console.log('- Pending Requests:', finalStatusResponse.data.data.filter(r => r.status === 'pending').length);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

// Additional test functions for specific scenarios
async function testPostmanScenarios() {
    console.log('\n🔧 Postman-like Test Scenarios');
    console.log('==============================\n');

    // Scenario 1: Create request with minimal data
    console.log('📝 Scenario 1: Minimal Budget Request');
    try {
        const minimalRequest = {
            community_id: '550e8400-e29b-41d4-a716-446655440000',
            budget_amount: 1000,
            purpose: 'Basic supplies for community meeting'
        };

        const response = await axios.post(`${API_BASE_URL}/budget-requests`, minimalRequest);
        console.log('✅ Minimal Request Success:', response.data.data.id);
    } catch (error) {
        console.error('❌ Minimal Request Failed:', error.response?.data);
    }

    // Scenario 2: Invalid data validation
    console.log('\n📝 Scenario 2: Invalid Data Validation');
    try {
        const invalidRequest = {
            community_id: '550e8400-e29b-41d4-a716-446655440000',
            // Missing budget_amount and purpose
        };

        const response = await axios.post(`${API_BASE_URL}/budget-requests`, invalidRequest);
        console.log('❌ Should have failed but succeeded:', response.data);
    } catch (error) {
        console.log('✅ Validation working correctly:', error.response?.data?.message);
    }

    // Scenario 3: Filter by status
    console.log('\n📋 Scenario 3: Status Filtering');
    try {
        const pendingResponse = await axios.get(`${API_BASE_URL}/budget-requests?status=pending`);
        const approvedResponse = await axios.get(`${API_BASE_URL}/budget-requests?status=approved`);
        const rejectedResponse = await axios.get(`${API_BASE_URL}/budget-requests?status=rejected`);

        console.log('✅ Pending:', pendingResponse.data.total);
        console.log('✅ Approved:', approvedResponse.data.total);
        console.log('✅ Rejected:', rejectedResponse.data.total);
    } catch (error) {
        console.error('❌ Filtering Failed:', error.response?.data);
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 Starting Budget Requests API Tests\n');

    await testBudgetRequestsAPI();
    await testPostmanScenarios();

    console.log('\n✨ All tests completed!');
    console.log('\n📋 Postman Collection Equivalent:');
    console.log('1. POST /api/budget-requests - Create budget request');
    console.log('2. GET /api/budget-requests - Get all requests');
    console.log('3. GET /api/budget-requests?status=pending - Get pending requests');
    console.log('4. GET /api/budget-requests/community/{id} - Get community requests');
    console.log('5. PUT /api/budget-requests/{id}/approve - Approve request');
    console.log('6. PUT /api/budget-requests/{id}/reject - Reject request');
    console.log('7. DELETE /api/budget-requests/{id} - Delete request');
}

// Execute if run directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testBudgetRequestsAPI,
    testPostmanScenarios,
    runAllTests
};