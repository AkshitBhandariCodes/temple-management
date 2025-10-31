# Volunteer Complete Data Solution

## Current Issue

The volunteer form collects many fields (date_of_birth, address,
emergency_contact, availability) but only saves basic fields to the database.

## Root Cause

1. **Database Schema Mismatch**: The volunteers table is missing several fields
   that the form collects
2. **Backend Limitation**: The API only processes basic fields
3. **Frontend Limitation**: The form only sends basic fields to the API

## Current Volunteers Table Schema

```sql
CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  status text DEFAULT 'active',
  total_hours_volunteered numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Missing Fields

- `date_of_birth` (date)
- `address` (jsonb object)
- `emergency_contact` (jsonb object)
- `availability` (jsonb object)

## Solution Steps

### Step 1: Update Database Schema

Run the SQL script `add-volunteer-fields.sql` in Supabase Dashboard:

```sql
-- Add missing fields to volunteers table
ALTER TABLE public.volunteers
ADD COLUMN IF NOT EXISTS date_of_birth date;

ALTER TABLE public.volunteers
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{}';

ALTER TABLE public.volunteers
ADD COLUMN IF NOT EXISTS emergency_contact jsonb DEFAULT '{}';

ALTER TABLE public.volunteers
ADD COLUMN IF NOT EXISTS availability jsonb DEFAULT '{}';
```

### Step 2: Update Backend API

After running the database migration, update the backend to handle all fields:

```javascript
// In backend/src/routes/volunteers-simple.js
const volunteerData = {
	community_id: community_id || null,
	first_name,
	last_name,
	email,
	phone: phone || "",
	date_of_birth: date_of_birth || null,
	address: address || {},
	emergency_contact: emergency_contact || {},
	skills: Array.isArray(skills) ? skills : [],
	interests: Array.isArray(interests) ? interests : [],
	availability: availability || {},
	notes: notes || "",
	status: "active",
	total_hours_volunteered: 0,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};
```

### Step 3: Update Frontend Form

After backend is updated, update the frontend to send all fields:

```javascript
// In src/components/volunteers/AddVolunteerModal.tsx
const volunteerData = {
	first_name: formData.first_name,
	last_name: formData.last_name,
	email: formData.email,
	phone: formData.phone,
	date_of_birth: formData.date_of_birth,
	community_id: formData.community_id,
	address: formData.address,
	emergency_contact: formData.emergency_contact,
	skills: formData.skills,
	interests: formData.interests,
	availability: formData.availability,
	notes: formData.notes,
};
```

### Step 4: Update Application Approval Process

Ensure approved applications create complete volunteer records with all
available data.

## Volunteer Application → Volunteer Flow

### Current Process:

1. User submits volunteer application
2. Admin reviews application in Applications tab
3. Admin approves application
4. System creates volunteer record in volunteers table
5. Volunteer appears in Volunteers tab

### Issue:

The approval process only transfers basic fields from application to volunteer
record.

### Solution:

Update the approval process to transfer all available fields:

```javascript
// In application approval route
const volunteerData = {
	community_id: application.community_id,
	first_name: application.first_name,
	last_name: application.last_name,
	email: application.email,
	phone: application.phone,
	date_of_birth: application.date_of_birth || null,
	address: application.address || {},
	emergency_contact: application.emergency_contact || {},
	skills: application.skills,
	interests: application.interests,
	availability: application.availability || {},
	status: "active",
	total_hours_volunteered: 0,
	notes: `Approved from application: ${application.motivation}`,
};
```

## Implementation Order

1. ✅ **Run database migration** (add-volunteer-fields.sql)
2. ✅ **Update backend API** to handle new fields
3. ✅ **Update frontend form** to send new fields
4. ✅ **Update application approval** to transfer all fields
5. ✅ **Test complete workflow**

## Testing Checklist

- [ ] Database migration successful
- [ ] Direct volunteer creation saves all fields
- [ ] Frontend form submission saves all fields
- [ ] Application approval creates complete volunteer record
- [ ] Volunteers tab displays all volunteer data
- [ ] All fields are properly validated

## Expected Result

After implementation:

- ✅ All form fields will be saved to database
- ✅ Approved applications will create complete volunteer records
- ✅ Volunteers tab will show comprehensive volunteer information
- ✅ No data loss during volunteer creation process
