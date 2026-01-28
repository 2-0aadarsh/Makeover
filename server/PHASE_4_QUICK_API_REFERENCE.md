# ⚡ Phase 4: Enquiry Management APIs - Quick Reference

## 📋 **Enquiry Management APIs**

### **Base URL**: `/api/admin/enquiries`

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/` | Get all enquiries with filters |
| 2 | GET | `/:id` | Get single enquiry details |
| 3 | PATCH | `/:id/status` | Update enquiry status |
| 4 | PATCH | `/:id/assign` | Assign enquiry to admin |
| 5 | POST | `/:id/notes` | Add admin note |
| 6 | GET | `/stats` | Get enquiry statistics |

---

## 🚀 **Quick Copy-Paste URLs**

### Get All Enquiries
```
GET http://localhost:3000/api/admin/enquiries?page=1&limit=10
```

### Filter by Status
```
GET http://localhost:3000/api/admin/enquiries?status=pending
```

### Filter by Priority
```
GET http://localhost:3000/api/admin/enquiries?priority=high
```

### Filter by Source (Service Type)
```
GET http://localhost:3000/api/admin/enquiries?source=professional-makeup
```

### Search Enquiries
```
GET http://localhost:3000/api/admin/enquiries?search=Sanjana
```

### Date Range Filter
```
GET http://localhost:3000/api/admin/enquiries?startDate=2025-01-01&endDate=2025-01-31
```

### Get Enquiry Details
```
GET http://localhost:3000/api/admin/enquiries/{ENQUIRY_ID}
```

### Update Enquiry Status
```
PATCH http://localhost:3000/api/admin/enquiries/{ENQUIRY_ID}/status
Body: {"status": "contacted", "adminNote": "Called customer"}
```

### Assign Enquiry
```
PATCH http://localhost:3000/api/admin/enquiries/{ENQUIRY_ID}/assign
Body: {"assignedTo": "ADMIN_USER_ID"}
```

### Add Admin Note
```
POST http://localhost:3000/api/admin/enquiries/{ENQUIRY_ID}/notes
Body: {"note": "Customer interested in Bridal Makeup", "internalComment": "Follow up needed"}
```

### Get Enquiry Statistics
```
GET http://localhost:3000/api/admin/enquiries/stats
```

---

## 📝 **Request Body Examples**

### Update Enquiry Status
```json
{
  "status": "contacted",
  "adminNote": "Called customer - interested in Bridal Makeup"
}
```

**Valid statuses**: `pending`, `contacted`, `quoted`, `converted`, `cancelled`

### Assign Enquiry
```json
{
  "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**To remove assignment**:
```json
{
  "assignedTo": null
}
```

### Add Admin Note
```json
{
  "note": "Customer called back - ready to book",
  "internalComment": "High priority - follow up today"
}
```

**Note**: Either `note` or `internalComment` is required (or both)

---

## 📊 **Query Parameters**

### Common Parameters
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: createdAt)
- `sortOrder` (asc/desc, default: desc)

### Filters
- `status` (pending/contacted/quoted/converted/cancelled)
- `priority` (low/medium/high)
- `source` (professional-makeup, professional-mehendi, bleach-detan, facial, hair-care, waxing, pedicure-manicure, other)
- `assignedTo` (Admin User ID)
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `search` (customer name/email/phone/enquiry number/service name)

---

## ✅ **Expected Response Format**

All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

---

## 🔐 **Authentication**

All endpoints require:
1. Login via `POST /auth/login`
2. Admin role (`role: "admin"`)
3. Cookies (JWT tokens sent automatically)

---

## 🎯 **Valid Values**

### Status
- `pending`
- `contacted`
- `quoted`
- `converted`
- `cancelled`

### Priority
- `low`
- `medium`
- `high`

### Source (Service Types)
- `professional-makeup`
- `professional-mehendi`
- `bleach-detan`
- `facial`
- `hair-care`
- `waxing`
- `pedicure-manicure`
- `other`

---

**Total APIs**: 6 endpoints  
**Phase**: 4 (Enquiry Management)  
**Status**: ✅ Ready for Testing
