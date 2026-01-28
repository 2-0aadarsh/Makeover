# ⚡ Phase 6: Quick API Reference

## 🚀 All Service & Category APIs

---

## 📋 **CATEGORY APIs**

```bash
# Create category
POST http://localhost:3000/api/admin/categories
Body (form-data): name, description, displayOrder, image

# List categories
GET http://localhost:3000/api/admin/categories

# Get category details
GET http://localhost:3000/api/admin/categories/{CATEGORY_ID}

# Update category
PUT http://localhost:3000/api/admin/categories/{CATEGORY_ID}
Body (form-data): name, description, displayOrder, image (optional)

# Delete category
DELETE http://localhost:3000/api/admin/categories/{CATEGORY_ID}

# Get services in category
GET http://localhost:3000/api/admin/categories/{CATEGORY_ID}/services

# Toggle category active
PATCH http://localhost:3000/api/admin/categories/{CATEGORY_ID}/toggle-active
```

---

## 🛠️ **SERVICE APIs**

```bash
# Create service
POST http://localhost:3000/api/admin/services
Body (form-data):
  name, description, bodyContent, price, duration,
  categoryId, ctaContent, cardType, images (multiple files)

# List all services
GET http://localhost:3000/api/admin/services?page=1&limit=20

# Filter services
GET http://localhost:3000/api/admin/services?categoryId={ID}&ctaContent=Add

# Search services
GET http://localhost:3000/api/admin/services?search=Bridal

# Get service details
GET http://localhost:3000/api/admin/services/{SERVICE_ID}

# Update service
PUT http://localhost:3000/api/admin/services/{SERVICE_ID}
Body (form-data): name, price, bodyContent, images (optional)

# Delete service
DELETE http://localhost:3000/api/admin/services/{SERVICE_ID}

# Toggle service availability
PATCH http://localhost:3000/api/admin/services/{SERVICE_ID}/toggle

# Get services by category
GET http://localhost:3000/api/admin/services/by-category/{CATEGORY_ID}

# Get service statistics
GET http://localhost:3000/api/admin/services/stats
```

---

## 🖼️ **IMAGE UPLOAD APIs**

```bash
# Test Cloudinary config
GET http://localhost:3000/api/admin/upload/test-config

# Upload single image
POST http://localhost:3000/api/admin/upload/test
Body (form-data): image

# Upload multiple images
POST http://localhost:3000/api/admin/upload/multiple
Body (form-data): images (multiple)
```

---

## 📝 **Common Request Bodies**

### **Create Category**
```
Body: form-data
├─ name: Professional Makeup
├─ description: Makeup services for all occasions
├─ displayOrder: 1
└─ image: [File]
```

### **Create Service**
```
Body: form-data
├─ name: Bridal Makeup
├─ description: We create the most elegant bridal looks
├─ bodyContent: Contact us to book yours today
├─ price: 12000
├─ duration: 60 mins
├─ categoryId: 65a1b2c3d4e5f6g7h8i9j0k1
├─ ctaContent: Add
├─ cardType: Vertical
├─ images: [File 1]
└─ images: [File 2]
```

---

## 🎯 **Valid Field Values**

### **ctaContent**:
- `"Add"`
- `"Enquire Now"`

### **cardType**:
- `"Vertical"`
- `"Horizontal"`

### **serviceType** (existing):
- `"Standard"`
- `"Premium"`
- `"Deluxe"`

---

## 🔧 **Provider Switching**

### **Use Cloudinary** (Current):
```env
IMAGE_UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Switch to S3** (Future):
```env
IMAGE_UPLOAD_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=wemakeover-images
```

**Just change env and restart!** 🔄

---

## ✅ **Testing Checklist**

### Image Upload
- [ ] Test config: `GET /upload/test-config`
- [ ] Upload image: `POST /upload/test`

### Categories
- [ ] Create category with image
- [ ] List all categories
- [ ] Get category details
- [ ] Update category
- [ ] Delete empty category
- [ ] Try delete category with services (should fail)

### Services
- [ ] Create service with images
- [ ] List all services
- [ ] Filter by category
- [ ] Get service details
- [ ] Update service (with new images)
- [ ] Toggle availability
- [ ] Delete service
- [ ] Get service statistics

---

## 📊 **Response Format**

All responses:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

---

## 🚨 **Common Errors**

### **Cloudinary Error**
```json
{
  "success": false,
  "error": "Cloudinary upload failed: cloud_name is disabled",
  "hint": "Check Cloudinary credentials in .env file"
}
```

**Fix**: Check `.env` and restart server

### **File Too Large**
```json
{
  "success": false,
  "errors": ["File size exceeds 5MB"]
}
```

**Fix**: Use smaller image

### **Invalid File Type**
```json
{
  "success": false,
  "errors": ["Invalid file type. Allowed: JPEG, PNG, WEBP"]
}
```

**Fix**: Use image file only

---

## 📚 **Documentation**

Full docs in `server/` folder:
1. `PHASE_6_COMPLETE_API_DOCUMENTATION.md` - Complete reference
2. `PHASE_6_FINAL_SUMMARY.md` - Summary
3. `CLOUDINARY_TROUBLESHOOTING.md` - Debug guide
4. `SERVICE_MODEL_MIGRATION_NOTES.md` - Migration info

---

**Phase 6**: ✅ COMPLETE  
**Total APIs**: 18 endpoints  
**Status**: Ready for testing
