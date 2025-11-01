// Test minimal puja creation payload
console.log('🧪 Testing minimal puja creation...');

const minimalPayload = {
    name: "Test Puja",
    type: "puja",
    start_date: "2024-01-01",
    schedule_config: {
        start_time: "06:00",
        location: "Main Temple"
    }
};

console.log('\n📋 Minimal Valid Payload:');
console.log(JSON.stringify(minimalPayload, null, 2));

console.log('\n✅ Required Fields (per backend validation):');
console.log('- name: string (1-200 chars)');
console.log('- type: one of [aarti, havan, puja, special_ceremony, festival, other]');
console.log('- start_date: ISO8601 date string');
console.log('- schedule_config: object (any structure)');

console.log('\n🔍 Optional Fields:');
console.log('- community_id: UUID (optional)');
console.log('- description: string (max 1000 chars)');
console.log('- duration_minutes: integer (15-480)');
console.log('- max_participants: positive integer');
console.log('- registration_required: boolean');

console.log('\n🎯 Debug Steps:');
console.log('1. Check browser console for "🚀 Sending puja series data to API:"');
console.log('2. Check backend logs for "❌ Validation errors:"');
console.log('3. Compare actual payload with required fields');
console.log('4. Fix any missing or invalid fields');