// Debug puja validation issues
console.log('🔍 Debugging Puja Validation Issues...');

console.log('\n❌ Current Issue:');
console.log('HTTP 400 - Validation errors when creating puja series');

console.log('\n🔧 Fixes Applied:');
console.log('1. Simplified payload to only required fields');
console.log('2. Removed community_id validation (not needed)');
console.log('3. Added proper null/undefined checks for optional fields');
console.log('4. Enhanced backend error logging');

console.log('\n📋 Current Required Fields:');
console.log('- name: string (1-200 chars) ✅');
console.log('- type: enum [aarti, havan, puja, special_ceremony, festival, other] ✅');
console.log('- start_date: ISO8601 date string ✅');
console.log('- schedule_config: object ✅');

console.log('\n🎯 Debug Process:');
console.log('1. Open browser dev tools');
console.log('2. Go to Pujas → Create Puja Series');
console.log('3. Fill form with:');
console.log('   - Title: "Test Puja"');
console.log('   - Type: "Puja"');
console.log('   - Location: "Main Temple"');
console.log('   - Priest: "Pandit Sharma"');
console.log('   - Start Time: "06:00"');
console.log('4. Click Create Series');
console.log('5. Check console for:');
console.log('   - "🚀 Sending puja series data to API:"');
console.log('   - Backend logs for "❌ Validation errors:"');

console.log('\n📊 Expected Minimal Payload:');
const expectedPayload = {
    name: "Test Puja",
    type: "puja",
    start_date: "2024-01-01",
    schedule_config: {
        start_time: "06:00",
        location: "Main Temple",
        priest: "Pandit Sharma",
        recurrence_type: "none"
    }
};
console.log(JSON.stringify(expectedPayload, null, 2));