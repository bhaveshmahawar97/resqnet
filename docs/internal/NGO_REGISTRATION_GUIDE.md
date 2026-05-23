# NGO Registration System - Implementation Guide

## Overview
A complete NGO registration and verification system has been implemented for ResQNet. NGOs can now register independently, admins can verify them, and verified NGOs will appear in the NGO directory and potentially on the home page.

## Features Implemented

### 1. **NGO Model** (`server/models/NGO.js`)
- Comprehensive NGO data model with all necessary fields:
  - Basic Info: Name, Email, Phone, Description
  - Location: Address, City, State, Pincode, Coordinates
  - Classification: NGO Type, Specialties, Service Areas
  - Verification: Status (pending/approved/rejected), Verified flag, Notes
  - Social Media: Links to Facebook, Instagram, Twitter, YouTube
  - Engagement: Logo, Rating, Response Time, Missions Completed

### 2. **Backend API Endpoints** (`server/routes/ngos.js`)

#### Public Routes:
- `GET /api/ngos` - Get all verified NGOs (with filters)
- `GET /api/ngos/:id` - Get specific NGO details
- `GET /api/ngos/:id/verification-status` - Check NGO verification status
- `POST /api/ngos/register` - Register a new NGO (public)

#### Protected Routes (NGO Owner):
- `PUT /api/ngos/:id` - Update NGO profile

#### Admin Routes:
- `GET /api/ngos/admin/pending` - Get all pending NGOs (paginated)
- `POST /api/ngos/admin/verify/:id` - Approve/Reject NGO registration

### 3. **Frontend Components**

#### NGO Registration Form (`client/src/components/ngo/NGORegistrationForm.jsx`)
- Multi-step form (4 steps):
  1. **Basic Information**: Organization name, email, phone
  2. **Location**: Address, city, state, pincode, coordinates
  3. **Organization Details**: Registration number, NGO type, description
  4. **Contact & Social**: Website and social media links
- Form validation at each step
- Success/Error notifications
- Progress tracking with step indicators
- Responsive design for mobile and desktop

#### NGO Registration Page (`client/src/pages/NGORegister.jsx`)
- Dedicated registration page with hero section
- FAQ section explaining the registration process
- Integrated registration form component
- Educational content about benefits of joining ResQNet

### 4. **Updated Services**

#### NGO Service (`client/src/services/ngoService.js`)
- `registerNGO()` - Submit NGO registration
- `getAllNGOs()` - Fetch verified NGOs
- `getNGOById()` - Get NGO details
- `getVerificationStatus()` - Check registration status
- `getPendingNGOs()` - Fetch pending registrations (admin)
- `verifyNGO()` - Approve/Reject NGO (admin)

#### Directory Service (`server/services/userDirectoryService.js`)
- Updated `listNgos()` to include both:
  - User-based NGO profiles
  - Standalone registered NGOs
- Merged results sorted by verification status and distance

### 5. **Seed Data** (`server/scripts/seedNgos.js`)
- Pre-loaded 26 NGOs from your provided list
- Includes NGOs from:
  - Kota, Rajasthan (8 NGOs)
  - Jaipur, Rajasthan (5 NGOs)
  - Udaipur, Rajasthan (4 NGOs)
  - Dehradun, Uttarakhand (2 NGOs)
  - Roorkee, Uttarakhand (1 NGO)
  - Jaisalmer, Rajasthan (1 NGO)
  - Mumbai, Maharashtra (3 NGOs)
- All seeded NGOs are pre-verified

## Usage Guide

### For NGO Registration

1. **Navigate to Registration Page**: `/ngo-register`
2. **Fill Multi-Step Form**:
   - Step 1: Basic details (organization name, email, phone)
   - Step 2: Location information
   - Step 3: NGO type and description
   - Step 4: Website and social media links
3. **Submit Form**: Click "Submit Registration"
4. **Confirmation**: NGO will receive pending status and await admin verification
5. **Verification**: Status can be checked using the verification status endpoint

### For Admin Verification

1. **Navigate to Admin Dashboard**: `/dashboard/admin`
2. **View Pending NGOs**: Access pending registrations list
3. **Review Details**: Check NGO information and documents
4. **Verify NGO**: Approve or reject with optional notes
5. **Notification**: NGO receives verification status

### For Displaying NGOs

NGOs now appear in:
- **NGO Directory** (`/ngos`) - All verified NGOs with map and filtering
- **Rescue Mission** - Nearby NGOs for rescue coordination
- **Home Page** - Featured NGOs section (if integrated)

## File Structure

```
server/
  models/
    ├── NGO.js                    # NGO data model
    ├── registerCore.js           # Updated with NGO model
    └── index.js                  # Updated collections
  controllers/
    └── ngoController.js          # NGO endpoints logic
  routes/
    └── ngos.js                   # NGO API routes
  services/
    └── userDirectoryService.js   # Updated to include standalone NGOs
  scripts/
    └── seedNgos.js              # Seed script for initial data
  app.js                          # Updated with NGO routes

client/
  src/
    pages/
      └── NGORegister.jsx         # Registration page
    components/
      ngo/
        └── NGORegistrationForm.jsx # Registration form component
    services/
      └── ngoService.js           # NGO API calls
    routes/
      └── routesConfig.jsx        # Updated routes
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install mongoose  # Already installed
```

### 2. Seed Initial Data
```bash
cd server
node scripts/seedNgos.js
```

### 3. Update Database Models
The NGO model is automatically registered in `bindCoreModels()` via `registerCore.js`

### 4. Test Endpoints

**Register NGO**:
```bash
curl -X POST http://localhost:3000/api/ngos/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Test NGO",
    "email": "test@ngo.com",
    "phone": "+91 9999999999",
    "address": "123 Main St",
    "city": "Kota",
    "state": "Rajasthan",
    "ngoType": ["Rescue", "Medical"]
  }'
```

**Get All NGOs**:
```bash
curl http://localhost:3000/api/ngos?city=Kota
```

**Verify NGO** (Admin):
```bash
curl -X POST http://localhost:3000/api/ngos/admin/verify/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "notes": "Verified successfully"}'
```

## Key Features

✅ **NGO Registration Form**: Multi-step, user-friendly form
✅ **Verification Workflow**: Admin approval process
✅ **Database Storage**: Dedicated NGO collection
✅ **Pre-Seeded Data**: 26 NGOs from your list
✅ **Directory Integration**: NGOs appear in search results
✅ **Status Tracking**: Check registration status anytime
✅ **Admin Dashboard**: Manage pending registrations
✅ **Responsive Design**: Works on mobile and desktop

## Verification Status Flow

```
NGO Registration
    ↓
Pending (awaiting admin review)
    ↓
├─→ Approved (verified = true)
│   └─→ Appears in NGO directory
│
└─→ Rejected (verification notes provided)
    └─→ Admin can provide feedback for reapplication
```

## Future Enhancements

1. **Email Notifications**: Send verification status updates
2. **Document Upload**: Support for registration certificates
3. **Location Mapping**: Auto-map NGO coordinates
4. **Bulk Import**: Admin tool to import multiple NGOs
5. **Verification Levels**: Tiers (basic, verified, premium)
6. **Analytics Dashboard**: NGO performance metrics
7. **Direct Messaging**: Communication between NGOs

## Troubleshooting

### NGO not appearing in directory after registration?
- Check if `verified` field is set to `true`
- Ensure `isActive` field is `true`
- Verify the city name matches the search query

### Seed script fails?
- Ensure MongoDB connection is active
- Check `.env` file has correct database URL
- Run from project root directory

### Admin verification not working?
- Verify user role is "admin" in authorization middleware
- Check if NGO ID is valid
- Ensure approved field is boolean (true/false)

## API Response Examples

### Successful Registration
```json
{
  "success": true,
  "status": 201,
  "message": "NGO registered successfully. Awaiting admin verification.",
  "data": {
    "ngo": {
      "id": "507f1f77bcf86cd799439011",
      "organizationName": "Test NGO",
      "email": "test@ngo.com",
      "city": "Kota",
      "verificationStatus": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### NGO Directory Response
```json
{
  "success": true,
  "message": "NGOs retrieved successfully",
  "data": {
    "ngos": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Apple Dog Society NGO Kota",
        "city": "Kota",
        "verified": true,
        "rating": 4.5,
        "specialties": ["Rescue", "Welfare"],
        "distance": "2.5 km",
        "phone": "+91 9999999999",
        "missionsCompleted": 45
      }
    ]
  }
}
```

## Notes

- All NGO coordinates (latitude/longitude) are set to approximate values based on city location
- Pre-seeded NGOs are all marked as verified and active
- Email verification could be added as a future enhancement
- NGO descriptions should follow content guidelines
- Social media links are optional and can be updated later
