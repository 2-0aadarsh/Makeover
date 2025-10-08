# 🎯 Complete Booking System - Postman Guide

## 🚀 **System Overview**

The booking system implements a **security-first approach** with comprehensive validation:

1. **Cart Validation**: Ensures cart data consistency between frontend and database
2. **Address Validation**: Validates selected/default address
3. **Time Slot Validation**: Checks slot availability and capacity
4. **Service Validation**: Ensures all services are still available
5. **Payment Validation**: Validates payment method (COD only for now)
6. **Atomic Booking**: Uses MongoDB transactions for data consistency

---

## 📋 **API Endpoints**

### **Base URL**: `http://localhost:3000/api/bookings`

---

## 🔐 **Authentication Setup**

### **1. Login as User**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### **2. Login as Admin**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## 🛒 **Step 1: Setup Cart Data**

### **Add Items to Cart**
```http
POST http://localhost:3000/api/cart/save
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "items": [
    {
      "serviceId": "vitamin_c_brightening_facial_regular",
      "cardHeader": "Vitamin C Brightening Facial",
      "description": "Restores luminosity and evens skin tone with the power of Vitamin C",
      "price": 1600,
      "img": "/src/assets/modals/cleanup%20and%20facical/regular/VitaminCBrighteningFacial.png",
      "quantity": 1,
      "duration": "60 mins",
      "taxIncluded": true,
      "category": "Regular",
      "serviceType": "Standard"
    },
    {
      "serviceId": "face_neck_detan_classic",
      "cardHeader": "Face & Neck De-Tan",
      "description": "Step into softness with our expertly done hand and leg premium de-tan treatment.",
      "price": 1600,
      "img": "/src/assets/modals/bleach%20and%20de-tan/classic/faceAndNeckDetan.png",
      "quantity": 2,
      "duration": "45 mins",
      "taxIncluded": true,
      "category": "Classic",
      "serviceType": "Standard"
    }
  ]
}
```

---

## 🏠 **Step 2: Setup Address**

### **Create Address**
```http
POST http://localhost:3000/api/addresses
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "houseFlatNumber": "123",
  "streetAreaName": "Main Street",
  "completeAddress": "Near City Mall",
  "landmark": "Opposite Bank",
  "pincode": "123456",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "addressType": "home"
}
```

### **Get User Addresses**
```http
GET http://localhost:3000/api/addresses
Authorization: Bearer {{user_token}}
```

---

## ⏰ **Step 3: Setup Time Slots**

### **Admin: Setup Working Days**
```http
PUT http://localhost:3000/api/working-days/admin/bulk
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "workingDays": [
    {
      "dayOfWeek": 0,
      "isWorking": true,
      "startTime": "10:00",
      "endTime": "16:00",
      "breakStart": null,
      "breakEnd": null
    },
    {
      "dayOfWeek": 1,
      "isWorking": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "breakStart": "13:00",
      "breakEnd": "14:00"
    },
    {
      "dayOfWeek": 2,
      "isWorking": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "breakStart": "13:00",
      "breakEnd": "14:00"
    },
    {
      "dayOfWeek": 3,
      "isWorking": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "breakStart": "13:00",
      "breakEnd": "14:00"
    },
    {
      "dayOfWeek": 4,
      "isWorking": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "breakStart": "13:00",
      "breakEnd": "14:00"
    },
    {
      "dayOfWeek": 5,
      "isWorking": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "breakStart": "13:00",
      "breakEnd": "14:00"
    },
    {
      "dayOfWeek": 6,
      "isWorking": true,
      "startTime": "10:00",
      "endTime": "16:00",
      "breakStart": null,
      "breakEnd": null
    }
  ]
}
```

### **Admin: Generate Slots for Next 30 Days**
```http
GET http://localhost:3000/api/slot-automation/generate-next?days=30
Authorization: Bearer {{admin_token}}
```

### **Get Available Slots for Date**
```http
GET http://localhost:3000/api/daily-slots/2025-01-15/available
```

**Response:**
```json
{
  "success": true,
  "message": "Available slots retrieved successfully",
  "data": {
    "date": "2025-01-15T00:00:00.000Z",
    "totalSlots": 6,
    "availableSlots": 6,
    "slots": [
      {
        "id": "slot_id_1",
        "startTime": "10:00",
        "endTime": "11:00",
        "maxBookings": 5,
        "currentBookings": 0,
        "availableSlots": 5,
        "duration": 60
      }
    ]
  }
}
```

---

## 🎯 **Step 4: Create Booking**

### **Create New Booking**
```http
POST http://localhost:3000/api/bookings
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "cartData": {
    "items": [
      {
        "serviceId": "vitamin_c_brightening_facial_regular",
        "cardHeader": "Vitamin C Brightening Facial",
        "description": "Restores luminosity and evens skin tone with the power of Vitamin C",
        "price": 1600,
        "img": "/src/assets/modals/cleanup%20and%20facical/regular/VitaminCBrighteningFacial.png",
        "quantity": 1,
        "duration": "60 mins",
        "taxIncluded": true,
        "category": "Regular",
        "serviceType": "Standard"
      }
    ],
    "summary": {
      "totalServices": 1,
      "totalItems": 1,
      "subtotal": 1600,
      "taxAmount": 288,
      "total": 1888
    }
  },
  "addressId": "address_id_here",
  "slotId": "slot_id_here",
  "date": "2025-01-15",
  "paymentMethod": "cod"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "booking_id_here",
      "user": "user_id_here",
      "bookingStatus": "pending",
      "bookingDate": "2025-01-15T00:00:00.000Z",
      "timeSlot": {
        "slotId": "slot_id_here",
        "startTime": "10:00",
        "endTime": "11:00",
        "dailySlotsId": "daily_slots_id_here"
      },
      "services": [
        {
          "serviceId": "vitamin_c_brightening_facial_regular",
          "name": "Vitamin C Brightening Facial",
          "price": 1600,
          "quantity": 1,
          "subtotal": 1600
        }
      ],
      "serviceSummary": {
        "totalServices": 1,
        "totalItems": 1,
        "subtotal": 1600,
        "taxAmount": 288,
        "total": 1888
      },
      "deliveryAddress": {
        "houseFlatNumber": "123",
        "streetAreaName": "Main Street",
        "completeAddress": "Near City Mall",
        "pincode": "123456",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India"
      },
      "paymentMethod": "cod",
      "paymentStatus": "pending",
      "totalAmount": 1888,
      "createdAt": "2025-01-15T10:30:00.000Z"
    },
    "paymentData": {
      "paymentMethod": "cod",
      "status": "pending",
      "amount": 1888,
      "message": "Payment will be collected on service delivery"
    },
    "cartCleared": true
  }
}
```

---

## 📋 **Step 5: Manage Bookings**

### **Get User's Bookings**
```http
GET http://localhost:3000/api/bookings
Authorization: Bearer {{user_token}}
```

### **Get User's Bookings with Pagination**
```http
GET http://localhost:3000/api/bookings?page=1&limit=10&status=pending
Authorization: Bearer {{user_token}}
```

### **Get Bookings by User ID**
```http
GET http://localhost:3000/api/bookings/user/user_id_here
Authorization: Bearer {{user_token}}
```

### **Get Specific Booking Details**
```http
GET http://localhost:3000/api/bookings/booking_id_here
Authorization: Bearer {{user_token}}
```

---

## ❌ **Step 6: Cancel Booking**

### **Cancel Booking**
```http
PATCH http://localhost:3000/api/bookings/booking_id_here/cancel
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "booking": {
      "_id": "booking_id_here",
      "bookingStatus": "cancelled",
      "cancelledAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

---

## 📅 **Step 7: Reschedule Booking**

### **Reschedule Booking**
```http
PATCH http://localhost:3000/api/bookings/booking_id_here/reschedule
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "newDate": "2025-01-16",
  "newSlotId": "new_slot_id_here",
  "reason": "Need to change date"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking rescheduled successfully",
  "data": {
    "booking": {
      "_id": "booking_id_here",
      "bookingStatus": "rescheduled",
      "bookingDate": "2025-01-16T00:00:00.000Z",
      "timeSlot": {
        "slotId": "new_slot_id_here",
        "startTime": "11:00",
        "endTime": "12:00"
      }
    }
  }
}
```

---

## 👑 **Admin Operations**

### **Get All Bookings (Admin)**
```http
GET http://localhost:3000/api/bookings/admin/all
Authorization: Bearer {{admin_token}}
```

### **Update Booking Status (Admin)**
```http
PATCH http://localhost:3000/api/bookings/admin/booking_id_here/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Booking confirmed by admin"
}
```

### **Get Booking Statistics (Admin)**
```http
GET http://localhost:3000/api/bookings/admin/statistics
Authorization: Bearer {{admin_token}}
```

---

## 🔒 **Security Features**

### **1. Cart Data Validation**
- Force saves cart data before booking
- Validates consistency between frontend and database
- Uses database cart as source of truth

### **2. Address Validation**
- Validates selected address belongs to user
- Falls back to default address if none selected
- Ensures address is active

### **3. Time Slot Validation**
- Checks slot availability
- Validates capacity
- Locks slot during booking creation

### **4. Service Validation**
- Ensures all services still exist
- Validates service availability
- Prevents booking unavailable services

### **5. Payment Validation**
- Validates payment method
- Handles COD payment flow
- Ensures payment data integrity

### **6. Atomic Operations**
- Uses MongoDB transactions
- Ensures data consistency
- Handles rollback on errors

---

## 📊 **Booking States**

### **State Flow:**
```
pending → confirmed → completed
pending → cancelled
confirmed → rescheduled
confirmed → cancelled
```

### **Status Meanings:**
- **pending**: Booking created, awaiting confirmation
- **confirmed**: Booking confirmed by admin
- **completed**: Service completed successfully
- **cancelled**: Booking cancelled by user/admin
- **rescheduled**: Booking rescheduled to different date/time

---

## 🚨 **Error Handling**

### **Common Error Responses:**

#### **Cart Empty**
```json
{
  "success": false,
  "message": "Cart is empty. Please add services before booking."
}
```

#### **No Address Found**
```json
{
  "success": false,
  "message": "No default address found. Please select an address for booking.",
  "code": "NO_DEFAULT_ADDRESS"
}
```

#### **Slot Not Available**
```json
{
  "success": false,
  "message": "Selected time slot is not available.",
  "code": "SLOT_NOT_AVAILABLE"
}
```

#### **Slot Full**
```json
{
  "success": false,
  "message": "Time slot is fully booked.",
  "code": "SLOT_FULL"
}
```

#### **Duplicate Booking**
```json
{
  "success": false,
  "message": "Duplicate booking attempt detected. Please wait before trying again.",
  "code": "DUPLICATE_BOOKING_ATTEMPT"
}
```

---

## 🎯 **Complete Booking Flow Example**

### **1. Setup Environment**
```bash
# Set variables in Postman
user_token = "jwt_token_from_login"
admin_token = "jwt_token_from_admin_login"
address_id = "address_id_from_create_address"
slot_id = "slot_id_from_get_available_slots"
booking_id = "booking_id_from_create_booking"
```

### **2. Execute Booking Flow**
1. **Login** → Get user token
2. **Add to Cart** → Setup cart data
3. **Create Address** → Setup address
4. **Get Available Slots** → Select slot
5. **Create Booking** → Complete booking
6. **Get Bookings** → Verify booking
7. **Cancel/Reschedule** → Test modifications

### **3. Admin Operations**
1. **Admin Login** → Get admin token
2. **Setup Working Days** → Configure availability
3. **Generate Slots** → Create time slots
4. **Get All Bookings** → View all bookings
5. **Update Status** → Manage booking status

---

## ✅ **Testing Checklist**

- [ ] User can create booking with valid data
- [ ] Cart is cleared after successful booking
- [ ] Address validation works correctly
- [ ] Time slot capacity is properly managed
- [ ] Duplicate booking prevention works
- [ ] Booking cancellation works
- [ ] Booking rescheduling works
- [ ] Admin can manage all bookings
- [ ] Error handling works for all scenarios
- [ ] Payment flow works for COD

---

## 🎉 **Ready to Use!**

The booking system is now **fully functional** with:
- ✅ **Security-first approach**
- ✅ **Comprehensive validation**
- ✅ **Atomic operations**
- ✅ **COD payment support**
- ✅ **Complete CRUD operations**
- ✅ **Admin management**

**Happy Booking!** 🚀
