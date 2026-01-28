# 🧪 Phase 2: Admin Dashboard APIs - Testing Guide

## ✅ What We Built

**Phase 2** implements the core Admin Dashboard APIs:

### Endpoints Created:
1. ✅ `GET /api/admin/dashboard/metrics` - Dashboard metrics
2. ✅ `GET /api/admin/dashboard/today-bookings` - Today's bookings
3. ✅ `GET /api/admin/dashboard/recent-activity` - Recent activity
4. ✅ `GET /api/admin/dashboard/stats` - Detailed statistics

---

## 🚀 Quick Start Testing

### Prerequisites

1. **Server Running**:
   ```bash
   cd server
   npm run dev
   ```
   Server should be running on `http://localhost:3000`

2. **MongoDB Connected**: Check console for "MongoDB connected"

3. **Admin User**: You need a user with `role: "admin"`

---

## 📝 Step 1: Create Admin User

### Option A: Using MongoDB Compass/Shell

If you already have a registered user, update their role:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Option B: Register New User & Make Admin

1. **Register via API**:
   ```bash
   POST http://localhost:3000/auth/register
   Content-Type: application/json

   {
     "name": "Admin User",
     "email": "admin@wemakeover.com",
     "phoneNumber": "9876543210",
     "password": "Admin@123",
     "confirmPassword": "Admin@123"
   }
   ```

2. **Verify OTP** (check your email or logs)

3. **Update role in MongoDB**:
   ```javascript
   db.users.updateOne(
     { email: "admin@wemakeover.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 🧪 Step 2: Test with Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `server/POSTMAN_ADMIN_DASHBOARD.json`
4. Collection "WeMakeover - Admin Dashboard APIs" will be imported

### Run Tests

#### Test 1: Login as Admin
1. Open **Authentication → Login as Admin**
2. Update email/password in body
3. Click **Send**
4. ✅ Should return `200 OK` with user data
5. ✅ Cookies `accessToken` and `refreshToken` are set automatically

#### Test 2: Get Dashboard Metrics
1. Open **Dashboard → Get Dashboard Metrics**
2. Click **Send**
3. ✅ Should return:
   ```json
   {
     "success": true,
     "data": {
       "totalUsers": { "count": 123, "growth": 4.5, ... },
       "totalBookings": { "count": 456, "growth": 2.3, ... },
       "totalRevenue": { "amount": 89000, ... },
       "upcomingBookings": { "count": 78, ... }
     }
   }
   ```

#### Test 3: Get Today's Bookings
1. Open **Dashboard → Get Today's Bookings**
2. Click **Send**
3. ✅ Should return array of bookings for today with pagination

#### Test 4: Get Recent Activity
1. Open **Dashboard → Get Recent Activity**
2. Click **Send**
3. ✅ Should return recent bookings, enquiries, and users

#### Test 5: Get Statistics
1. Open **Dashboard → Get Dashboard Statistics**
2. Click **Send**
3. ✅ Should return booking/payment breakdown and monthly revenue

---

## 🧪 Step 3: Test with cURL (Alternative)

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wemakeover.com","password":"Admin@123"}' \
  -c cookies.txt
```

### 2. Get Metrics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/metrics \
  -b cookies.txt
```

### 3. Get Today's Bookings
```bash
curl -X GET "http://localhost:3000/api/admin/dashboard/today-bookings?page=1&limit=10" \
  -b cookies.txt
```

### 4. Get Recent Activity
```bash
curl -X GET "http://localhost:3000/api/admin/dashboard/recent-activity?limit=5" \
  -b cookies.txt
```

### 5. Get Statistics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -b cookies.txt
```

---

## 🔍 Manual Testing Checklist

### ✅ Authentication Tests

- [ ] **Login with admin user** → Returns 200, sets cookies
- [ ] **Login with regular user** → Returns 200, but admin endpoints should fail
- [ ] **Access metrics without login** → Returns 401/403
- [ ] **Check auth status** → Returns user with `role: "admin"`

### ✅ Metrics Endpoint Tests

- [ ] **GET /api/admin/dashboard/metrics**
  - [ ] Returns 200 status
  - [ ] Has `totalUsers` with count and growth
  - [ ] Has `totalBookings` with count and growth
  - [ ] Has `totalRevenue` with amount and formatted amount
  - [ ] Has `upcomingBookings` with count and growth
  - [ ] Growth percentages are numbers
  - [ ] Trend is either "up" or "down"

### ✅ Today's Bookings Tests

- [ ] **GET /api/admin/dashboard/today-bookings**
  - [ ] Returns 200 status
  - [ ] Returns array of bookings
  - [ ] Each booking has: bookingId, customerName, phone, email, dateTime, status
  - [ ] Pagination object exists with currentPage, totalPages, totalBookings
  - [ ] `page` query parameter works (try page=2)
  - [ ] `limit` query parameter works (try limit=5)
  - [ ] `status` filter works (try status=completed)

### ✅ Recent Activity Tests

- [ ] **GET /api/admin/dashboard/recent-activity**
  - [ ] Returns 200 status
  - [ ] Has `recentBookings` array
  - [ ] Has `recentEnquiries` array
  - [ ] Has `recentUsers` array
  - [ ] `limit` parameter works (try limit=3)

### ✅ Statistics Tests

- [ ] **GET /api/admin/dashboard/stats**
  - [ ] Returns 200 status
  - [ ] Has `bookingStatusBreakdown` array
  - [ ] Has `paymentStatusBreakdown` array
  - [ ] Has `monthlyRevenue` array
  - [ ] Arrays contain aggregated data

---

## 🚨 Expected Error Cases

### Test Non-Admin Access

1. **Login with regular user** (not admin)
2. **Try to access metrics**:
   ```bash
   GET /api/admin/dashboard/metrics
   ```
3. ✅ **Expected Response**:
   ```json
   {
     "success": false,
     "message": "Admin access required"
   }
   ```
   Status: `403 Forbidden`

### Test No Authentication

1. **Don't login** (no cookies)
2. **Try to access metrics**:
   ```bash
   GET /api/admin/dashboard/metrics
   ```
3. ✅ **Expected Response**:
   ```json
   {
     "success": false,
     "loggedIn": false,
     "message": "No access & refresh token"
   }
   ```
   Status: `200` or `401`

---

## 📊 Sample Response Data

### Metrics Response
```json
{
  "success": true,
  "message": "Dashboard metrics retrieved successfully",
  "data": {
    "totalUsers": {
      "count": 40689,
      "growth": -4.3,
      "trend": "down",
      "label": "Down from yesterday"
    },
    "totalBookings": {
      "count": 10293,
      "growth": 1.3,
      "trend": "up",
      "label": "Up from past week"
    },
    "totalRevenue": {
      "amount": 89000,
      "formattedAmount": "₹89,000",
      "growth": 2.8,
      "trend": "up",
      "label": "Up from yesterday"
    },
    "upcomingBookings": {
      "count": 2040,
      "growth": 1.8,
      "trend": "up",
      "label": "Up from yesterday"
    }
  }
}
```

### Today's Bookings Response
```json
{
  "success": true,
  "message": "Today's bookings retrieved successfully",
  "data": {
    "bookings": [
      {
        "bookingId": "BOOK-2025-1736678400000-1234",
        "customerName": "Sanjana Singh",
        "phoneNumber": "9431987878",
        "email": "sanjanasingh2@gmail.com",
        "dateTime": "12/01/2025 - 01:00-01:30 PM",
        "status": "completed",
        "totalAmount": 1499,
        "formattedAmount": "₹1,499",
        "paymentStatus": "completed",
        "services": [
          {
            "name": "Bridal Makeup",
            "quantity": 1,
            "price": 1499
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalBookings": 25,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "No access & refresh token"
**Solution**: Login first with admin credentials

### Issue: "Admin access required"
**Solution**: Check user role in database, must be "admin"

### Issue: Empty bookings array
**Solution**: Create some bookings with today's date in database

### Issue: Metrics show 0
**Solution**: Add some data to database (users, bookings, payments)

### Issue: Server not starting
**Solution**: 
- Check MongoDB connection
- Check Redis connection
- Verify `.env` file exists with correct values

---

## 📁 Files Created in Phase 2

```
server/src/
├── controllers/admin/
│   └── dashboard.admin.controller.js ✅ NEW
├── routes/admin/
│   └── dashboard.admin.routes.js ✅ NEW
└── server.js (updated) ✅

server/
├── ADMIN_DASHBOARD_API_DOCS.md ✅ NEW
├── POSTMAN_ADMIN_DASHBOARD.json ✅ NEW
└── PHASE_2_TESTING_GUIDE.md ✅ NEW (this file)
```

---

## ✅ Success Criteria

Phase 2 is complete when:

- ✅ All 4 endpoints return 200 with valid admin token
- ✅ Non-admin users get 403 Forbidden
- ✅ Unauthenticated requests get 401 Unauthorized
- ✅ Metrics show real data from database
- ✅ Pagination works correctly
- ✅ Filters work (status filter for bookings)
- ✅ Growth percentages calculated correctly

---

## 🎯 Next Steps

After Phase 2 is tested and working:

**Phase 3**: Booking Management APIs
- List all bookings (with filters)
- Update booking status
- View booking details
- Cancel bookings

**Phase 4**: Customer Management APIs
- List all customers
- View customer details
- Customer statistics

**Phase 5**: Enquiry Management APIs
- List all enquiries
- Update enquiry status

**Phase 6**: Service Management APIs
- CRUD for services and categories

---

## 📞 Need Help?

If you encounter issues:

1. Check server logs for errors
2. Verify MongoDB is connected
3. Ensure admin user exists with correct role
4. Check that cookies are being sent in requests
5. Review `ADMIN_DASHBOARD_API_DOCS.md` for detailed API info

---

**Phase 2 Status**: ✅ **READY FOR TESTING**

**Last Updated**: January 12, 2026
