# 📮 Postman Guide: Adding Categories to Database

## 🔐 Step 1: Get Authentication Token

First, you need to login as an admin user to get the authentication cookie.

### Login Request:
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

Body (JSON):
{
  "email": "your-admin-email@example.com",
  "password": "your-admin-password"
}
```

**Important:** After login, Postman will automatically save the `accessToken` and `refreshToken` cookies. Make sure cookies are enabled in Postman settings.

---

## 📋 Step 2: Create Category

### API Endpoint:
```
POST http://localhost:3000/api/admin/categories
```

### Headers:
```
Content-Type: multipart/form-data
```

**Note:** Postman will automatically set `Content-Type: multipart/form-data` when you select "form-data" in the Body tab. The authentication cookie will be sent automatically if you're using the same Postman session.

### Body (form-data):
Select **"form-data"** in Postman Body tab, then add:

| Key | Type | Value |
|-----|------|-------|
| `name` | Text | Category name (e.g., "Professional Makeup") |
| `description` | Text | Category description (optional) |
| `displayOrder` | Text | Display order number (e.g., "1") |
| `image` | File | Select an image file |

---

## 📝 Sample Category Data

Here are 6 categories to add based on your requirements:

### 1. Professional Makeup
```
name: Professional Makeup
description: Professional makeup services for all occasions
displayOrder: 1
image: [Select a makeup-related image file]
```

### 2. Cleanup & Facial
```
name: Cleanup & Facial
description: Deep cleansing and facial treatments
displayOrder: 2
image: [Select a facial/cleanup-related image file]
```

### 3. Professional Mehendi
```
name: Professional Mehendi
description: Traditional and modern mehendi designs
displayOrder: 3
image: [Select a mehendi-related image file]
```

### 4. Waxing
```
name: Waxing
description: Full body and partial waxing services
displayOrder: 4
image: [Select a waxing-related image file]
```

### 5. Manicure & Pedicure
```
name: Manicure & Pedicure
description: Nail care and grooming services
displayOrder: 5
image: [Select a nail care-related image file]
```

### 6. Bleach & De-Tan
```
name: Bleach & De-Tan
description: Skin lightening and tan removal treatments
displayOrder: 6
image: [Select a bleach/skin care-related image file]
```

---

## 🚀 Quick Steps in Postman:

1. **Set up Collection:**
   - Create a new collection: "Admin Categories"
   - Add environment variable: `baseUrl = http://localhost:3000`

2. **Login First:**
   - Create request: `POST {{baseUrl}}/api/auth/login`
   - Body (JSON): Add email and password
   - Send request
   - Check cookies are saved (View → Show Postman Console)

3. **Create Category:**
   - Create request: `POST {{baseUrl}}/api/admin/categories`
   - Body → Select **"form-data"**
   - Add fields:
     - `name` (Text)
     - `description` (Text) - optional
     - `displayOrder` (Text)
     - `image` (File) - Click "Select Files"
   - Send request

4. **Repeat for each category** with different data

---

## ✅ Expected Success Response:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Professional Makeup",
    "slug": "professional-makeup",
    "description": "Professional makeup services for all occasions",
    "image": "https://res.cloudinary.com/...",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2026-01-24T10:30:00.000Z"
  }
}
```

---

## ⚠️ Common Errors:

### 401 Unauthorized
- **Cause:** Not logged in or session expired
- **Fix:** Login again to refresh cookies

### 403 Forbidden
- **Cause:** User is not an admin
- **Fix:** Use an admin account to login

### 400 Bad Request - "Category name is required"
- **Cause:** Missing `name` field
- **Fix:** Add `name` field in form-data

### 400 Bad Request - "Category image is required"
- **Cause:** Missing `image` file
- **Fix:** Select an image file in the `image` field

### 400 Bad Request - "Category with this name already exists"
- **Cause:** Category name already in database
- **Fix:** Use a different name or update existing category

---

## 📸 Image Requirements:

- **Format:** JPG, PNG, GIF, WebP
- **Max Size:** 5MB (default)
- **Recommended:** Square images (1:1 ratio) for best display

---

## 🔄 Alternative: Using cURL

If you prefer command line:

```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Cookie: accessToken=YOUR_TOKEN_HERE" \
  -F "name=Professional Makeup" \
  -F "description=Professional makeup services for all occasions" \
  -F "displayOrder=1" \
  -F "image=@/path/to/image.jpg"
```

---

## 📚 Next Steps:

After adding categories, you can:
1. View all categories: `GET http://localhost:3000/api/admin/categories`
2. Update category: `PUT http://localhost:3000/api/admin/categories/:id`
3. Delete category: `DELETE http://localhost:3000/api/admin/categories/:id`

---

**Note:** Make sure your backend server is running on `http://localhost:3000` before making requests!
