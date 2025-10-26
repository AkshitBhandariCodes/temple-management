// test-budget-after-fix.cjs - Test budget API after table fix
const http = require('http');

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
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
    console.log('🧪 Testing Budget API After Table Fix');
    console.log('=====================================\n');

    try {
        // Test 1: GET budget requests
        console.log('📋 Test 1: Get Budget Requests');
        const getResponse = await makeRequest('GET', '/budget-requests');
        console.log('Status:', getResponse.status);
        console.log('Response:', JSON.stringify(getResponse.data, null, 2));

        if (getResponse.status === 200) {
            console.log('✅ GET request successful!');
            console.log(`📊 Found ${getResponse.data.total} budget requests`);
        } else {
            console.log('❌ GET request failed');
            return;
        }

        console.log('\n' + '='.repeat(50) + '\n');

        // Test 2: Create new budget request
        console.log('📝 Test 2: Create Budget Request');
        const newRequest = {
            community_id: '150ccc8c-31ec-4b7d-8f73-2ee7c5306fc0',
            budget_amount: 8500.75,
            purpose: 'Audio equipment and stage setup for Holi celebration with professional sound system',
            event_name: 'Holi Festival 2025',
            documents: [
                {
                    name: 'audio_quote.pdf',
                    url: '/uploads/quotes/audio_equipment.pdf',
                    type: 'application/pdf'
                },
                {
                    name: 'stage_setup_quote.pdf',
                    url: '/uploads/quotes/stage_setup.pdf',
                    type: 'application/pdf'
                }
            ]
        };

        const createResponse = await makeRequest('POST', '/budget-requests', newRequest);
        console.log('Status:', createResponse.status);
        console.log('Response:', JSON.stringify(createResponse.data, null, 2));

        if (createResponse.status === 201) {
            console.log('✅ CREATE request successful!');
            const requestId = createResponse.data.data.id;
            console.log('📋 Created Request ID:', requestId);

            // Test 3: Approve the request
            console.log('\n✅ Test 3: Approve Budget Request');
            const approvalData = {
                approved_by: 'finance_manager_123',
                approval_notes: 'Approved for Holi celebration. Please maintain proper receipts.',
                approved_amount: 8000.00
            };

            const approveResponse = await makeRequest('PUT', `/budget-requests/${requestId}/approve`, approvalData);
            console.log('Status:', approveResponse.status);
            console.log('Response:', JSON.stringify(approveResponse.data, null, 2));

            if (approveResponse.status === 200) {
                console.log('✅ APPROVE request successful!');
            } else {
                console.log('❌ APPROVE request failed');
            }

        } else {
            console.log('❌ CREATE request failed');
        }

        console.log('\n🎉 API tests completed!');
        console.log('\n📋 Next Steps:');
        console.log('1. Test the frontend Budget tab in Communities');
        console.log('2. Test the Budget Requests tab in Finance');
        console.log('3. Create, approve, and reject requests through the UI');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testBudgetAPI();