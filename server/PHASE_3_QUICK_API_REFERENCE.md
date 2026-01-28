# ⚡ Phase 3: Quick API Reference

## 📋 **Booking Management APIs**

### **Base URL**: `/api/admin/bookings`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/` | Get all bookings with filters |
| 2 | GET | `/:id` | Get single booking details |
| 3 | PATCH | `/:id/status` | Update booking status |
| 4 | PATCH | `/:id/payment-status` | Update payment status |
| 5 | POST | `/:id/cancel` | Cancel booking |
| 6 | GET | `/analytics` | Get booking analytics |

---

## 👥 **Customer Management APIs**

### **Base URL**: `/api/admin/customers`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 7 | GET | `/` | Get all customers |
| 8 | GET | `/:id` | Get customer details |
| 9 | GET | `/stats` | Get customer statistics |

---

## 🚀 **Quick Copy-Paste URLs**

### Booking APIs

```
# List all bookings
GET http://localhost:3000/api/admin/bookings?page=1&limit=10

# Filter by status
GET http://localhost:3000/api/admin/bookings?status=completed

# Search bookings
GET http://localhost:3000/api/admin/bookings?search=Sanjana

# Date range filter
GET http://localhost:3000/api/admin/bookings?startDate=2025-01-01&endDate=2025-01-31

# Get booking details
GET http://localhost:3000/api/admin/bookings/{BOOKING_ID}

# Update booking status
PATCH http://localhost:3000/api/admin/bookings/{BOOKING_ID}/status
Body: {"status": "confirmed", "adminNote": "Confirmed"}

# Update payment status
PATCH http://localhost:3000/api/admin/bookings/{BOOKING_ID}/payment-status
Body: {"paymentStatus": "completed", "adminNote": "Payment verified"}

# Cancel booking
POST http://localhost:3000/api/admin/bookings/{BOOKING_ID}/cancel
Body: {"reason": "Customer request", "refundEligible": true}

# Get analytics
GET http://localhost:3000/api/admin/bookings/analytics
```

### Customer APIs

```
# List all customers
GET http://localhost:3000/api/admin/customers?page=1&limit=10

# Search customers
GET http://localhost:3000/api/admin/customers?search=Sanjana

# Get customer details
GET http://localhost:3000/api/admin/customers/{CUSTOMER_ID}

# Get customer stats
GET http://localhost:3000/api/admin/customers/stats
```

---

## 📝 **Common Query Parameters**

### Pagination
- `page` (default: 1)
- `limit` (default: 10)

### Sorting
- `sortBy` (default: createdAt)
- `sortOrder` (asc/desc, default: desc)

### Filters (Bookings)
- `status` (pending/confirmed/completed/cancelled)
- `paymentStatus` (pending/completed/failed)
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `search` (customer name/email/phone/booking ID)

### Filters (Customers)
- `search` (name/email/phone)

---

## 🔑 **Request Body Examples**

### Update Booking Status
```json
{
  "status": "confirmed",
  "adminNote": "Optional admin note"
}
```

**Valid statuses**: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`

### Update Payment Status
```json
{
  "paymentStatus": "completed",
  "adminNote": "Optional admin note"
}
```

**Valid payment statuses**: `pending`, `processing`, `completed`, `failed`, `refunded`, `partially_refunded`

### Cancel Booking
```json
{
  "reason": "Cancellation reason",
  "refundEligible": true
}
```

---

## ✅ **Testing Checklist**

### Booking APIs
- [ ] List all bookings (no filters)
- [ ] Filter by status (completed)
- [ ] Filter by payment status (completed)
- [ ] Search by customer name
- [ ] Filter by date range
- [ ] Get single booking details
- [ ] Update booking status
- [ ] Update payment status
- [ ] Cancel booking
- [ ] Get booking analytics

### Customer APIs
- [ ] List all customers
- [ ] Search customers
- [ ] Get customer details
- [ ] Get customer statistics

---

## 🎯 **Expected Response Format**

All responses follow this structure:

```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

---

## 🚨 **Common Error Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Server Error |

---

## 💡 **Pro Tips**

1. **Login first**: Use `/auth/login` to get cookies
2. **Use Postman**: Import `POSTMAN_PHASE_3_BOOKINGS.json`
3. **Set variables**: Save `BOOKING_ID` and `CUSTOMER_ID` as variables
4. **Test filters**: Try different combinations
5. **Check pagination**: Test with different page/limit values

---

**Total APIs**: 9 endpoints
**Phase**: 3 (Booking & Customer Management)
**Status**: ✅ Ready for Testing
