// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntxqedcyxsqdpauphunc.supabase.co'; // Replace with your actual url
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eHFlZGN5eHNxZHBhdXBodW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzA3MjQsImV4cCI6MjA3NTUwNjcyNH0.WmL5Ly6utECuTt2qTWbKqltLP73V3hYPLUeylBELKTk'; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
