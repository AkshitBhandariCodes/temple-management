# Fix: Volunteer Assignment Count Not Updating

## Problem

After assigning volunteers to shifts, the UI still shows "0/1 volunteers"
instead of updating to show the correct assigned count.

## Root Causes

1. **Database Constraint**: Status "scheduled" not allowed (prevents assignment
   creation)
2. **Query Cache**: Frontend cache not refreshing after assignments
3. **Data Flow**: Attendance records not being fetched properly

## Complete Solution

### Step 1: Fix Database Constraint

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Fix volunteer attendance status constraint
ALTER TABLE public.volunteer_attendance DROP CONSTRAINT IF EXISTS volunteer_attendance_status_check;
ALTER TABLE public.volunteer_attendance
ADD CONSTRAINT volunteer_attendance_status_check
CHECK (status IN ('scheduled', 'present', 'absent', 'late', 'excused', 'completed'));

-- Verify the fix
SELECT 'Volunteer attendance constraint updated!' as message;
```

### Step 2: Test the Assignment Flow

1. **Open Browser Developer Tools** (F12)
2. **Go to Console tab** to see debug logs
3. **Go to Volunteers → Shifts tab**
4. **Click "Assign" on any shift**
5. **Select volunteers and click "Assign"**
6. **Watch console logs** for:
   - "🎯 Assigning X volunteers to shift..."
   - "✅ Created attendance record:"
   - "🔄 Invalidating queries to refresh UI..."
   - "📊 ShiftsTab - Attendance data updated:"

### Step 3: Verify Data Flow

After assignment, check:

1. **Network Tab**: Look for successful POST to `/api/volunteers/attendance`
2. **Network Tab**: Look for GET request to `/api/volunteers/attendance`
3. **Console**: Check attendance records count in debug logs
4. **UI**: Count should update from "0/1" to "1/1" (or appropriate numbers)

## Debug Information

The system now logs detailed information:

- Assignment process success/failure
- Query invalidation and refetch
- Attendance data updates
- Record counts and filtering

## If Still Not Working

1. **Check Console Errors**: Look for JavaScript errors
2. **Check Network Errors**: Look for failed API calls
3. **Refresh Page**: Sometimes cache needs manual refresh
4. **Check Database**: Verify attendance records were created:
   ```sql
   SELECT * FROM public.volunteer_attendance ORDER BY created_at DESC LIMIT 10;
   ```

## Expected Behavior

After the fix:

- Assign volunteers → Records created with "scheduled" status
- UI immediately updates → Shows "X/Y assigned"
- Check-in works → Status changes to "present"
- Check-out works → Status changes to "completed"

## Files Modified

- `src/components/volunteers/AssignVolunteerModal.tsx` - Better query
  invalidation
- `src/components/volunteers/ShiftsTab.tsx` - Added debug logging
- `fix-volunteer-assignment-display.sql` - Database constraint fix
