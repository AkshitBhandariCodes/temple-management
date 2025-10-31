# Volunteer Database Information

## Database Table

**Table Name:** `public.volunteers` **Database:** Supabase PostgreSQL
**Location:** Supabase Cloud Database

## Table Schema

```sql
CREATE TABLE public.volunteers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  community_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  status text DEFAULT 'active',
  total_hours_volunteered numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteers_pkey PRIMARY KEY (id),
  CONSTRAINT volunteers_email_unique UNIQUE (email)
);
```

## Field Descriptions

- **id**: Unique identifier (UUID, auto-generated)
- **community_id**: Reference to the community (UUID, optional)
- **first_name**: Volunteer's first name (required)
- **last_name**: Volunteer's last name (required)
- **email**: Volunteer's email address (required, unique)
- **phone**: Phone number (optional)
- **skills**: Array of skills (e.g., ["Teaching", "Event Management"])
- **interests**: Array of interests (e.g., ["Youth Programs", "Cultural
  Events"])
- **status**: Current status (default: "active")
- **total_hours_volunteered**: Hours contributed (default: 0)
- **notes**: Additional notes about the volunteer
- **created_at**: When the record was created
- **updated_at**: When the record was last modified

## Data Flow

1. **Frontend Form** → User fills out AddVolunteerModal
2. **API Call** → POST request to `/api/volunteers`
3. **Backend Route** → `backend/src/routes/volunteers-simple.js`
4. **Database Insert** → Supabase client inserts into `volunteers` table
5. **Response** → Returns created volunteer data

## Backend Code Location

```javascript
// File: backend/src/routes/volunteers-simple.js
const { data, error } = await supabaseService.client
	.from("volunteers") // ← This is the table name
	.insert(volunteerData)
	.select("*")
	.single();
```

## How to View Data

1. **Supabase Dashboard**: Log into Supabase → Table Editor → volunteers
2. **API Endpoint**: GET `http://localhost:5000/api/volunteers`
3. **Frontend**: Navigate to Volunteers page → Volunteers tab

## Related Tables

- `volunteer_applications` - For volunteer applications before approval
- `volunteer_shifts` - For volunteer shift scheduling
- `volunteer_attendance` - For tracking volunteer attendance
- `shift_assignments` - For assigning volunteers to shifts

## Current Data Status

✅ Table exists and is functional ✅ Data is being inserted successfully ✅
Recent volunteers are visible in the system ✅ All constraints and indexes are
working properly
