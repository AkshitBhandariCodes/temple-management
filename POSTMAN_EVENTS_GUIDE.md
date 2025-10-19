# Postman Guide for Events API

## 🚀 Quick Setup

**Base URL:** `http://localhost:5000/api` **Test Community ID:**
`cb9d0802-1664-4a83-a0af-8a1444919d47`

## 📋 Postman Collection

### 1. Get All Events

```
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events
```

### 2. Create New Event

```
POST http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events
Content-Type: application/json

{
  "title": "Postman Test Event",
  "description": "Event created via Postman for testing",
  "start_date": "2025-12-15T14:00:00Z",
  "end_date": "2025-12-15T16:00:00Z",
  "location": "Postman Test Hall",
  "event_type": "meeting",
  "max_participants": 20
}
```

### 3. Get Single Event

```
GET http://localhost:5000/api/events/{event-id-from-step-2}
```

### 4. Update Event

```
PUT http://localhost:5000/api/events/{event-id-from-step-2}
Content-Type: application/json

{
  "title": "Updated Postman Event",
  "max_participants": 30,
  "location": "Updated Test Hall"
}
```

### 5. Register for Event

```
POST http://localhost:5000/api/events/{event-id-from-step-2}/register
Content-Type: application/json

{
  "user_id": "postman-user-123",
  "user_name": "Postman Tester",
  "user_email": "postman@test.com"
}
```

### 6. Get Event Statistics

```
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events/stats
```

### 7. Get Calendar View

```
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/calendar
```

### 8. Filter Events

```
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events?status=published
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events?type=meeting
GET http://localhost:5000/api/communities/cb9d0802-1664-4a83-a0af-8a1444919d47/events?limit=3
```

### 9. Delete Event

```
DELETE http://localhost:5000/api/events/{event-id-from-step-2}
```

## 🎯 Expected Responses

### Create Event Success

```json
{
	"success": true,
	"data": {
		"id": "new-event-uuid",
		"title": "Postman Test Event",
		"status": "published",
		"current_participants": 0
	},
	"message": "Event created successfully"
}
```

### Get Events Success

```json
{
	"success": true,
	"data": [
		{
			"id": "event-uuid",
			"title": "Event Title",
			"start_date": "2025-12-15T14:00:00Z",
			"location": "Event Location"
		}
	],
	"total": 6
}
```

### Statistics Success

```json
{
	"success": true,
	"data": {
		"total": 6,
		"upcoming": 6,
		"past": 0,
		"published": 6,
		"total_participants": 1
	}
}
```

## 🔧 Testing Workflow

1. **Start with GET** - Check existing events
2. **CREATE** - Add a new event and note the ID
3. **READ** - Get the single event by ID
4. **UPDATE** - Modify the event
5. **REGISTER** - Register a user for the event
6. **STATS** - Check updated statistics
7. **CALENDAR** - View in calendar format
8. **DELETE** - Clean up the test event

## ⚠️ Common Issues

### 400 Bad Request

- Check required fields: `title`, `start_date`, `end_date`
- Ensure `end_date` is after `start_date`
- Validate date format (ISO 8601)

### 404 Not Found

- Verify event ID exists
- Check community ID is correct

### 500 Server Error

- Check server is running on port 5000
- Verify database connection

## 🎉 Success Indicators

- ✅ Events created with unique IDs
- ✅ Statistics update after operations
- ✅ Calendar shows new events
- ✅ Registration increases participant count
- ✅ Filters work correctly
