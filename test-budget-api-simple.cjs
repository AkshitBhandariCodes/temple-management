// test-budget-api-simple.js - Simple Budget API Test
const https = require('http');

const API_BASE_URL = 'http://localhost:5000/api';

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE_URL + path);

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testBudgetAPI() {
    console.log('🧪 Testing Budget Requests API');
    console.log('==============================\n');

    try {
        // Test 1: Health Check
        console.log('🏥 Test 1: Health Check');
        const health = await makeRequest('GET', '/health');
        console.log('Status:', health.status);
        console.log('Response:', health.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Get Budget Requests (should work even if table doesn't exist)
        console.log('📋 Test 2: Get Budget Requests');
        const getRequests = await makeRequest('GET', '/budget-requests');
        console.log('Status:', getRequests.status);
        console.log('Response:', getRequests.data);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test 3: Create Budget Request (only if table exists)
        if (getRequests.status === 200 && !getRequests.data.message?.includes('table not created')) {
            console.log('📝 Test 3: Create Budget Request');
            const newRequest = {
                community_id: '550e8400-e29b-41d4-a716-446655440000',
                budget_amount: 7500.50,
                purpose: 'Audio equipment and stage setup for Holi celebration',
                event_name: 'Holi Festival 2025',
                documents: [
                    {
                        name: 'audio_quote.pdf',
                        url: '/uploads/quotes/audio_equipment.pdf',
                        type: 'application/pdf'
                    }
                ]
            };

            const createResponse = await makeRequest('POST', '/budget-requests', newRequest);
            console.log('Status:', createResponse.status);
            console.log('Response:', createResponse.data);

            if (createResponse.status === 201) {
                const requestId = createResponse.data.data.id;
                console.log('✅ Created Request ID:', requestId);

                // Test 4: Approve the request
                console.log('\n✅ Test 4: Approve Budget Request');
                const approvalData = {
                    approved_by: 'finance_manager_123',
                    approval_notes: 'Approved for Holi celebration',
                    approved_amount: 7000.00
                };

                const approveResponse = await makeRequest('PUT', `/budget-requests/${requestId}/approve`, approvalData);
                console.log('Status:', approveResponse.status);
                console.log('Response:', approveResponse.data);
            }
        } else {
            console.log('⚠️ Skipping create test - table not ready');
            console.log('📝 Please create the table using MANUAL_TABLE_CREATION.sql first');
        }

        console.log('\n🎉 API tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testBudgetAPI();