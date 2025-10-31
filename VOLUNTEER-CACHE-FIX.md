# Volunteer Cache Invalidation Fix

## Problem

After creating volunteers through the AddVolunteerModal, they were not showing
up in the volunteers tab immediately. Users had to refresh the page to see newly
created volunteers.

## Root Cause

The issue was with React Query cache invalidation. The `useVolunteers` hook uses
a query key like `["volunteers", { limit: 1000 }]`, but the `useCreateVolunteer`
hook was only invalidating queries with the key `["volunteers"]`. This mismatch
meant that the specific query used by the VolunteersTab component was not being
invalidated.

## Solution

Updated all volunteer-related mutation hooks to use predicate-based invalidation
instead of exact key matching:

```typescript
// Before (didn't work)
queryClient.invalidateQueries({ queryKey: ["volunteers"] });

// After (works correctly)
queryClient.invalidateQueries({
	predicate: (query) => query.queryKey[0] === "volunteers",
});
```

## Files Modified

- `src/hooks/use-complete-api.tsx`
  - `useCreateVolunteer()` - Fixed cache invalidation
  - `useUpdateVolunteer()` - Fixed cache invalidation
  - `useReviewVolunteerApplication()` - Fixed cache invalidation
  - `useApproveVolunteerApplication()` - Fixed cache invalidation
  - `useCheckOutVolunteer()` - Fixed cache invalidation

## Testing

1. Create a volunteer through the AddVolunteerModal
2. Verify it appears immediately in the volunteers tab without page refresh
3. Verify all volunteer-related operations properly refresh the UI

## Technical Details

The predicate-based invalidation ensures that all queries starting with the
specified key (e.g., "volunteers") are invalidated, regardless of their
parameters. This is more robust than exact key matching when dealing with
parameterized queries.
