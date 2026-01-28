# Phase 3: Booking & Customer Management APIs - Documentation

## 🎯 Overview

Phase 3 implements comprehensive **Booking Management** and **Customer Management** APIs for the admin panel, matching your Figma "Bookings & Customers" page design.

**Base URL**: `http://localhost:3000/api/admin`

**Authentication**: All endpoints require:
1. Valid JWT token (in cookies: `accessToken`)
2. User role must be `admin`

---

## 📋 BOOKING MANAGEMENT APIs

### 1. Get All Bookings (with Filters)

**Endpoint**: `GET /api/admin/bookings`

**Description**: Retrieve all bookings with advanced filtering, search, and pagination.

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 10 | Items per page |
| `status` | String | No | - | Filter by: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show` |
| `paymentStatus` | String | No | - | Filter by: `pending`, `processing`, `completed`, `failed`, `refunded` |
| `startDate` | Date | No | - | Filter bookings from this date (YYYY-MM-DD) |
| `endDate` | Date | No | - | Filter bookings until this date (YYYY-MM-DD) |
| `search` | String | No | - | Search by customer name, email, phone, or booking ID |
| `sortBy` | String | No | `createdAt` | Sort by field |
| `sortOrder` | String | No | `desc` | Sort order: `asc` or `desc` |

**Example Requests**:
```
GET /api/admin/bookings?page=1&limit=10
GET /api/admin/bookings?status=completed&page=1
GET /api/admin/bookings?search=Sanjana
GET /api/admin/bookings?startDate=2025-01-01&endDate=2025-01-31
GET /api/admin/bookings?status=pending&paymentStatus=completed
```

**Response**:
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": {
    "bookings": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "bookingId": "BOOK-2025-1736678400000-1234",
        "customerName": "Sanjana Singh",
        "phoneNumber": "9431987878",
        "email": "sanjanasingh2@gmail.com",
        "bookingDate": "2025-01-12T00:00:00.000Z",
        "bookingSlot": "01:00-01:30 PM",
        "dateTime": "12/01/2025 - 01:00-01:30 PM",
        "status": "completed",
        "paymentStatus": "completed",
        "totalAmount": 1499,
        "formattedAmount": "₹1,499",
        "servicesCount": 1,
        "createdAt": "2025-01-12T10:30:00.000Z",
        "canBeCancelled": false,
        "canBeRescheduled": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 40,
      "totalBookings": 259,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "totalBookings": 10293,
      "pending": 1245,
      "confirmed": 2314,
      "in_progress": 450,
      "completed": 5234,
      "cancelled": 1500,
      "no_show": 50
    }
  }
}
```

---

### 2. Get Single Booking Details

**Endpoint**: `GET /api/admin/bookings/:id`

**Description**: Get detailed information about a specific booking.

**URL Parameters**:
- `id` - Booking ID (MongoDB ObjectId)

**Example Request**:
```
GET /api/admin/bookings/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response**:
```json
{
  "success": true,
  "message": "Booking details retrieved successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "BOOK-2025-1736678400000-1234",
    "customer": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Sanjana Singh",
      "email": "sanjanasingh2@gmail.com",
      "phoneNumber": "9431987878"
    },
    "services": [
      {
        "name": "Hand & Leg (Classic)",
        "description": "Waxing service",
        "category": "Regular",
        "price": 1499,
        "quantity": 1,
        "duration": 45,
        "subtotal": 1499
      },
      {
        "name": "De-Tan Facial",
        "description": "Cleanup & Facial",
        "category": "Regular",
        "price": 999,
        "quantity": 2,
        "duration": 60,
        "subtotal": 1998
      }
    ],
    "bookingDetails": {
      "date": "2025-01-12T00:00:00.000Z",
      "slot": "01:00-01:30 PM",
      "duration": 165,
      "address": {
        "houseFlatNumber": "123",
        "streetAreaName": "MG Road",
        "completeAddress": "123, MG Road, Gaya",
        "landmark": "Near City Mall",
        "city": "Gaya",
        "state": "Bihar",
        "pincode": "823001",
        "country": "India",
        "phone": "9431987878"
      }
    },
    "pricing": {
      "subtotal": 3497,
      "taxAmount": 629,
      "totalAmount": 4126,
      "formattedTotal": "₹4,126",
      "currency": "INR"
    },
    "status": "completed",
    "paymentStatus": "completed",
    "paymentDetails": {
      "razorpayOrderId": "order_xyz123",
      "razorpayPaymentId": "pay_abc456",
      "paymentMethod": "online",
      "paidAt": "2025-01-12T10:35:00.000Z"
    },
    "notes": {
      "customer": "Please arrive on time",
      "admin": "VIP customer"
    },
    "canBeCancelled": false,
    "canBeRescheduled": false,
    "createdAt": "2025-01-12T10:30:00.000Z",
    "updatedAt": "2025-01-12T15:00:00.000Z"
  }
}
```

---

### 3. Update Booking Status

**Endpoint**: `PATCH /api/admin/bookings/:id/status`

**Description**: Update the status of a booking.

**URL Parameters**:
- `id` - Booking ID

**Body**:
```json
{
  "status": "confirmed",
  "adminNote": "Confirmed by admin - customer called"
}
```

**Valid Status Values**:
- `pending`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`
- `no_show`

**Response**:
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "BOOK-2025-1736678400000-1234",
    "status": "confirmed",
    "updatedAt": "2025-01-12T16:00:00.000Z"
  }
}
```

---

### 4. Update Payment Status

**Endpoint**: `PATCH /api/admin/bookings/:id/payment-status`

**Description**: Update the payment status of a booking.

**URL Parameters**:
- `id` - Booking ID

**Body**:
```json
{
  "paymentStatus": "completed",
  "adminNote": "Payment verified manually"
}
```

**Valid Payment Status Values**:
- `pending`
- `processing`
- `completed`
- `failed`
- `refunded`
- `partially_refunded`

**Response**:
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "BOOK-2025-1736678400000-1234",
    "paymentStatus": "completed",
    "status": "confirmed",
    "updatedAt": "2025-01-12T16:00:00.000Z"
  }
}
```

---

### 5. Cancel Booking

**Endpoint**: `POST /api/admin/bookings/:id/cancel`

**Description**: Cancel a booking (admin action).

**URL Parameters**:
- `id` - Booking ID

**Body**:
```json
{
  "reason": "Customer requested cancellation due to emergency",
  "refundEligible": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "orderNumber": "BOOK-2025-1736678400000-1234",
    "status": "cancelled",
    "cancellationDetails": {
      "cancelledAt": "2025-01-12T16:00:00.000Z",
      "cancelledBy": "admin",
      "cancellationReason": "Customer requested cancellation due to emergency",
      "refundEligible": true
    }
  }
}
```

---

### 6. Get Booking Analytics

**Endpoint**: `GET /api/admin/bookings/analytics`

**Description**: Get comprehensive booking analytics and statistics.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | Date | No | Analytics from this date |
| `endDate` | Date | No | Analytics until this date |

**Example Request**:
```
GET /api/admin/bookings/analytics
GET /api/admin/bookings/analytics?startDate=2025-01-01&endDate=2025-01-31
```

**Response**:
```json
{
  "success": true,
  "message": "Booking analytics retrieved successfully",
  "data": {
    "bookingsByStatus": [
      {
        "_id": "completed",
        "count": 5234,
        "totalRevenue": 7850000
      },
      {
        "_id": "confirmed",
        "count": 2314,
        "totalRevenue": 3470000
      }
    ],
    "revenueByPaymentStatus": [
      {
        "_id": "completed",
        "count": 7548,
        "totalRevenue": 11320000
      },
      {
        "_id": "pending",
        "count": 1245,
        "totalRevenue": 1870000
      }
    ],
    "topServices": [
      {
        "serviceName": "Bridal Makeup",
        "bookingCount": 450,
        "totalQuantity": 450,
        "totalRevenue": 5400000,
        "formattedRevenue": "₹54,00,000"
      },
      {
        "serviceName": "De-Tan Facial",
        "bookingCount": 380,
        "totalQuantity": 520,
        "totalRevenue": 5200000,
        "formattedRevenue": "₹52,00,000"
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
    ],
    "summary": {
      "totalBookings": 10293,
      "cancelledBookings": 1500,
      "cancellationRate": 14.57,
      "upcomingBookings": 2040,
      "averageBookingValue": 1499,
      "totalRevenue": 15430000,
      "formattedAvgValue": "₹1,499",
      "formattedTotalRevenue": "₹1,54,30,000"
    }
  }
}
```

---

## 👥 CUSTOMER MANAGEMENT APIs

### 7. Get All Customers

**Endpoint**: `GET /api/admin/customers`

**Description**: Retrieve all customers with pagination and search.

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 10 | Items per page |
| `search` | String | No | - | Search by name, email, or phone |
| `sortBy` | String | No | `createdAt` | Sort by field |
| `sortOrder` | String | No | `desc` | Sort order: `asc` or `desc` |

**Example Requests**:
```
GET /api/admin/customers?page=1&limit=10
GET /api/admin/customers?search=Sanjana
GET /api/admin/customers?sortBy=name&sortOrder=asc
```

**Response**:
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": {
    "customers": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Sanjana Singh",
        "email": "sanjanasingh2@gmail.com",
        "phoneNumber": "9431987878",
        "city": "Gaya",
        "isVerified": true,
        "bookingCount": 5,
        "totalSpent": 7495,
        "formattedTotalSpent": "₹7,495",
        "createdAt": "2024-08-15T10:00:00.000Z",
        "lastActive": "2025-01-12T15:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 26,
      "totalCustomers": 256,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 8. Get Single Customer Details

**Endpoint**: `GET /api/admin/customers/:id`

**Description**: Get detailed information about a specific customer including booking history.

**URL Parameters**:
- `id` - Customer ID (User MongoDB ObjectId)

**Example Request**:
```
GET /api/admin/customers/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response**:
```json
{
  "success": true,
  "message": "Customer details retrieved successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Sanjana Singh",
    "email": "sanjanasingh2@gmail.com",
    "phoneNumber": "9431987878",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-08-15T10:00:00.000Z",
    "updatedAt": "2025-01-12T15:00:00.000Z",
    "bookingHistory": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "orderNumber": "BOOK-2025-1736678400000-1234",
        "date": "2025-01-12T00:00:00.000Z",
        "status": "completed",
        "paymentStatus": "completed",
        "totalAmount": 1499,
        "servicesCount": 1
      }
    ],
    "statistics": {
      "totalBookings": 5,
      "bookingsByStatus": [
        {
          "_id": "completed",
          "count": 3
        },
        {
          "_id": "pending",
          "count": 2
        }
      ],
      "totalSpent": 7495,
      "formattedTotalSpent": "₹7,495",
      "totalEnquiries": 2
    },
    "recentEnquiries": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "enquiryNumber": "ENQ000123",
        "service": "Bridal Makeup",
        "status": "pending",
        "createdAt": "2025-01-10T12:00:00.000Z"
      }
    ]
  }
}
```

---

### 9. Get Customer Statistics

**Endpoint**: `GET /api/admin/customers/stats`

**Description**: Get overall customer statistics.

**Example Request**:
```
GET /api/admin/customers/stats
```

**Response**:
```json
{
  "success": true,
  "message": "Customer statistics retrieved successfully",
  "data": {
    "totalCustomers": 256,
    "newCustomersThisMonth": 23,
    "customersWithBookings": 189,
    "customersWithoutBookings": 67,
    "topCustomers": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Sanjana Singh",
        "email": "sanjanasingh2@gmail.com",
        "phoneNumber": "9431987878",
        "totalSpent": 45000,
        "formattedTotalSpent": "₹45,000",
        "bookingCount": 15
      }
    ]
  }
}
```

---

## 🔐 Authentication

All endpoints require:
1. **Login first** via `POST /auth/login`
2. **Admin role** - user must have `role: "admin"`
3. **Cookies** - JWT tokens sent automatically

### Example Authentication Flow:

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pass"}' \
  -c cookies.txt

# 2. Use cookies in subsequent requests
curl http://localhost:3000/api/admin/bookings -b cookies.txt
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid booking ID"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "loggedIn": false,
  "message": "No access & refresh token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Booking not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to fetch bookings",
  "error": "Error details here"
}
```

---

## 📊 Summary

### Booking APIs (6 endpoints):
1. ✅ `GET /api/admin/bookings` - List all bookings
2. ✅ `GET /api/admin/bookings/:id` - Get booking details
3. ✅ `PATCH /api/admin/bookings/:id/status` - Update status
4. ✅ `PATCH /api/admin/bookings/:id/payment-status` - Update payment
5. ✅ `POST /api/admin/bookings/:id/cancel` - Cancel booking
6. ✅ `GET /api/admin/bookings/analytics` - Get analytics

### Customer APIs (3 endpoints):
7. ✅ `GET /api/admin/customers` - List all customers
8. ✅ `GET /api/admin/customers/:id` - Get customer details
9. ✅ `GET /api/admin/customers/stats` - Get customer stats

**Total**: 9 new endpoints

---

**Last Updated**: January 12, 2026  
**API Version**: 1.0.0
