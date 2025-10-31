-- Add missing fields to volunteers table
-- Run this in Supabase Dashboard → SQL Editor

-- Add date_of_birth field
ALTER TABLE public.volunteers 
ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Add address field (JSON object)
ALTER TABLE public.volunteers 
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{}';

-- Add emergency_contact field (JSON object)
ALTER TABLE public.volunteers 
ADD COLUMN IF NOT EXISTS emergency_contact jsonb DEFAULT '{}';

-- Add availability field (JSON object)
ALTER TABLE public.volunteers 
ADD COLUMN IF NOT EXISTS availability jsonb DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteers_date_of_birth ON public.volunteers(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_volunteers_address ON public.volunteers USING GIN (address);
CREATE INDEX IF NOT EXISTS idx_volunteers_emergency_contact ON public.volunteers USING GIN (emergency_contact);
CREATE INDEX IF NOT EXISTS idx_volunteers_availability ON public.volunteers USING GIN (availability);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'volunteers'
ORDER BY ordinal_position;

SELECT 'Volunteer table fields updated successfully! 🎉' as message;