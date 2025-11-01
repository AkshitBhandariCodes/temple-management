# INSTANT FIX - Do These 3 Steps NOW

## The Problem Found

The global error handler in `server.js` was converting database errors to
generic "Validation Error" messages.

## STEP 1: Restart Backend (CRITICAL)

1. **Stop backend** (Ctrl+C in terminal)
2. **Start backend** (`npm run dev` in backend folder)
3. **Look for**: "✅ Ultra-simple puja routes loaded successfully"

## STEP 2: Try Creating Puja Again

1. **Go to Pujas tab**
2. **Click "Create Puja Series"**
3. **Fill form and submit**
4. **Check browser console** - you should now see DETAILED error messages
   instead of "Validation Error"

## STEP 3: Based on the Real Error Message

### If you see "relation does not exist" or "table not found":

**Run this SQL in Supabase Dashboard:**

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
CREATE POLICY "allow_all" ON public.puja_series FOR ALL USING (true) WITH CHECK (true);
```

### If you see "column does not exist":

The table exists but has wrong columns - run the SQL above to recreate it.

### If you see "permission denied":

RLS is blocking - the SQL above includes the fix.

## Expected Results

After restarting backend, you should see:

- ✅ **Detailed error messages** instead of "Validation Error"
- ✅ **Exact database error** with hints and suggestions
- ✅ **Clear indication** of what's wrong (table missing, column mismatch, etc.)

## What Was Fixed

### Before:

```
❌ Generic "Validation Error" message
❌ No details about what's wrong
❌ Impossible to debug
```

### After:

```
✅ "Database Error (42P01): relation 'puja_series' does not exist"
✅ Detailed error with code, hint, and suggestion
✅ Clear path to fix the issue
```

The real error will now be visible and fixable!
