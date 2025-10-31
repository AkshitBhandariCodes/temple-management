# Fix: Volunteer Attendance Status Constraint Issue

## Problem

The volunteer attendance system is failing because there's a mismatch between
the database schema and the backend code:

- **Database Schema**: Only allows status values:
  `'present', 'absent', 'late', 'excused'`
- **Backend Code**: Tries to use `'completed'` status in checkout route and
  `'scheduled'` status in assignments

## Root Cause

In `backend/src/routes/volunteers-simple.js` line 652, the checkout route sets:

```javascript
status: "completed";
```

But the database constraint in `fix-attendance-database-final.sql` only allows:

```sql
CHECK (status IN ('present', 'absent', 'late', 'excused'))
```

## Solution

### Step 1: Update Database Constraint

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Fix volunteer attendance status constraint
ALTER TABLE public.volunteer_attendance DROP CONSTRAINT IF EXISTS volunteer_attendance_status_check;
ALTER TABLE public.volunteer_attendance
ADD CONSTRAINT volunteer_attendance_status_check
CHECK (status IN ('scheduled', 'present', 'absent', 'late', 'excused', 'completed'));
```

### Step 2: Verify the Fix

After running the SQL, the volunteer attendance system will support all these
status values:

- ✅ `scheduled` - Volunteer is assigned to the shift (initial state)
- ✅ `present` - Volunteer is present and checked in
- ✅ `absent` - Volunteer didn't show up
- ✅ `late` - Volunteer arrived late
- ✅ `excused` - Volunteer had an excused absence
- ✅ `completed` - Volunteer completed their shift and checked out

## Files Affected

- `fix-attendance-database-final.sql` - Original schema with limited status
  values
- `backend/src/routes/volunteers-simple.js` - Backend routes using 'completed'
  status
- `fix-volunteer-attendance-status.sql` - New fix for the constraint

## Testing

After applying the fix, test these endpoints:

1. `POST /api/volunteers/attendance/checkin` - Should work with status 'present'
2. `PUT /api/volunteers/attendance/:id/checkout` - Should work with status
   'completed'
3. `PUT /api/volunteers/attendance/:id` - Should work with any valid status

## Status Values Usage

- **Assignment**: Uses `'scheduled'` status (when volunteers are assigned to
  shifts)
- **Check-in**: Uses `'present'` status
- **Check-out**: Uses `'completed'` status
- **Manual marking**: Can use any of the 6 allowed values

The fix ensures the database constraint matches what the backend code expects to
use.
