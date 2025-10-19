-- Add role field to users table for admin functionality
-- Run this in your Supabase SQL Editor

-- 1. Create role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('user', 'board', 'chairman', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
END $$;

-- 2. Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role user_role_type DEFAULT 'user';

-- 3. Add password_hash column for local authentication
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash text;

-- 4. Update existing users to have default role
UPDATE public.users 
SET role = 'user' 
WHERE role IS NULL;

-- 5. Create index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 6. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name IN ('role', 'password_hash')
ORDER BY column_name;

-- 7. Show sample of updated table structure
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  CASE 
    WHEN password_hash IS NOT NULL THEN 'HAS_PASSWORD' 
    ELSE 'NO_PASSWORD' 
  END as password_status,
  status,
  created_at
FROM public.users 
LIMIT 5;