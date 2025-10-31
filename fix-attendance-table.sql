-- Fix Volunteer Attendance Table to make shift_assignment_id optional
-- Run this in Supabase Dashboard → SQL Editor

-- Drop the NOT NULL constraint on shift_assignment_id
ALTER TABLE public.volunteer_attendance 
ALTER COLUMN shift_assignment_id DROP NOT NULL;

-- Update the status default to 'present' instead of 'scheduled'
ALTER TABLE public.volunteer_attendance 
ALTER COLUMN status SET DEFAULT 'present';

-- Verify the changes
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'volunteer_attendance' 
AND table_schema = 'public'
ORDER BY ordinal_position;