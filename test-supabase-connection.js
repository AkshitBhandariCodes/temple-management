// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');
  
  const SUPABASE_URL = 'https://ntxqedcyxsqdpauphunc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eHFlZGN5eHNxZHBhdXBodW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzA3MjQsImV4cCI6MjA3NTUwNjcyNH0.WmL5Ly6utECuTt2qTWbKqltLP73V3hYPLUeylBELKTk';
  
  try {
    // Test with anon key
    console.log('1️⃣ Testing with anon key...');
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    });
    
    // Try to query users table
    const { data, error } = await supabaseAnon
      .from('users')
      .select('id, email, full_name')
      .limit(1);
    
    if (error) {
      console.log('❌ Anon key error:', error.message);
      console.log('Error code:', error.code);
      
      if (error.code === '42P01') {
        console.log('💡 Table "users" does not exist');
      } else if (error.code === '42501') {
        console.log('💡 Permission denied - RLS policies blocking access');
      }
    } else {
      console.log('✅ Anon key works! Data:', data);
    }
    
    // Test table existence
    console.log('\n2️⃣ Testing table existence...');
    const { data: tables, error: tablesError } = await supabaseAnon
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%user%');
    
    if (tablesError) {
      console.log('❌ Tables query error:', tablesError.message);
    } else {
      console.log('📋 Tables with "user" in name:', tables?.map(t => t.table_name) || []);
    }
    
    console.log('\n📋 Recommendations:');
    console.log('1. Check if "users" table exists in Supabase dashboard');
    console.log('2. Verify RLS policies allow INSERT/SELECT operations');
    console.log('3. Get the complete service_role key from Supabase dashboard');
    console.log('4. Or temporarily disable RLS on users table for testing');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

// Run in backend directory to access node_modules
testSupabaseConnection().catch(console.error);