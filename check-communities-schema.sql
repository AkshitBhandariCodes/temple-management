-- Check the current communities table schema
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Check what columns exist in communities table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'communities'
ORDER BY ordinal_position;

-- 2. Show sample data
SELECT * FROM public.communities LIMIT 3;