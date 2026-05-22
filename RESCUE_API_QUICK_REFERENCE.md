# ResQNet Rescue API — Quick Reference Guide

## Base URL
```
http://localhost:5000/api/rescue
```

## Authentication
All endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## API Endpoints

### 1. Create Rescue Request
```
POST /api/rescue/create
```

**Required Body:**
```json
{
  "animalType": "dog",
  "condition": "injured leg, bleeding",
  "description": "Found on street, limping",
  "severity": "high",
  "address": "123 Main St, City",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Optional:**
```json
{
  "images": ["url1", "url2"]
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "Rescue request created successfully",
  "data": { RescueRequest object }
}
```

---

### 2. Get All Rescue Requests (Operational Roles)
```
GET /api/rescue/all
```

**Query Parameters:**
```
?status=pending
?severity=critical
?search=dog
?sortBy=severity-high
?page=1
?limit=20
```

**Example:**
```
GET /api/rescue/all?status=pending&severity=high&sortBy=newest
```

**Success (200):**
```json
{
  "success": true,
  "message": "Rescue requests retrieved successfully",
  "data": [ { RescueRequest }, ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

### 3. Get Critical Rescues
```
GET /api/rescue/critical/list
```

**Query Parameters:**
```
?page=1
?limit=10
```

**Use When:** Viewing emergency rescues requiring immediate attention

**Success (200):**
```json
{
  "success": true,
  "message": "Critical rescue requests retrieved successfully",
  "data": [ { RescueRequest with severity: critical }, ... ],
  "pagination": { ... }
}
```

---

### 4. Get User's Rescues
```
GET /api/rescue/my/requests
```

**Query Parameters:**
```
?status=pending
?severity=high
?sortBy=newest
?page=1
?limit=20
```

**Different For Each Role:**
- **User:** Own created rescues
- **NGO:** Rescues assigned to their NGO
- **Volunteer:** Rescues assigned to them
- **Admin:** All rescues

**Success (200):**
```json
{
  "success": true,
  "message": "User rescue requests retrieved successfully",
  "data": [ { RescueRequest }, ... ],
  "pagination": { ... }
}
```

---

### 5. Get Single Rescue
```
GET /api/rescue/:id
```

**Example:**
```
GET /api/rescue/507f1f77bcf86cd799439011
```

**Who Can View:**
- Request creator
- Assigned NGO
- Assigned volunteer
- Admin

**Success (200):**
```json
{
  "success": true,
  "message": "Rescue request retrieved successfully",
  "data": { RescueRequest object }
}
```

---

### 6. Update Rescue Status
```
PUT /api/rescue/update-status/:id
```

**Required Body:**
```json
{
  "status": "in_progress",
  "note": "Rescue team on site"
}
```

**Valid Statuses:**
- `pending` → `accepted` → `in_progress` → `rescued` → `completed`
- Any status can go to `cancelled`

**NGO/Volunteer Special:** When accepting a pending rescue:
- Automatically assigns to them
- Creates timeline entry

**Success (200):**
```json
{
  "success": true,
  "message": "Rescue status updated successfully",
  "data": { Updated RescueRequest object }
}
```

---

### 7. Get Rescue Statistics (Admin Only)
```
GET /api/rescue/stats/overview
```

**Success (200):**
```json
{
  "success": true,
  "message": "Rescue statistics retrieved successfully",
  "data": {
    "byStatus": {
      "pending": 15,
      "accepted": 8,
      "in_progress": 12,
      "rescued": 45,
      "completed": 120,
      "cancelled": 5
    },
    "bySeverity": {
      "low": 50,
      "medium": 85,
      "high": 35,
      "critical": 12
    },
    "total": 182,
    "pending": 15,
    "completed": 120,
    "critical": 12
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required rescue request fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this rescue request status"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Rescue request not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Unable to create rescue request"
}
```

---

## Role-Based Access

| Endpoint | User | NGO | Volunteer | Admin |
|----------|------|-----|-----------|-------|
| POST /create | ✅ | ❌ | ❌ | ❌ |
| GET /all | ❌ | ✅ | ✅ | ✅ |
| GET /critical/list | ❌ | ✅ | ✅ | ✅ |
| GET /stats/overview | ❌ | ❌ | ❌ | ✅ |
| GET /my/requests | ✅ | ✅ | ✅ | ✅ |
| GET /:id | ✅* | ✅* | ✅* | ✅ |
| PUT /update-status/:id | ❌ | ✅ | ✅ | ✅ |

*Only if owner, assigned, or admin

---

## Common Use Cases

### User Creating a Rescue Report
```bash
curl -X POST http://localhost:5000/api/rescue/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "animalType": "cat",
    "condition": "stuck in tree",
    "description": "Orange tabby stuck 20ft up",
    "severity": "medium",
    "address": "456 Oak Ave, City"
  }'
```

### NGO Viewing Pending Rescues
```bash
curl -X GET "http://localhost:5000/api/rescue/all?status=pending" \
  -H "Authorization: Bearer NGO_TOKEN"
```

### Volunteer Accepting a Rescue
```bash
curl -X PUT http://localhost:5000/api/rescue/update-status/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer VOLUNTEER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted",
    "note": "Our team is heading there now"
  }'
```

### Admin Viewing Statistics
```bash
curl -X GET http://localhost:5000/api/rescue/stats/overview \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Pagination

All list endpoints support pagination:

```
?page=1      # Page number (1-indexed)
?limit=20    # Items per page (1-100, default 20)
```

**Response includes:**
```json
"pagination": {
  "page": 1,
  "limit": 20,
  "total": 100,
  "pages": 5
}
```

---

## Sorting Options

For `getAllRescueRequests` and `getMyRescueRequests`:

```
?sortBy=newest         # Newest first (default)
?sortBy=oldest         # Oldest first
?sortBy=severity-high  # High severity first
?sortBy=status         # By status alphabetically
```

---

## Timeline Tracking

Each rescue includes a timeline showing all updates:

```json
"rescueTimeline": [
  {
    "status": "pending",
    "note": "Rescue request created",
    "updatedBy": "507f1f77bcf86cd799439011",
    "role": "user",
    "createdAt": "2025-05-19T10:30:00Z"
  },
  {
    "status": "accepted",
    "note": "Our team is heading there",
    "updatedBy": "507f1f77bcf86cd799439012",
    "role": "ngo",
    "createdAt": "2025-05-19T10:35:00Z"
  }
]
```

---

## Status Workflow

```
pending ──→ accepted ──→ in_progress ──→ rescued ──→ completed
                                                        ↑
                                                        │
                          Any status ──→ cancelled ────┘
```

---

## Severity Levels

- **low** — Non-urgent, stable animal
- **medium** — Injured but stable
- **high** — Serious injury, needs urgent attention
- **critical** — Life-threatening emergency

---

## Response Data Structure

Each `RescueRequest` object contains:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "animalType": "dog",
  "condition": "injured leg",
  "description": "Found on street",
  "severity": "high",
  "images": ["url1", "url2"],
  "latitude": 28.7041,
  "longitude": 77.1025,
  "address": "123 Main St",
  "status": "accepted",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439010",
    "fullName": "John User",
    "email": "john@example.com",
    "role": "user",
    "avatar": "url"
  },
  "assignedNgo": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "Animal Rescue NGO",
    "email": "ngo@example.com",
    "role": "ngo",
    "avatar": "url"
  },
  "assignedVolunteer": null,
  "rescueTimeline": [ /* ... */ ],
  "createdAt": "2025-05-19T10:30:00Z",
  "updatedAt": "2025-05-19T10:35:00Z"
}
```

---

## Testing Tips

1. **Get valid JWT token:**
   - Register user at `/api/auth/register`
   - Login at `/api/auth/login`
   - Use returned token in all subsequent requests

2. **Create a test rescue:**
   - POST to `/api/rescue/create` as user
   - Note the returned `_id`

3. **Test role-based access:**
   - Try accessing `/api/rescue/all` with user role (should fail)
   - Try accessing with NGO role (should work)

4. **Test authorization:**
   - Create rescue as User A
   - Try updating status as User B (should fail)
   - Try updating as NGO assigned to it (should work)

---

## Next Steps

- Implement image upload endpoint
- Add WebSocket support for real-time updates
- Implement geolocation-based rescue matching
- Add notification system
- Implement advanced filtering and search
- Add role management endpoints

