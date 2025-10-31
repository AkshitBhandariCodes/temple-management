-- Create Simple Attendance Table (without shift assignments)
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing attendance table if it exists
DROP TABLE IF EXISTS public.volunteer_attendance CASCADE;

-- Create simplified attendance table
CREATE TABLE public.volunteer_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL,
  shift_id uuid NOT NULL,
  status text DEFAULT 'present',
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

-- Enable RLS
ALTER TABLE public.volunteer_attendance ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policy
CREATE POLICY "allow_all_attendance_operations" ON public.volunteer_attendance FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_attendance_volunteer_id ON public.volunteer_attendance(volunteer_id);
CREATE INDEX idx_attendance_shift_id ON public.volunteer_attendance(shift_id);
CREATE INDEX idx_attendance_status ON public.volunteer_attendance(status);

-- Insert some sample attendance records
INSERT INTO public.volunteer_attendance (
  volunteer_id,
  shift_id,
  status,
  check_in_time,
  check_out_time,
  notes
) 
SELECT 
  v.id as volunteer_id,
  s.id as shift_id,
  'present' as status,
  (s.shift_date || ' ' || s.start_time)::timestamp as check_in_time,
  (s.shift_date || ' ' || s.end_time)::timestamp as check_out_time,
  'Sample attendance record' as notes
FROM public.volunteers v
CROSS JOIN public.volunteer_shifts s
LIMIT 5;

-- Verify table creation
SELECT 'Simple attendance table created successfully!' as message;
SELECT COUNT(*) as attendance_count FROM public.volunteer_attendance;