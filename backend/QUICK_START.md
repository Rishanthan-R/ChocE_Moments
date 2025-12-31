# ⚡ Quick Start Verification Guide

**Goal:** Get everything running and tested in 15 minutes.

---

## 📋 Checklist

### ✅ Prerequisites (Your Setup)
- [ ] Windows machine with XAMPP installed
- [ ] VS Code open with ChocE_Moments project
- [ ] Node.js installed (backend folder has 152 packages installed)
- [ ] React app running on http://localhost:3000

---

## 🚀 Step 1: Start MySQL (2 minutes)

### Method 1: XAMPP Control Panel (Easy)
```
1. Open XAMPP Control Panel
2. Find "MySQL" row
3. Click "Start" button
4. Wait for status: "Running" ✅
5. Also start "Apache" if you want phpMyAdmin
```

### Verify MySQL Started
```powershell
# Open PowerShell and type:
mysql -u root

# Should show:
Welcome to the MySQL monitor. Command line tools version ...

# Type: exit
exit
```

---

## 🗄️ Step 2: Create Database (2 minutes)

### Method 1: Command Line (Fastest)
```powershell
# Open PowerShell
mysql -u root -e "CREATE DATABASE choce_moments;"
mysql -u root -e "SHOW DATABASES;"

# Should see: choce_moments in the list
```

### Method 2: phpMyAdmin (Visual)
```
1. Open http://localhost/phpmyadmin
2. Click "New" on left
3. Database name: choce_moments
4. Collation: utf8mb4_unicode_ci
5. Click "Create"
6. Refresh - should see in list ✅
```

### Verify Database Created
```powershell
mysql -u root -e "SHOW DATABASES;"
# Output includes: choce_moments
```

---

## 🎯 Step 3: Start Backend (3 minutes)

### In VS Code Terminal
```powershell
# Navigate to backend
cd backend

# Install packages (if not done yet)
npm install

# Start in development mode
npm run dev
```

### Expected Output
```
✅ Server running on port 5000
✅ MySQL Database connected successfully
✅ Ready to accept requests
```

### If Error: "MySQL Database connection failed"
1. Check XAMPP MySQL is running (Step 1)
2. Verify database created (Step 2)
3. Check backend/.env has correct credentials
4. Try again: `npm run dev`

---

## 🧪 Step 4: Test Backend Health (2 minutes)

### Open New Terminal Tab
```powershell
# Test backend is running
curl http://localhost:5000/api/health

# Should see:
{"success":true,"message":"Server is running"}
```

If curl not found:
```powershell
# Use PowerShell Invoke-RestMethod instead:
Invoke-RestMethod http://localhost:5000/api/health
```

---

## 🔐 Step 5: Test Authentication (3 minutes)

### Use Postman (Recommended)
1. Open Postman
2. Import: `backend/ChocE_Moments_Auth_API.postman_collection.json`
3. Click "Sign Up" request
4. Click "Send"
5. Should get: `{"success": true, "token": "eyJ...", "user": {...}}`

### Or Use Terminal (cURL)
```powershell
# Sign Up
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d @- << 'EOF'
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "0706878899",
  "address": "123 Main St",
  "password": "password123"
}
EOF

# Should return token and user data
```

---

## 🌐 Step 6: Frontend Check (2 minutes)

### Open Browser
```
1. Go to: http://localhost:3000
2. Click "Create Account" 
3. Fill form:
   - Name: Test Person
   - Email: newtest@example.com
   - Phone: 0706878899
   - Address: Test Address
   - Password: test@123
4. Click "Signup"
5. Should see dashboard ✅
```

### Check LocalStorage
```javascript
// Open DevTools: F12 → Console
// Paste:
console.log(localStorage.getItem('token'))

// Should show: eyJhbGc...
```

### Refresh Page
```
1. Press F5 to refresh
2. Should still be logged in ✅
3. User data loaded from backend
```

---

## ✅ Success Criteria

### All Passing? 🎉
- [ ] XAMPP MySQL showing "Running"
- [ ] Database `choce_moments` created
- [ ] Backend server started on port 5000
- [ ] Health check returns success
- [ ] Signup creates user in database
- [ ] Token stored in localStorage
- [ ] Refresh keeps user logged in
- [ ] Frontend receives backend data

If ALL checks pass = **Backend Integration Complete!** ✅

---

## 🚨 Troubleshooting Quick Links

### "MySQL connection refused"
→ See [XAMPP_SETUP.md](XAMPP_SETUP.md) Step 1

### "Port 5000 already in use"
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "CORS error from frontend"
→ Make sure `.env` has: `CLIENT_URL=http://localhost:3000`

### "Database 'choce_moments' doesn't exist"
→ Run: `mysql -u root -e "CREATE DATABASE choce_moments;"`

### "Can't connect to localhost:3306"
→ XAMPP MySQL not running. Start it in Control Panel.

---

## 📊 Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │
│ http://localhost:3000
└──────────┬──────────┘
           │ HTTPS Requests
           │ + JWT Token
           ▼
┌─────────────────────┐
│  Express Backend    │
│ http://localhost:5000
└──────────┬──────────┘
           │ SQL Queries
           │ (Sequelize ORM)
           ▼
┌─────────────────────┐
│ MySQL Database      │
│ (XAMPP Local)       │
│ choce_moments       │
└─────────────────────┘
```

---

## 🎯 Next Steps After Verification

### If Everything Works ✅
1. Replace `frontend/src/AuthContext.tsx` with code from `FRONTEND_INTEGRATION.md`
2. Update `frontend/src/components/AuthModal.tsx` with API calls
3. Update `frontend/src/components/Cart.tsx` to send orders to backend
4. Test signup/login/cart flow

### If Something Failed ❌
1. Check error message in terminal
2. Compare with troubleshooting section above
3. Check backend logs for error details
4. Verify MySQL is running

---

## 💡 Tips

### Monitor Backend Logs
```
Backend terminal shows:
- Incoming requests
- Validation errors  
- Database operations
- Any issues

Don't close the terminal while testing!
```

### Check Database Content
```powershell
# See all users created
mysql -u root choce_moments -e "SELECT id, name, email, phone FROM users;"

# See database structure
mysql -u root choce_moments -e "DESCRIBE users;"
```

### Clear Everything (Start Fresh)
```powershell
# Drop database
mysql -u root -e "DROP DATABASE choce_moments;"

# Create new
mysql -u root -e "CREATE DATABASE choce_moments;"

# Restart backend - tables created automatically
```

---

## ⏱️ Time Breakdown

| Task | Time |
|------|------|
| Start MySQL | 1 min |
| Create Database | 1 min |
| Start Backend | 2 min |
| Test Backend | 2 min |
| Test Frontend | 2 min |
| **TOTAL** | **~8 min** |

---

**Status: Ready to Launch! 🚀**

Follow the steps above in order. You should be fully integrated in under 15 minutes!
