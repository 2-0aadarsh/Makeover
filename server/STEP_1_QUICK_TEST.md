# ⚡ Step 1: Image Upload - Quick Test Guide

## 🚀 3-Minute Test

### **Prerequisites**
1. Server running: `npm run dev`
2. Logged in as admin
3. Cloudinary configured in `.env`

---

## 📋 Test APIs

### **1. Test Single Image Upload**

**Postman**:
```
POST http://localhost:3000/api/admin/upload/test

Body: form-data
├─ image (File): [Select an image file .jpg/.png]
```

**cURL**:
```bash
curl -X POST http://localhost:3000/api/admin/upload/test \
  -F "image=@/path/to/your/image.jpg" \
  -b cookies.txt
```

**Expected**: Returns `{ success: true, data: { url, publicId } }`

---

### **2. Test Multiple Images**

**Postman**:
```
POST http://localhost:3000/api/admin/upload/multiple

Body: form-data
├─ images (File): [Select image 1]
├─ images (File): [Select image 2]
├─ images (File): [Select image 3]
```

**Expected**: Returns array of uploaded images

---

### **3. Test Delete Image**

**Postman**:
```
DELETE http://localhost:3000/api/admin/upload/wemakeover%2Ftest-uploads%2Fabc123

(Replace abc123 with actual publicId from upload response)
```

**Expected**: Returns `{ success: true }`

---

## ✅ Success Indicators

1. ✅ Upload returns Cloudinary URL
2. ✅ Image visible in Cloudinary dashboard
3. ✅ File size validation works (try file > 5MB)
4. ✅ File type validation works (try .pdf file)
5. ✅ Delete removes image from Cloudinary

---

## 🔄 How to Switch to S3 (Future)

1. Install SDK: `npm install @aws-sdk/client-s3`
2. Update `.env`:
   ```env
   IMAGE_UPLOAD_PROVIDER=s3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   AWS_S3_BUCKET=wemakeover
   ```
3. Uncomment code in `s3.provider.js`
4. Restart server

**No other code changes needed!**

---

## 📊 Response Format

### Upload Success
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "wemakeover/test-uploads/abc123",
    "provider": "cloudinary",
    "fileInfo": {
      "originalName": "image.jpg",
      "size": 245678,
      "mimetype": "image/jpeg"
    }
  }
}
```

### Validation Error
```json
{
  "success": false,
  "message": "File validation failed",
  "errors": [
    "File size (6.5MB) exceeds maximum allowed size of 5MB"
  ]
}
```

---

## 🎯 Next: Step 2 (Category Management)

Once image upload is tested and working:
- Create Category model
- Create Category CRUD APIs
- Use image upload for category images

---

**Step 1 Status**: ✅ COMPLETE
**Ready for**: Step 2 (Category Management)
