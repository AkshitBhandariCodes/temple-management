# Frontend Integration Guide - Application Approval/Rejection

## 🚨 Issue: "Invalid application ID" Error

### Root Cause

The frontend is passing `undefined` as the application ID to the
approval/rejection endpoints.

### Error Details

```
Error: Invalid application ID
at apiRequest (use-complete-api.tsx:59:13)
at async Object.mutationFn (use-communities.tsx:452:14)
```

## 🔧 Backend Status: ✅ WORKING

The backend approval/rejection functionality is working correctly:

- ✅ PUT `/api/communities/{id}/applications/{appId}/approve` - Working
- ✅ PUT `/api/communities/{id}/applications/{appId}/reject` - Working
- ✅ Improved error messages with debugging hints

## 🎯 Frontend Fix Required

### Check These Areas:

#### 1. Application Object Structure

Ensure your application objects have a valid `id` property:

```typescript
interface Application {
	id: string; // ← This must be a valid UUID
	name: string;
	email: string;
	status: "pending" | "approved" | "rejected";
	// ... other properties
}
```

#### 2. API Call Implementation

Check your approval/rejection functions:

```typescript
// ❌ WRONG - ID is undefined
const approveApplication = (app) => {
	return apiRequest(
		"PUT",
		`/communities/${communityId}/applications/${app.applicationId}/approve`
	);
};

// ✅ CORRECT - Use the right property name
const approveApplication = (app) => {
	return apiRequest(
		"PUT",
		`/communities/${communityId}/applications/${app.id}/approve`
	);
};
```

#### 3. Data Fetching

Ensure applications are fetched correctly:

```typescript
// The API returns applications with this structure:
{
  "success": true,
  "data": [
    {
      "id": "uuid-here", // ← Make sure this exists
      "name": "Applicant Name",
      "status": "pending"
    }
  ]
}
```

## 🧪 Debug Tools Available

### 1. Improved Error Messages

The backend now returns detailed error information:

```json
{
	"success": false,
	"error": "Invalid application ID",
	"message": "Invalid application ID received: \"undefined\". Please ensure the application ID is properly set in the frontend.",
	"received_id": "undefined",
	"hint": "Check that the application object has a valid \"id\" property"
}
```

### 2. Debug Endpoints

Use these endpoints to troubleshoot:

```bash
# Validate an application ID
GET /api/debug/validate-id/{applicationId}

# Debug request data
POST /api/debug/application-action
```

### 3. Test with Valid Data

Test your frontend with this working example:

```bash
# Get applications (should return valid IDs)
GET /api/communities/3e80bddc-1f83-4935-a0cc-9c48f86bcae7/applications

# Use a real ID from the response above
PUT /api/communities/3e80bddc-1f83-4935-a0cc-9c48f86bcae7/applications/{real-uuid-here}/approve
```

## 🔍 Common Issues & Solutions

### Issue 1: Property Name Mismatch

```typescript
// ❌ Wrong property names
app.applicationId; // undefined
app.uuid; // undefined
app._id; // undefined

// ✅ Correct property name
app.id; // "uuid-string"
```

### Issue 2: Async Data Loading

```typescript
// ❌ Calling approve before data is loaded
const handleApprove = (app) => {
	// app might be undefined or incomplete
	approveApplication(app.id); // Error!
};

// ✅ Check data is loaded first
const handleApprove = (app) => {
	if (!app || !app.id) {
		console.error("Invalid application data:", app);
		return;
	}
	approveApplication(app.id);
};
```

### Issue 3: State Management

```typescript
// ❌ State not properly updated
const [applications, setApplications] = useState([]);

// ✅ Ensure state has proper structure
useEffect(() => {
	fetchApplications().then((response) => {
		console.log("Fetched applications:", response.data); // Debug log
		setApplications(response.data);
	});
}, []);
```

## 📊 Current API Status

### Working Endpoints:

- ✅ `GET /api/communities/{id}/applications` - Returns all applications
- ✅ `GET /api/communities/{id}/applications?status=pending` - Pending only
- ✅ `GET /api/communities/{id}/applications?status=approved` - Approved only
- ✅ `PUT /api/communities/{id}/applications/{appId}/approve` - Approve
- ✅ `PUT /api/communities/{id}/applications/{appId}/reject` - Reject

### Test Community ID:

```
3e80bddc-1f83-4935-a0cc-9c48f86bcae7
```

## 🚀 Quick Fix Checklist

1. **Check application data structure** - Ensure `id` property exists
2. **Verify API calls** - Use correct property names in URLs
3. **Add error handling** - Check for undefined values before API calls
4. **Test with debug endpoints** - Validate your data
5. **Check network tab** - See what's actually being sent to the API

## 💡 Need Help?

If you're still having issues:

1. Check the browser network tab to see the exact request being made
2. Use the debug endpoints to validate your data
3. Look at the improved error messages for specific hints
4. Test with the working community ID provided above

The backend is fully functional - the issue is in the frontend data handling! 🎯
