# MongoDB Compass Connection Guide

## Method 1: Connect Compass Directly to Atlas (Recommended) ⭐

### Steps:
1. **In MongoDB Atlas:**
   - Go to your cluster
   - Click **"Connect"** button
   - Select **"Connect using MongoDB Compass"**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

2. **In MongoDB Compass:**
   - Open MongoDB Compass
   - Click **"New Connection"**
   - Paste the connection string
   - Click **"Connect"**
   - You'll now see all your databases and collections!

3. **Navigate to your data:**
   - Expand `Cluster0` → `test` → `addresses`
   - All 21 documents will be visible

---

## Method 2: Export from Atlas and Import to Compass

### Step 1: Export from Atlas
1. In MongoDB Atlas Data Explorer
2. Select the `addresses` collection
3. Click **`</> EXPORT CODE`** button (top right)
4. Choose **"Export as JSON"** or **"Export as CSV"**
5. Save the file (e.g., `addresses_export.json`)

### Step 2: Import to Compass
1. Open MongoDB Compass
2. Connect to your local MongoDB or another cluster
3. Navigate to your target database (or create a new one)
4. Click on the `addresses` collection (or create it if it doesn't exist)
5. Click **"Import Data"** button
6. Select your exported file
7. Choose the format (JSON/CSV)
8. Click **"Import"**

---

## Quick Connection String Format

Your connection string should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
```

Or with database name:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/test
```

---

## Troubleshooting

### Issue: "Authentication failed"
- **Solution:** Check your username and password in Atlas → Database Access

### Issue: "Connection timeout"
- **Solution:** 
  1. Check your IP is whitelisted in Atlas → Network Access
  2. Click "Add IP Address" → "Allow Access from Anywhere" (for testing)

### Issue: "Cannot find database"
- **Solution:** The database name in the connection string might be wrong. Try without specifying database name.

---

## Your Current Setup

Based on your codebase, your connection string is stored in:
- `server/.env` file
- Variable name: `MONGODB_URI`

You can use the same connection string in Compass that you use in your application!
