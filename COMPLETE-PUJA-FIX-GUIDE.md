# Complete Puja Series Fix Guide

## Current Issue

Puja series creation fails because the database table has wrong schema (has
`priest_id` instead of `priest`).

## STEP-BY-STEP FIX

### Step 1: Fix Database Schema

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste this SQL** (from `fix-puja-schema-simple.sql`):

```sql
DROP TABLE IF EXISTS public.puja_series CASCADE;

CREATE TABLE public.puja_series (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text DEFAULT 'puja',
  location text,
  priest text,
  start_time text,
  duration_minutes integer DEFAULT 60,
  recurrence_type text DEFAULT 'none',
  start_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puja_series_pkey PRIMARY KEY (id)
);

ALTER TABLE public.puja_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_puja_series" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.puja_series (name, description, type, location, priest, start_time, duration_minutes, recurrence_type) VALUES
('Morning Aarti', 'Daily morning prayers', 'aarti', 'Main Temple', 'Pandit Sharma', '06:00', 45, 'daily'),
('Evening Aarti', 'Daily evening prayers', 'aarti', 'Main Temple', 'Pandit Kumar', '18:00', 30, 'daily');
```

4. **Click RUN**
5. **Should see success message**

### Step 2: Verify Backend Connection

1. **Open browser**
2. **Go to**: `http://localhost:5000/api/pujas/test-schema`
3. **Should see**:

```json
{
  "success": true,
  "schema_status": "Table exists and accessible",
  "columns": ["id", "name", "description", "type", "location", "priest", "start_time", ...]
}
```

### Step 3: Test Puja Creation

1. **Go to Pujas tab**
2. **Click "Create Puja Series"**
3. **Fill form**:
   - Title: "Test Puja"
   - Type: "Puja"
   - Location: "Main Temple"
   - Priest: "Pandit Sharma"
   - Start Time: "06:00"
4. **Click "Create Series"**
5. **Should work without errors!**

## What Each Step Does

### Database Schema Fix

- ✅ Drops old table with wrong columns
- ✅ Creates new table with correct `priest` column
- ✅ Sets up proper permissions (RLS)
- ✅ Adds sample data for testing

### Backend Improvements

- ✅ Better error logging
- ✅ Schema validation endpoint
- ✅ Proper error responses

### Frontend Data Flow

- ✅ Form sends: `{ name, priest, location, ... }`
- ✅ Backend receives and stores directly
- ✅ No validation conflicts
- ✅ Immediate UI refresh

## Troubleshooting

### If Step 2 Fails (Backend Test):

- Check if backend is running: `npm run dev` in backend folder
- Check console for errors
- Verify .env file has correct Supabase credentials

### If Step 3 Fails (Frontend):

- Check browser console for errors
- Check Network tab for API call failures
- Verify backend test (Step 2) passed first

### If Still Not Working:

1. **Restart backend server**
2. **Clear browser cache**
3. **Check Supabase dashboard for table structure**
4. **Run the test endpoint again**

## Expected Results

After completing all steps:

- ✅ Puja list shows 2 sample pujas
- ✅ Create form works without validation errors
- ✅ New pujas appear immediately in list
- ✅ Edit/delete operations work
- ✅ No console errors

The fix addresses the core schema mismatch that was preventing puja creation!
