# 📮 Volunteer Applications - Postman API Guide

## 🚀 **Base URL**

```
http://localhost:5000/api/volunteers/applications
```

## 📋 **Available Endpoints**

### 1. **Submit New Volunteer Application**

**POST** `/api/volunteers/applications`

#### **Request Body (JSON):**

```json
{
	"community_id": "e7a46ae6-b4b0-4d71-93af-e1c0cda45cba",
	"first_name": "John",
	"last_name": "Doe",
	"email": "john.doe@email.com",
	"phone": "+91 98765 43210",
	"skills": ["Teaching", "Public Speaking", "Event Management"],
	"interests": ["Youth Programs", "Education", "Community Service"],
	"motivation": "I want to contribute to the community and help preserve our cultural values.",
	"experience": "5 years of volunteer experience with local NGOs"
}
```

#### **Required Fields:**

- `first_name` (string)
- `email` (string)
- `phone` (string)

#### **Optional Fields:**

- `community_id` (UUID string)
- `last_name` (string)
- `skills` (array of strings)
- `interests` (array of strings)
- `motivation` (string)
- `experience` (string)
- `user_id` (UUID string)

#### **Response (201 Created):**

```json
{
	"success": true,
	"data": {
		"id": "uuid-here",
		"community_id": "e7a46ae6-b4b0-4d71-93af-e1c0cda45cba",
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@email.com",
		"phone": "+91 98765 43210",
		"skills": ["Teaching", "Public Speaking", "Event Management"],
		"interests": ["Youth Programs", "Education", "Community Service"],
		"motivation": "I want to contribute to the community and help preserve our cultural values.",
		"experience": "5 years of volunteer experience with local NGOs",
		"status": "pending",
		"applied_at": "2025-10-29T16:30:00.000Z",
		"created_at": "2025-10-29T16:30:00.000Z",
		"updated_at": "2025-10-29T16:30:00.000Z"
	},
	"message": "Volunteer application submitted successfully"
}
```

---

### 2. **Get All Applications**

**GET** `/api/volunteers/applications`

#### **Query Parameters (Optional):**

- `status` - Filter by status (pending, under-review, approved, rejected)
- `community_id` - Filter by community
- `limit` - Number of results (default: 50)
- `page` - Page number (default: 1)

#### **Example URLs:**

```
GET /api/volunteers/applications
GET /api/volunteers/applications?status=pending
GET /api/volunteers/applications?status=approved&limit=10
```

#### **Response (200 OK):**

```json
{
	"success": true,
	"data": [
		{
			"id": "uuid-here",
			"first_name": "John",
			"last_name": "Doe",
			"email": "john.doe@email.com",
			"status": "pending",
			"applied_at": "2025-10-29T16:30:00.000Z"
		}
	],
	"pagination": {
		"page": 1,
		"limit": 50,
		"total": 1,
		"totalPages": 1
	}
}
```

---

### 3. **Approve Application**

**PUT** `/api/volunteers/applications/{id}/approve`

#### **URL Example:**

```
PUT /api/volunteers/applications/348d6004-8b53-40cc-b848-a023e0a791f1/approve
```

#### **Request Body (JSON):**

```json
{
	"notes": "Application approved after review"
}
```

#### **Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"id": "348d6004-8b53-40cc-b848-a023e0a791f1",
		"status": "approved",
		"reviewed_at": "2025-10-29T16:35:00.000Z",
		"review_notes": "Application approved after review"
	},
	"volunteer": {
		"id": "new-volunteer-uuid",
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@email.com",
		"status": "active"
	},
	"message": "Volunteer application approved successfully"
}
```

---

### 4. **Reject Application**

**PUT** `/api/volunteers/applications/{id}/reject`

#### **URL Example:**

```
PUT /api/volunteers/applications/348d6004-8b53-40cc-b848-a023e0a791f1/reject
```

#### **Request Body (JSON):**

```json
{
	"rejection_reason": "Does not meet experience requirements",
	"notes": "Applicant needs more relevant experience"
}
```

#### **Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"id": "348d6004-8b53-40cc-b848-a023e0a791f1",
		"status": "rejected",
		"reviewed_at": "2025-10-29T16:35:00.000Z",
		"rejection_reason": "Does not meet experience requirements",
		"review_notes": "Applicant needs more relevant experience"
	},
	"message": "Volunteer application rejected"
}
```

---

### 5. **Update Application Status**

**PUT** `/api/volunteers/applications/{id}/status`

#### **URL Example:**

```
PUT /api/volunteers/applications/348d6004-8b53-40cc-b848-a023e0a791f1/status
```

#### **Request Body (JSON):**

```json
{
	"status": "under-review",
	"notes": "Application is being reviewed by the committee",
	"interview_date": "2025-11-05T10:00:00.000Z",
	"background_check": "completed"
}
```

#### **Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"id": "348d6004-8b53-40cc-b848-a023e0a791f1",
		"status": "under-review",
		"interview_scheduled": true,
		"interview_date": "2025-11-05T10:00:00.000Z",
		"background_check": "completed",
		"review_notes": "Application is being reviewed by the committee"
	},
	"message": "Volunteer application updated successfully"
}
```

---

## 🧪 **Postman Test Examples**

### **Test 1: Submit Application**

```bash
POST http://localhost:5000/api/volunteers/applications
Content-Type: application/json

{
  "first_name": "Sarah",
  "last_name": "Johnson",
  "email": "sarah.johnson@email.com",
  "phone": "+1 555-123-4567",
  "skills": ["Photography", "Social Media", "Graphic Design"],
  "interests": ["Marketing", "Documentation", "Event Photography"],
  "motivation": "I want to help document and promote temple events through my photography skills.",
  "experience": "Professional photographer with 3 years experience in event photography"
}
```

### **Test 2: Get Pending Applications**

```bash
GET http://localhost:5000/api/volunteers/applications?status=pending
```

### **Test 3: Approve Application**

```bash
PUT http://localhost:5000/api/volunteers/applications/{APPLICATION_ID}/approve
Content-Type: application/json

{
  "notes": "Excellent photography portfolio and relevant experience"
}
```

## 📝 **Notes:**

- Replace `{id}` with actual application UUID
- All timestamps are in ISO 8601 format
- Arrays can be empty `[]` if no data
- Status values: `pending`, `under-review`, `approved`, `rejected`
- Background check values: `pending`, `completed`, `failed`

## 🎯 **Quick Test Workflow:**

1. **Submit** → POST new application
2. **List** → GET all applications to see your submission
3. **Approve** → PUT approve the application
4. **Verify** → GET applications again to see status change

The API is now ready for Postman testing! 🚀
