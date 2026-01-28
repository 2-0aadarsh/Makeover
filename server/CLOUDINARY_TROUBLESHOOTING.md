# 🔧 Cloudinary Upload Error - Troubleshooting Guide

## ❌ Error: "cloud_name is disabled"

This error means your Cloudinary credentials are either incorrect or your account has an issue.

---

## 🔍 Step-by-Step Fix

### **Step 1: Test Cloudinary Configuration**

First, test if your credentials are loaded correctly:

**Endpoint**: `GET /api/admin/upload/test-config`

**Postman**:
```
GET http://localhost:3000/api/admin/upload/test-config
```

**This will show**:
- Which credentials are set
- If any are missing
- If Cloudinary connection works

---

### **Step 2: Check Your .env File**

**Location**: `server/.env`

**Required variables**:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**How to get these values**:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Login to your account
3. Go to **Dashboard**
4. Copy the values:
   ```
   Cloud name: dxxxxx
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

5. Paste them in your `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=dxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```

---

### **Step 3: Restart Your Server**

After updating `.env`, you **MUST restart** the server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

Environment variables are only loaded when the server starts.

---

### **Step 4: Test Again**

Try uploading again:
```
POST http://localhost:3000/api/admin/upload/test
Body (form-data): image=[File]
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: Wrong Cloud Name**

**Error**: `cloud_name is disabled` or `Invalid cloud_name`

**Solution**:
- Cloud name should NOT include `https://` or any URL
- Should be just the name, e.g., `dxxxxx` or `your-cloud-name`
- Check Cloudinary dashboard for exact value

---

### **Issue 2: Account Disabled/Suspended**

**Error**: `cloud_name is disabled`

**Solution**:
1. Login to Cloudinary dashboard
2. Check if there's a warning banner
3. Verify your account is active
4. Check email for any suspension notices
5. Verify you haven't exceeded free tier limits

---

### **Issue 3: Invalid API Key/Secret**

**Error**: `401 Unauthorized`

**Solution**:
- Double-check API Key (should be all numbers)
- Double-check API Secret (alphanumeric string)
- Make sure there are no spaces or quotes in `.env`
- Copy-paste directly from Cloudinary dashboard

---

### **Issue 4: Environment Variables Not Loading**

**Error**: `undefined` credentials

**Solution**:
```bash
# Check if .env file exists in server folder
ls server/.env

# Make sure dotenv is configured in server.js
# Should have: import 'dotenv/config';

# Restart server after changing .env
```

---

## 🧪 Testing Checklist

### ✅ Verify Configuration

- [ ] Test config endpoint: `GET /api/admin/upload/test-config`
- [ ] Check response shows credentials (not undefined)
- [ ] Check response shows "Connected ✅"

### ✅ Verify Upload

- [ ] Upload test image: `POST /api/admin/upload/test`
- [ ] Check image appears in Cloudinary dashboard
- [ ] Check response has valid URL

---

## 📝 Example .env File

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/wemakeover

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_SECRET=your_jwt_secret

# Cloudinary (⚠️ IMPORTANT: Get these from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# Image Upload
IMAGE_UPLOAD_PROVIDER=cloudinary
MAX_FILE_SIZE=5242880

# Frontend URL
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email (if needed)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🔧 Quick Fix Commands

### **1. Check .env file exists**
```bash
cd server
ls .env
```

### **2. Check .env content (without showing secrets)**
```bash
# Windows PowerShell
Select-String -Path .env -Pattern "CLOUDINARY"

# Linux/Mac
grep CLOUDINARY .env
```

### **3. Restart server**
```bash
npm run dev
```

---

## 📞 Still Not Working?

### **Option A: Create New Cloudinary Account**

1. Go to [Cloudinary Sign Up](https://cloudinary.com/users/register/free)
2. Create a new free account
3. Get credentials from dashboard
4. Update `.env` with new credentials
5. Restart server

### **Option B: Use Test Mode (Skip Upload)**

Temporarily, you can create categories without uploading to Cloudinary:

1. Comment out image upload in controller
2. Use a placeholder URL
3. Test other functionality
4. Fix Cloudinary later

---

## ✅ Success Indicators

When Cloudinary is working correctly:

1. ✅ Test config endpoint returns: `"status": "Connected ✅"`
2. ✅ Upload endpoint returns Cloudinary URL
3. ✅ Image appears in Cloudinary dashboard
4. ✅ No "401" or "disabled" errors in console

---

## 📧 Need Help?

**Check**:
1. Cloudinary dashboard - Is account active?
2. Usage limits - Have you exceeded free tier?
3. Credentials - Are they exactly as shown in dashboard?
4. .env file - Is it in the `server/` folder?
5. Server restart - Did you restart after changing .env?

---

**Last Updated**: January 12, 2026
