# Community Applications API

A complete system for managing community membership applications with
approval/rejection workflow.

## Features

- ✅ Submit applications to join communities
- ✅ View all applications for a community
- ✅ Filter applications by status (pending, approved, rejected)
- ✅ Approve applications (automatically adds user to community if user_id
  exists)
- ✅ Reject applications
- ✅ Prevent duplicate applications (if user_id provided)
- ✅ Stored in Supabase with proper RLS policies

## API Endpoints

### Submit Application

```
POST /api/communities/{communityId}/apply
```

**Body:**

```json
{
	"user_id": "uuid-or-null",
	"email": "user@example.com",
	"name": "Full Name",
	"phone": "+1234567890",
	"message": "Why I want to join",
	"why_join": "Motivation",
	"skills": ["skill1", "skill2"],
	"experience": "Previous experience"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "application-uuid",
    "community_id": "community-uuid",
    "status": "pending",
    "applied_at": "2025-10-19T08:27:03.273139+00:00",
    ...
  }
}
```

### Get Applications for Community

```
GET /api/communities/{communityId}/applications
GET /api/communities/{communityId}/applications?status=pending
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "application-uuid",
      "name": "Applicant Name",
      "email": "applicant@example.com",
      "status": "pending",
      "applied_at": "2025-10-19T08:27:03.273139+00:00",
      ...
    }
  ],
  "total": 5
}
```

### Get Single Application

```
GET /api/applications/{applicationId}
```

### Approve Application

```
POST /api/applications/{applicationId}/approve
```

**Body:**

```json
{
	"reviewed_by": "reviewer-uuid-or-null"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Application approved (user will be added when they register)"
}
```

### Reject Application

```
POST /api/applications/{applicationId}/reject
```

**Body:**

```json
{
	"reviewed_by": "reviewer-uuid-or-null"
}
```

## Database Schema

The `community_applications` table includes:

- `id` - UUID primary key
- `community_id` - References communities table
- `user_id` - UUID (nullable, for registered users)
- `name` - Applicant's full name
- `email` - Applicant's email
- `phone` - Phone number (optional)
- `message` - Application message
- `why_join` - Why they want to join
- `skills` - Array of skills
- `experience` - Previous experience
- `status` - pending/approved/rejected
- `reviewed_by` - Who reviewed the application
- `reviewed_at` - When it was reviewed
- `applied_at` - When application was submitted

## Usage Flow

1. **User submits application** → POST to `/api/communities/{id}/apply`
2. **Community admin views applications** → GET
   `/api/communities/{id}/applications?status=pending`
3. **Admin approves/rejects** → POST to `/api/applications/{id}/approve` or
   `/reject`
4. **If approved and user_id exists** → User automatically added to community
   members
5. **If approved but no user_id** → User will be added when they register

## Testing

Run the test script:

```bash
node test-applications.cjs
```

This tests all endpoints including submission, retrieval, approval, and
rejection workflows.
