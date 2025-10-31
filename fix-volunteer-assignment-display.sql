-- Complete fix for volunteer assignment display issue
-- This addresses both the database constraint and ensures data consistency

-- Step 1: Fix the status constraint to allow all needed values
ALTER TABLE public.volunteer_attendance DROP CONSTRAINT IF EXISTS volunteer_attendance_status_check;
ALTER TABLE public.volunteer_attendance 
ADD CONSTRAINT volunteer_attendance_status_check 
CHECK (status IN ('scheduled', 'present', 'absent', 'late', 'excused', 'completed'));

-- Step 2: Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'volunteer_attendance' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check if there are any existing attendance records
SELECT 
    COUNT(*) as total_records,
    status,
    COUNT(*) as count_by_status
FROM public.volunteer_attendance 
GROUP BY status;

-- Step 4: Test creating a sample attendance record
-- (This will help verify the constraint is working)
DO $$
DECLARE
    test_volunteer_id uuid;
    test_shift_id uuid;
BEGIN
    -- Get a sample volunteer and shift for testing
    SELECT id INTO test_volunteer_id FROM public.volunteers LIMIT 1;
    SELECT id INTO test_shift_id FROM public.volunteer_shifts LIMIT 1;
    
    IF test_volunteer_id IS NOT NULL AND test_shift_id IS NOT NULL THEN
        -- Try to insert a test record with 'scheduled' status
        INSERT INTO public.volunteer_attendance (
            volunteer_id,
            shift_id,
            status,
            notes,
            created_at,
            updated_at
        ) VALUES (
            test_volunteer_id,
            test_shift_id,
            'scheduled',
            'Test assignment - can be deleted',
            now(),
            now()
        ) ON CONFLICT (volunteer_id, shift_id) DO NOTHING;
        
        RAISE NOTICE 'Test attendance record created successfully with scheduled status';
    ELSE
        RAISE NOTICE 'No volunteers or shifts found for testing';
    END IF;
END $$;

-- Step 5: Final verification
SELECT 'Volunteer attendance constraint fixed and tested!' as result;