# Events Management API Documentation

## 🎉 Complete Events System

A fully functional events management system with CRUD operations, registration,
statistics, and calendar integration.

## ✅ Features

- ✅ **Create Events** - Add new events to communities
- ✅ **Read Events** - Get events with filtering and pagination
- ✅ **Update Events** - Modify event details
- ✅ **Delete Events** - Remove events
- ✅ **Event Registration** - Users can register for events
- ✅ **Event Statistics** - Analytics and metrics
- ✅ **Calendar Integration** - Events display in calendar format
- ✅ **Filtering** - Filter by status, type, date range

## 📡 API Endpoints

### Get Events for Community

```http
GET /api/communities/{communityId}/events
GET /api/communities/{communityId}/events?status=published
GET /api/communities/{communityId}/events?type=meeting
GET /api/communities/{communityId}/events?startDate=2025-10-01&endDate=2025-10-31
GET /api/communities/{communityId}/events?limit=10
```

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "event-uuid",
			"community_id": "community-uuid",
			"title": "Morning Prayer Session",
			"description": "Daily morning prayer and meditation",
			"start_date": "2025-10-20T06:00:00Z",
			"end_date": "2025-10-20T07:00:00Z",
			"location": "Main Temple Hall",
			"event_type": "meeting",
			"status": "published",
			"max_participants": 50,
			"current_participants": 0,
			"organizer_id": null,
			"created_at": "2025-10-19T...",
			"updated_at": "2025-10-19T..."
		}
	],
	"total": 5
}
```

### Get Single Event

```http
GET /api/events/{eventId}
```

### Create New Event

```http
POST /api/communities/{communityId}/events
Content-Type: application/json

{
  "title": "New Community Event",
  "description": "Event description",
  "start_date": "2025-12-01T10:00:00Z",
  "end_date": "2025-12-01T12:00:00Z",
  "location": "Event Location",
  "event_type": "meeting",
  "max_participants": 25,
  "organizer_id": null
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "new-event-uuid",
    "community_id": "community-uuid",
    "title": "New Community Event",
    "status": "published",
    "current_participants": 0,
    ...
  },
  "message": "Event created successfully"
}
```

### Update Event

```http
PUT /api/events/{eventId}
Content-Type: application/json

{
  "title": "Updated Event Title",
  "description": "Updated description",
  "max_participants": 30,
  "location": "New Location"
}
```

### Delete Event

```http
DELETE /api/events/{eventId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "deleted-event-uuid",
    ...
  },
  "message": "Event deleted successfully"
}
```

### Register for Event

```http
POST /api/events/{eventId}/register
Content-Type: application/json

{
  "user_id": "user-uuid",
  "user_name": "User Name",
  "user_email": "user@example.com"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Successfully registered for event",
	"data": {
		"event_id": "event-uuid",
		"user_id": "user-uuid",
		"registered_at": "2025-10-19T..."
	}
}
```

### Get Event Statistics

```http
GET /api/communities/{communityId}/events/stats
```

**Response:**

```json
{
	"success": true,
	"data": {
		"total": 6,
		"upcoming": 6,
		"past": 0,
		"published": 6,
		"draft": 0,
		"cancelled": 0,
		"total_participants": 1,
		"average_attendance": 0
	}
}
```

### Calendar Integration

```http
GET /api/communities/{communityId}/calendar
GET /api/communities/{communityId}/calendar?month=10&year=2025
```

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "event-uuid",
			"title": "Morning Prayer Session",
			"start": "2025-10-20T06:00:00Z",
			"end": "2025-10-20T07:00:00Z",
			"description": "Daily morning prayer and meditation",
			"location": "Main Temple Hall",
			"type": "meeting",
			"status": "published",
			"attendees_count": 50,
			"color": "#6B7280"
		}
	]
}
```

## 🎯 Event Types

- `meeting` - General meetings
- `worship` - Religious ceremonies
- `festival` - Festival celebrations
- `education` - Educational sessions
- `volunteer` - Volunteer activities
- `community` - Community gatherings

## 📊 Event Status

- `published` - Active and visible
- `draft` - Not yet published
- `cancelled` - Cancelled event

## 🧪 Testing

### Test Community ID

```
cb9d0802-1664-4a83-a0af-8a1444919d47
```

### Sample Event Data

```json
{
	"title": "Test Event",
	"description": "This is a test event",
	"start_date": "2025-12-01T10:00:00Z",
	"end_date": "2025-12-01T12:00:00Z",
	"location": "Test Location",
	"event_type": "meeting",
	"max_participants": 25
}
```

### Available Test Script

```bash
node test-events-system.cjs
```

## 🔧 Validation Rules

### Required Fields (Create)

- `title` (1-200 characters)
- `start_date` (ISO 8601 format)
- `end_date` (ISO 8601 format, must be after start_date)

### Optional Fields

- `description` (max 1000 characters)
- `location`
- `event_type` (default: "meeting")
- `max_participants` (default: 50)
- `organizer_id`

### Filters Available

- `status` - Filter by event status
- `type` - Filter by event type
- `startDate` - Events starting after this date
- `endDate` - Events starting before this date
- `limit` - Maximum number of results (default: 50)

## 🎯 Frontend Integration

### Events Management Dashboard

Use these endpoints for:

- Event creation forms
- Event listing with filters
- Event editing interface
- Event deletion confirmation
- Registration management

### Calendar Component

The calendar endpoint provides:

- Events in calendar-friendly format
- Color coding by event type
- Date filtering for month/year views
- Event details for tooltips

### Statistics Dashboard

Event stats endpoint provides:

- Total events count
- Upcoming vs past events
- Participation metrics
- Status breakdown

## 🚀 Current Status

**✅ Fully Functional:**

- Complete CRUD operations
- Event registration system
- Statistics and analytics
- Calendar integration
- Filtering and search
- Database persistence

**📊 Test Results:**

- 6 events created and managed
- Registration system working
- Statistics accurately calculated
- Calendar integration successful
- All CRUD operations tested

The events system is production-ready and fully integrated with the community
management platform!
