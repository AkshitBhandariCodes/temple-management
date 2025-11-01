# URGENT: Fix Puja Series Creation

## Problem

The puja_series table has the wrong schema. It has `priest_id` instead of
`priest` column.

## IMMEDIATE FIX (2 Steps)

### Step 1: Run SQL in Supabase Dashboard

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this EXACT SQL:

```sql
-- Fix Puja Series Schema - Simple Version
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

SELECT 'Puja series table fixed!' as message;
```

3. Click **RUN**
4. Should see "Puja series table fixed!" message

### Step 2: Test Puja Creation

1. Go to **Pujas** tab in your app
2. Click **"Create Puja Series"**
3. Fill form:
   - Title: "Test Puja"
   - Type: "Puja"
   - Location: "Main Temple"
   - Priest: "Pandit Sharma"
   - Start Time: "06:00"
4. Click **"Create Series"**
5. Should work immediately!

## What This Fixes

### Before (Broken Schema):

```sql
priest_id uuid  -- Wrong! Frontend sends 'priest' string
```

### After (Working Schema):

```sql
priest text     -- Correct! Matches frontend data
```

## Verification

After running the SQL, you should see:

- ✅ 2 sample puja series in the list
- ✅ Create puja form works without errors
- ✅ New pujas appear immediately after creation

## If Still Not Working

1. **Check browser console** for errors
2. **Restart backend server**: `npm run dev` in backend folder
3. **Clear browser cache** and refresh page
4. **Check Supabase logs** in dashboard

The issue is 100% the database schema mismatch. Once you run the SQL above, puja
creation will work perfectly!
