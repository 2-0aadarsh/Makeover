# Admin Dashboard API Documentation

## 🎯 Overview
This document describes the Admin Dashboard APIs for the WeMakeover Admin Panel.

**Base URL**: `http://localhost:3000/api/admin/dashboard` (Development)

**Authentication**: All endpoints require:
1. Valid JWT token (in cookies: `accessToken`)
2. User role must be `admin`

---

## 📊 Endpoints

### 1. Get Dashboard Metrics

**Endpoint**: `GET /api/admin/dashboard/metrics`

**Description**: Retrieves key metrics for the admin dashboard including total users, bookings, revenue, and upcoming bookings with growth percentages.

**Authentication**: Required (Admin only)

**Response**:
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

**Status Codes**:
- `200`: Success
- `401`: Unauthorized (No token)
- `403`: Forbidden (Not admin)
- `500`: Server error

---

### 2. Get Today's Bookings

**Endpoint**: `GET /api/admin/dashboard/today-bookings`

**Description**: Retrieves all bookings scheduled for today with pagination support.

**Authentication**: Required (Admin only)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 10 | Items per page |
| `status` | String | No | - | Filter by status: `pending`, `confirmed`, `completed`, `cancelled` |

**Example Request**:
```
GET /api/admin/dashboard/today-bookings?page=1&limit=10&status=pending
```

**Response**:
```json
{
  "success": true,
  "message": "Today's bookings retrieved successfully",
  "data": {
    "bookings": [
      {
        "bookingId": "22899876",
        "customerName": "Sanjana Singh",
        "phoneNumber": "(+91) 9431987878",
        "email": "sanjanasingh2@gmail.com",
        "dateTime": "2025 Sep 12 - 01:00-01:30 PM",
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
        ],
        "createdAt": "2025-01-12T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 40,
      "totalBookings": 259,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `500`: Server error

---

### 3. Get Recent Activity

**Endpoint**: `GET /api/admin/dashboard/recent-activity`

**Description**: Retrieves recent bookings, enquiries, and new user registrations.

**Authentication**: Required (Admin only)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | Number | No | 5 | Number of items per category |

**Example Request**:
```
GET /api/admin/dashboard/recent-activity?limit=5
```

**Response**:
```json
{
  "success": true,
  "message": "Recent activity retrieved successfully",
  "data": {
    "recentBookings": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "orderNumber": "BOOK-2025-1736678400000-1234",
        "customerName": "Sanjana Singh",
        "amount": 1499,
        "status": "completed",
        "createdAt": "2025-01-12T10:30:00.000Z"
      }
    ],
    "recentEnquiries": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "enquiryNumber": "ENQ000001",
        "customerName": "Anamika Sharma",
        "service": "Bridal Makeup",
        "status": "pending",
        "createdAt": "2025-01-12T09:15:00.000Z"
      }
    ],
    "recentUsers": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "name": "Priya Chandra",
        "email": "priya@example.com",
        "createdAt": "2025-01-12T08:00:00.000Z"
      }
    ]
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `500`: Server error

---

### 4. Get Dashboard Statistics

**Endpoint**: `GET /api/admin/dashboard/stats`

**Description**: Retrieves detailed statistics including booking status breakdown, payment status breakdown, and monthly revenue trends.

**Authentication**: Required (Admin only)

**Response**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "bookingStatusBreakdown": [
      {
        "_id": "completed",
        "count": 5234
      },
      {
        "_id": "pending",
        "count": 1245
      },
      {
        "_id": "confirmed",
        "count": 2314
      },
      {
        "_id": "cancelled",
        "count": 1500
      }
    ],
    "paymentStatusBreakdown": [
      {
        "_id": "completed",
        "count": 7548,
        "totalAmount": 8900000
      },
      {
        "_id": "pending",
        "count": 1245,
        "totalAmount": 1500000
      }
    ],
    "monthlyRevenue": [
      {
        "_id": {
          "year": 2024,
          "month": 8
        },
        "revenue": 1200000,
        "count": 150
      },
      {
        "_id": {
          "year": 2024,
          "month": 9
        },
        "revenue": 1500000,
        "count": 180
      }
    ]
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `500`: Server error

---

## 🔐 Authentication

### How to Authenticate

1. **Login as Admin**:
   ```
   POST /auth/login
   Content-Type: application/json

   {
     "email": "admin@wemakeover.com",
     "password": "your_admin_password"
   }
   ```

2. **Cookies are set automatically** with `accessToken` and `refreshToken`

3. **Use the cookies** in subsequent requests to admin endpoints

### Creating an Admin User

If you don't have an admin user, you need to:

1. Register a normal user via `/auth/register`
2. Manually update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@wemakeover.com" },
     { $set: { role: "admin" } }
   );
   ```

---

## 🧪 Testing Guide

### Prerequisites
1. Server running on `http://localhost:3000`
2. MongoDB connected
3. Admin user created with role = "admin"

### Test Flow

#### Step 1: Login as Admin
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@wemakeover.com",
  "password": "YourPassword123!"
}
```

**Expected**: Cookies set with `accessToken` and `refreshToken`

#### Step 2: Get Dashboard Metrics
```bash
GET http://localhost:3000/api/admin/dashboard/metrics
Cookie: accessToken=<your_token>; refreshToken=<your_token>
```

**Expected**: JSON with totalUsers, totalBookings, totalRevenue, upcomingBookings

#### Step 3: Get Today's Bookings
```bash
GET http://localhost:3000/api/admin/dashboard/today-bookings?page=1&limit=10
Cookie: accessToken=<your_token>; refreshToken=<your_token>
```

**Expected**: Array of today's bookings with pagination

#### Step 4: Get Recent Activity
```bash
GET http://localhost:3000/api/admin/dashboard/recent-activity?limit=5
Cookie: accessToken=<your_token>; refreshToken=<your_token>
```

**Expected**: Recent bookings, enquiries, and users

#### Step 5: Get Statistics
```bash
GET http://localhost:3000/api/admin/dashboard/stats
Cookie: accessToken=<your_token>; refreshToken=<your_token>
```

**Expected**: Booking/payment breakdown and monthly revenue

---

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "loggedIn": false,
  "message": "No access & refresh token"
}
```

### 403 Forbidden (Not Admin)
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to fetch dashboard metrics",
  "error": "Error details here"
}
```

---

## 📝 Notes

1. **Cookies**: All authentication uses HTTP-only cookies for security
2. **Pagination**: Default limit is 10 items per page
3. **Date Calculations**: All dates use server timezone
4. **Growth Calculations**: 
   - Users: Compared to yesterday
   - Bookings: Compared to last week
   - Revenue: Compared to yesterday
   - Upcoming: Compared to yesterday

---

## 🔄 Data Models Used

- **User Model**: For total users count
- **Booking Model**: For bookings, revenue, and upcoming bookings
- **Payment Model**: For payment tracking
- **Enquiry Model**: For enquiry tracking

---

## 📊 Metrics Calculation Logic

### Total Users
- Count all documents in `users` collection
- Growth: Compare with users created before yesterday

### Total Bookings
- Count all documents in `bookings` collection
- Growth: Compare with bookings created before last week

### Total Revenue
- Sum `pricing.totalAmount` from bookings where `paymentStatus = 'completed'`
- Growth: Compare with revenue before yesterday

### Upcoming Bookings
- Count bookings where:
  - `bookingDetails.date >= today`
  - `status IN ['pending', 'confirmed']`
- Growth: Compare with upcoming bookings created before yesterday

---

## ✅ Success Criteria

- ✅ All endpoints return 200 status with valid admin token
- ✅ Non-admin users receive 403 Forbidden
- ✅ Unauthenticated requests receive 401 Unauthorized
- ✅ Metrics show accurate counts from database
- ✅ Pagination works correctly
- ✅ Growth percentages calculated accurately

---

**Last Updated**: January 12, 2026
**API Version**: 1.0.0
