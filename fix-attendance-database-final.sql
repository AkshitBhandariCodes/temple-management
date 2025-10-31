-- FINAL FIX: Create Simple Attendance Table for Direct Volunteer-Shift Tracking
-- This replaces the complex shift assignment system with direct attendance tracking
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop existing attendance table and recreate with simple schema
DROP TABLE IF EXISTS public.volunteer_attendance CASCADE;

-- Step 2: Create simplified attendance table (no shift assignments needed)
CREATE TABLE public.volunteer_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL,
  shift_id uuid NOT NULL,
  status text DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  hours_worked numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteer_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT volunteer_attendance_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(id) ON DELETE CASCADE,
  CONSTRAINT volunteer_attendance_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.volunteer_shifts(id) ON DELETE CASCADE,
  CONSTRAINT volunteer_attendance_unique UNIQUE (volunteer_id, shift_id)
);

-- Step 3: Enable RLS with permissive policy
ALTER TABLE public.volunteer_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_attendance_operations" ON public.volunteer_attendance FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Create performance indexes
CREATE INDEX idx_attendance_volunteer_id ON public.volunteer_attendance(volunteer_id);
CREATE INDEX idx_attendance_shift_id ON public.volunteer_attendance(shift_id);
CREATE INDEX idx_attendance_status ON public.volunteer_attendance(status);
CREATE INDEX idx_attendance_date ON public.volunteer_attendance(check_in_time);

-- Step 5: Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.volunteer_attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Step 6: Verify table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'volunteer_attendance' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 7: Test with sample data
INSERT INTO public.volunteer_attendance (
  volunteer_id,
  shift_id,
  status,
  check_in_time,
  notes
) 
SELECT 
  v.id as volunteer_id,
  s.id as shift_id,
  'present' as status,
  now() as check_in_time,
  'Test attendance record' as notes
FROM public.volunteers v
CROSS JOIN public.volunteer_shifts s
LIMIT 2
ON CONFLICT (volunteer_id, shift_id) DO NOTHING;

-- Step 8: Verify the fix worked
SELECT 'Attendance table fixed successfully!' as message;
SELECT COUNT(*) as total_attendance_records FROM public.volunteer_attendance;
SELECT 
  va.status,
  COUNT(*) as count
FROM public.volunteer_attendance va
GROUP BY va.status;