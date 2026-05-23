# NGO Registration System - Integration Checklist

## ✅ Backend Setup

### Database Models
- [x] Created `server/models/NGO.js` with complete schema
- [x] Updated `server/models/registerCore.js` to bind NGO model
- [x] Updated `server/models/index.js` to include NGO in CORE_COLLECTIONS

### API Routes & Controllers
- [x] Created `server/routes/ngos.js` with all endpoints
- [x] Created `server/controllers/ngoController.js` with all handlers
- [x] Updated `server/app.js` to mount NGO routes at `/api/ngos`

### Services
- [x] Updated `server/services/userDirectoryService.js` to:
  - Include standalone NGOs in directory listings
  - Merge user-based and registered NGOs
  - Sort by verification status and distance

### Seed Data
- [x] Created `server/scripts/seedNgos.js` with 26 pre-seeded NGOs

## ✅ Frontend Setup

### Components
- [x] Created `client/src/components/ngo/NGORegistrationForm.jsx`
- [x] Created `client/src/pages/NGORegister.jsx` (registration page)
- [x] Updated `client/src/components/ngo/NGOPageCTA.jsx` with navigation

### Services
- [x] Updated `client/src/services/ngoService.js` with all API functions

### Routing
- [x] Updated `client/src/routes/routesConfig.jsx` to add `/ngo-register` route

## 🚀 Deployment Steps

### Step 1: Backend Deployment
```bash
# 1. Ensure MongoDB connection is active
# Check .env file for MONGODB_URI_CORE

# 2. Start the server
npm run dev

# 3. Verify NGO routes are working
curl http://localhost:3000/api/ngos

# 4. Run seed script
node server/scripts/seedNgos.js
```

### Step 2: Frontend Setup
```bash
# 1. Ensure client is running
npm run dev

# 2. Navigate to http://localhost:5173/ngo-register

# 3. Test registration form
```

### Step 3: Verification Testing
```bash
# 1. Get pending NGOs (requires admin auth)
curl http://localhost:3000/api/ngos/admin/pending \
  -H "Authorization: Bearer {admin_token}"

# 2. Verify an NGO
curl -X POST http://localhost:3000/api/ngos/admin/verify/{ngo_id} \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "notes": "Verified"}'

# 3. Verify NGO appears in directory
curl http://localhost:3000/api/users/ngos?city=Kota
```

## 📋 Endpoint Documentation

### Public Endpoints

#### Register NGO
- **Route**: `POST /api/ngos/register`
- **Body**:
  ```json
  {
    "organizationName": "string (required)",
    "email": "string (required)",
    "phone": "string (required)",
    "address": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "pincode": "string",
    "latitude": "number",
    "longitude": "number",
    "registrationNumber": "string",
    "ngoType": ["string"],
    "description": "string",
    "website": "string",
    "socialMedia": {
      "facebook": "string",
      "instagram": "string",
      "twitter": "string",
      "youtube": "string"
    }
  }
  ```
- **Response**: New NGO with `verificationStatus: "pending"`

#### Get NGOs
- **Route**: `GET /api/ngos?city={city}&type={type}&limit={limit}`
- **Response**: Array of verified NGOs

#### Get NGO Details
- **Route**: `GET /api/ngos/{id}`
- **Response**: Specific NGO details

#### Get Verification Status
- **Route**: `GET /api/ngos/{id}/verification-status`
- **Response**: Registration status and notes

### Admin Endpoints

#### Get Pending NGOs
- **Route**: `GET /api/ngos/admin/pending?page={page}&limit={limit}`
- **Auth**: Admin role required
- **Response**: Paginated pending NGO registrations

#### Verify NGO
- **Route**: `POST /api/ngos/admin/verify/{id}`
- **Auth**: Admin role required
- **Body**:
  ```json
  {
    "approved": "boolean (required)",
    "notes": "string (optional)"
  }
  ```
- **Response**: Updated NGO with `verified: true/false`

## 🗂️ File Structure Summary

```
resqnet/
├── server/
│   ├── models/
│   │   ├── NGO.js                    ✅ NEW
│   │   ├── registerCore.js           ✅ UPDATED
│   │   └── index.js                  ✅ UPDATED
│   ├── controllers/
│   │   └── ngoController.js          ✅ NEW
│   ├── routes/
│   │   └── ngos.js                   ✅ NEW
│   ├── services/
│   │   └── userDirectoryService.js   ✅ UPDATED
│   ├── scripts/
│   │   └── seedNgos.js               ✅ NEW
│   └── app.js                        ✅ UPDATED
│
├── client/
│   └── src/
│       ├── pages/
│       │   └── NGORegister.jsx       ✅ NEW
│       ├── components/
│       │   └── ngo/
│       │       ├── NGORegistrationForm.jsx  ✅ NEW
│       │       └── NGOPageCTA.jsx     ✅ UPDATED
│       ├── services/
│       │   └── ngoService.js         ✅ UPDATED
│       └── routes/
│           └── routesConfig.jsx      ✅ UPDATED
│
└── NGO_REGISTRATION_GUIDE.md          ✅ NEW
```

## 🧪 Testing Checklist

### Backend Tests
- [ ] Seed script runs without errors
- [ ] `GET /api/ngos` returns seeded NGOs
- [ ] `POST /api/ngos/register` creates new NGO
- [ ] New NGO has `verified: false` and `verificationStatus: "pending"`
- [ ] `GET /api/ngos/admin/pending` shows unverified NGOs (requires admin token)
- [ ] `POST /api/ngos/admin/verify/{id}` updates NGO status
- [ ] Verified NGO appears in `GET /api/ngos` results

### Frontend Tests
- [ ] Navigation to `/ngo-register` works
- [ ] Registration form loads and renders all 4 steps
- [ ] Form validation works on each step
- [ ] Form submission sends correct data to backend
- [ ] Success message appears after registration
- [ ] NGOs appear in `/ngos` directory after admin verification
- [ ] "Register Your NGO" button on NGO page navigates to form
- [ ] Form is responsive on mobile and desktop

## 📊 Expected Behavior

### User Journey
1. User visits `/ngos` (NGO directory page)
2. Sees "Your NGO belongs in this network" section
3. Clicks "Register Your NGO — Free" button
4. Redirected to `/ngo-register`
5. Fills out 4-step form
6. Submits registration
7. Receives "pending" status
8. Admin reviews in dashboard
9. Admin approves/rejects
10. NGO appears in directory if approved

### Admin Workflow
1. Admin visits admin dashboard
2. Sees pending NGO registrations
3. Reviews NGO details
4. Clicks approve/reject button
5. Optionally adds verification notes
6. NGO updated in database
7. If approved, appears in public directory

## 🔧 Troubleshooting

### Issue: Seed script fails
**Solution**:
- Check MongoDB connection
- Verify `.env` file configuration
- Ensure `connectDatabases()` completes
- Run from project root directory

### Issue: NGO not appearing in directory after verification
**Solution**:
- Verify `verified: true` in database
- Check `isActive: true`
- City name must match search query (case-insensitive)
- Try refreshing page or clearing cache

### Issue: Registration form not submitting
**Solution**:
- Check browser console for errors
- Verify all required fields are filled
- Check network tab in developer tools
- Ensure `/api/ngos/register` endpoint is accessible

### Issue: Admin verification endpoint returns 403
**Solution**:
- Verify user has admin role
- Check authorization token is valid
- Ensure NGO ID is valid MongoDB ObjectId

## 📝 Notes

- Pre-seeded NGOs are all verified and active
- Email notifications can be added in future
- Document upload support can be implemented later
- Bulk import tool for admin can be added
- SMS notifications option available
- Integration with payment gateway for premium features possible

## ✨ Next Steps (Optional Enhancements)

1. **Email Notifications**: Send verification status updates
2. **Document Upload**: NGO registration certificate upload
3. **Admin Dashboard**: Visual management interface for NGO verifications
4. **Bulk Operations**: Import/export NGO data
5. **Analytics**: Track verification rates, NGO growth
6. **Premium Tiers**: Enhanced features for NGOs
7. **Direct Messaging**: NGO-to-NGO communication
8. **Donation Integration**: Enable NGO fundraising
9. **Impact Tracking**: Dashboard for metrics
10. **Certification**: Recognition program for verified NGOs
