# ⚡ Quick Test - Phase 2 Dashboard APIs

## 🚀 5-Minute Test Guide

### Step 1: Start Server (30 seconds)
```bash
cd server
npm run dev
```
✅ Check: Server running on http://localhost:3000

---

### Step 2: Create Admin User (1 minute)

**Option A - If you have a user already:**
```javascript
// MongoDB Shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Option B - Create new admin:**
1. Register via `/auth/register`
2. Verify email/OTP
3. Update role to "admin" in MongoDB

---

### Step 3: Test with cURL (3 minutes)

#### 3.1 Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wemakeover.com","password":"YourPassword"}' \
  -c cookies.txt
```
✅ Check: Returns `"success": true` and creates `cookies.txt`

#### 3.2 Get Metrics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/metrics -b cookies.txt
```
✅ Check: Returns totalUsers, totalBookings, totalRevenue, upcomingBookings

#### 3.3 Get Today's Bookings
```bash
curl -X GET "http://localhost:3000/api/admin/dashboard/today-bookings?page=1&limit=5" -b cookies.txt
```
✅ Check: Returns bookings array and pagination

#### 3.4 Get Recent Activity
```bash
curl -X GET "http://localhost:3000/api/admin/dashboard/recent-activity?limit=3" -b cookies.txt
```
✅ Check: Returns recentBookings, recentEnquiries, recentUsers

#### 3.5 Get Statistics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/stats -b cookies.txt
```
✅ Check: Returns bookingStatusBreakdown, paymentStatusBreakdown, monthlyRevenue

---

## ✅ All Tests Pass?

If all 5 endpoints return `"success": true`:

🎉 **PHASE 2 COMPLETE!**

Ready for Phase 3: Booking Management APIs

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "No access token" | Login first (step 3.1) |
| "Admin access required" | Update user role to "admin" |
| Empty bookings | Normal if no bookings exist for today |
| Metrics show 0 | Normal if database is empty |
| Connection refused | Check server is running |

---

## 📊 Expected Response (Metrics)

```json
{
  "success": true,
  "message": "Dashboard metrics retrieved successfully",
  "data": {
    "totalUsers": {
      "count": 123,
      "growth": 4.5,
      "trend": "up"
    },
    "totalBookings": {
      "count": 456,
      "growth": 2.3,
      "trend": "up"
    },
    "totalRevenue": {
      "amount": 89000,
      "formattedAmount": "₹89,000",
      "growth": 2.8,
      "trend": "up"
    },
    "upcomingBookings": {
      "count": 78,
      "growth": 1.8,
      "trend": "up"
    }
  }
}
```

---

## 📦 Postman Alternative

**Prefer Postman?**

1. Import `POSTMAN_ADMIN_DASHBOARD.json`
2. Run "Login as Admin"
3. Run all dashboard endpoints
4. Check test results (should all pass ✅)

---

## 🎯 Next Steps

After testing Phase 2:

1. ✅ Verify all endpoints work
2. ✅ Check metrics are accurate
3. ✅ Test pagination
4. ✅ Test status filters
5. 🚀 **Move to Phase 3: Booking Management**

---

**Phase 2**: ✅ Dashboard APIs
**Phase 3**: 📋 Booking Management (Next)
**Phase 4**: 👥 Customer Management
**Phase 5**: 💬 Enquiry Management
**Phase 6**: 🛠️ Service Management

---

**Quick Test Time**: ~5 minutes
**Full Test Time**: ~15 minutes (with Postman)
