-- Fix volunteer attendance status constraint to include 'completed'
-- This adds 'completed' to the allowed status values for volunteer_attendance table

-- Step 1: Drop the existing check constraint
ALTER TABLE public.volunteer_attendance DROP CONSTRAINT IF EXISTS volunteer_attendance_status_check;

-- Step 2: Add the new check constraint with 'completed' and 'scheduled' included
ALTER TABLE public.volunteer_attendance 
ADD CONSTRAINT volunteer_attendance_status_check 
CHECK (status IN ('scheduled', 'present', 'absent', 'late', 'excused', 'completed'));

-- Step 3: Verify the constraint was updated
SELECT 
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.volunteer_attendance'::regclass 
AND contype = 'c';

-- Step 4: Test that all status values work
SELECT 'Status constraint updated successfully!' as message;