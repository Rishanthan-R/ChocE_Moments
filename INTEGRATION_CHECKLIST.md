# ✅ Complete Integration Checklist

Follow this checklist to go from zero to a fully functional authentication system.

**Estimated Time: 30-40 minutes**

---

## 📋 Phase 1: Database Setup (5 minutes)

### Prerequisites Check
- [ ] XAMPP installed on Windows
- [ ] MySQL included in XAMPP
- [ ] Backend folder with 152 npm packages
- [ ] Backend/.env file configured

### Start XAMPP MySQL
- [ ] Open XAMPP Control Panel
- [ ] Locate MySQL row
- [ ] Click "Start" button
- [ ] Wait for status: "Running" (green)
- [ ] Do NOT close XAMPP window

### Create Database
- [ ] Open new PowerShell/CMD window
- [ ] Run: `mysql -u root -e "CREATE DATABASE choce_moments;"`
- [ ] Run: `mysql -u root -e "SHOW DATABASES;"`
- [ ] Verify: `choce_moments` appears in list
- [ ] Run: `mysql -u root -e "SHOW TABLES IN choce_moments;"`

---

## 🚀 Phase 2: Backend Setup (5 minutes)

### Start Backend Server
- [ ] Open VS Code terminal or new PowerShell
- [ ] Navigate: `cd backend`
- [ ] Run: `npm run dev`
- [ ] Wait for startup...
- [ ] See message: "✅ Server running on port 5000"
- [ ] See message: "✅ MySQL Database connected successfully"
- [ ] Backend is running - **DO NOT CLOSE THIS TERMINAL**

### Verify Backend Health
- [ ] Open new terminal/PowerShell window
- [ ] Run: `curl http://localhost:5000/api/health`
- [ ] Response: `{"success":true,"message":"Server is running"}`
- [ ] If error: Check XAMPP MySQL still running

---

## 🧪 Phase 3: Test Backend (5 minutes)

### Test Signup Endpoint
- [ ] Use Postman OR run curl command:
```powershell
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
```
- [ ] Response has: `"success": true`
- [ ] Response has: `"token": "eyJ..."`
- [ ] Response has: user data
- [ ] Response NO: password field

### Verify Database Updated
- [ ] Open new PowerShell
- [ ] Run: `mysql -u root choce_moments -e "SELECT * FROM users;"`
- [ ] See: 1 user row created
- [ ] Check: Password is long hash (~60 chars)
- [ ] Check: Email is "test@example.com"

### Test Login Endpoint
- [ ] Use same Postman/curl with login:
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d @- << 'EOF'
{
  "email": "test@example.com",
  "password": "password123"
}
EOF
```
- [ ] Response has: `"success": true`
- [ ] Response has: new token (different from signup)
- [ ] Response has: user data

### Test Get Profile Endpoint
```powershell
# Replace TOKEN with actual token from signup/login response
$TOKEN = "eyJ..."
curl -X GET http://localhost:5000/api/auth/me `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json"
```
- [ ] Response: user data
- [ ] Response: NO password field
- [ ] If error: Token format wrong

---

## 🌐 Phase 4: Frontend Verification (3 minutes)

### Check Frontend Running
- [ ] Open browser: http://localhost:3000
- [ ] See: ChocE Moments homepage
- [ ] See: Products/Dashboard
- [ ] See: "Create Account" or Signup button
- [ ] If not: Run frontend with `npm start` in frontend folder

### Check Browser Console
- [ ] Press F12 to open DevTools
- [ ] Click "Console" tab
- [ ] Check: NO red errors (warnings are OK)
- [ ] If errors: Check frontend/.env configuration

### Verify CORS Not Blocking
- [ ] Backend console should NOT show CORS errors
- [ ] Frontend console should NOT show CORS errors
- [ ] If CORS error: Verify backend/.env has `CLIENT_URL=http://localhost:3000`

---

## 💻 Phase 5: Frontend Code Update (20 minutes)

### Update AuthContext.tsx
- [ ] Navigate to: `frontend/src/components/AuthContext.tsx`
- [ ] Copy all code from `backend/FRONTEND_INTEGRATION.md` (AuthContext.tsx section)
- [ ] Replace old file content completely
- [ ] Save file (Ctrl+S)
- [ ] Wait for hot reload
- [ ] Check console: NO errors

### Update AuthModal.tsx
- [ ] Navigate to: `frontend/src/components/AuthModal.tsx`
- [ ] Find: signup form submission handler
- [ ] Replace with: API call version from `FRONTEND_INTEGRATION.md`
- [ ] Find: login form submission handler
- [ ] Replace with: API call version from `FRONTEND_INTEGRATION.md`
- [ ] Save file
- [ ] Check console: NO errors

### Update Cart.tsx
- [ ] Navigate to: `frontend/src/components/Cart.tsx`
- [ ] Find: `handleSubmitOrder` function
- [ ] Replace with: Backend integration version from `FRONTEND_INTEGRATION.md`
- [ ] Save file
- [ ] Check console: NO errors

### Verify No Syntax Errors
- [ ] Terminal shows: No TypeScript errors
- [ ] Browser: No red errors in console
- [ ] Frontend page: Still loading properly

---

## 🔐 Phase 6: End-to-End Testing (10 minutes)

### Test 1: Signup New Account
- [ ] Open http://localhost:3000
- [ ] Click "Create Account" button
- [ ] Fill form:
  - [ ] Name: "Test Person"
  - [ ] Email: "newtester@example.com"
  - [ ] Phone: "0706878899"
  - [ ] Address: "Test Address, City"
  - [ ] Password: "password123"
- [ ] Click "Signup" button
- [ ] Wait for response...
- [ ] Should see: Logged in state
- [ ] Should see: User name/email displayed
- [ ] Check browser console: Token logged successfully

### Verify Token in LocalStorage
- [ ] Press F12 → Console
- [ ] Type: `localStorage.getItem('token')`
- [ ] Should return: `eyJ...` (JWT token)
- [ ] NOT return: `null` or `undefined`

### Test 2: Refresh Page (Token Persistence)
- [ ] Refresh browser: F5
- [ ] Page should load...
- [ ] Should still be logged in ✅
- [ ] User data should display
- [ ] If not logged in: Token loading failed

### Test 3: Logout
- [ ] Click "Logout" button
- [ ] Wait for redirect...
- [ ] Should see: Login page or signup form
- [ ] Press F12 → Console
- [ ] Type: `localStorage.getItem('token')`
- [ ] Should return: `null` (token cleared)

### Test 4: Login with Created Account
- [ ] Click "Login" button
- [ ] Enter email: "newtester@example.com"
- [ ] Enter password: "password123"
- [ ] Click "Login"
- [ ] Wait for response...
- [ ] Should see: Logged in state ✅
- [ ] Check token in localStorage
- [ ] Try different password: Should fail ❌

### Test 5: Add to Cart (Protected Action)
- [ ] While logged in
- [ ] Click on product
- [ ] Click "Add to Cart"
- [ ] Verify: Item added to cart
- [ ] Check cart count increased

### Test 6: Checkout Flow
- [ ] Click on cart
- [ ] Click "Checkout" or order button
- [ ] Verify: Shows checkout form
- [ ] Review order details
- [ ] If WhatsApp integration: Should open WhatsApp ✅

### Test 7: Database Verification
- [ ] Open PowerShell
- [ ] Run: `mysql -u root choce_moments -e "SELECT * FROM users;"`
- [ ] Should see: 2 users
  - [ ] test@example.com (from Phase 3)
  - [ ] newtester@example.com (from Phase 6)
- [ ] Both have hashed passwords (~60 chars)

---

## 🔧 Debug Checklist (If Something Fails)

### Issue: Frontend Signup Fails

**Symptom:** Submit button doesn't work or shows error

- [ ] Check: Backend still running (terminal)
- [ ] Check: No red errors in browser console
- [ ] Check: Network tab shows POST to `http://localhost:5000/api/auth/signup`
- [ ] Check: backend/.env has `CLIENT_URL=http://localhost:3000`
- [ ] Solution: Restart backend with `npm run dev`

### Issue: CORS Error

**Symptom:** "Access to XMLHttpRequest blocked by CORS policy"

- [ ] Check: backend/.env has exact line: `CLIENT_URL=http://localhost:3000`
- [ ] Check: Trailing slash NOT in URL (no `http://localhost:3000/`)
- [ ] Check: Backend restarted after .env change
- [ ] Solution: Verify .env, restart backend

### Issue: 401 Unauthorized Error

**Symptom:** "Authorization token required"

- [ ] Check: Token exists in localStorage
- [ ] Check: Token sent in header: `Authorization: Bearer {token}`
- [ ] Check: Token not expired (expires in 15 min)
- [ ] Solution: Login again to get new token

### Issue: Database Connection Error

**Symptom:** "Error: connect ECONNREFUSED 127.0.0.1:3306"

- [ ] Check: XAMPP MySQL showing "Running"
- [ ] Check: Database exists: `mysql -u root -e "SHOW DATABASES;"`
- [ ] Check: Credentials in backend/.env match XAMPP
- [ ] Solution: Start MySQL in XAMPP Control Panel

### Issue: Port 5000 Already in Use

**Symptom:** "EADDRINUSE :::5000"

- [ ] Check: Backend not already running
- [ ] Solution: Kill process: `netstat -ano | findstr :5000` then `taskkill /PID {PID} /F`

---

## ✅ Final Verification Checklist

Before declaring success:

- [ ] XAMPP MySQL running
- [ ] Database exists and has users table
- [ ] Backend running on port 5000
- [ ] Health check passes
- [ ] Frontend running on port 3000
- [ ] Can signup new account
- [ ] Token stored in localStorage
- [ ] Refresh page - still logged in
- [ ] Can logout
- [ ] Can login with created account
- [ ] User data in database has hashed password
- [ ] Can add products to cart
- [ ] Checkout works
- [ ] No CORS errors
- [ ] No authentication errors

---

## 🎯 Success Indicators

### You're Good When:
✅ Signup creates new user  
✅ Password hashed in database  
✅ Token stored in localStorage  
✅ Refresh keeps you logged in  
✅ Logout clears token  
✅ Login works with correct credentials  
✅ Wrong password rejected  
✅ Protected endpoints need token  
✅ Database queries show hashed passwords  
✅ Frontend and backend communicating  

---

## 📊 Time Tracking

| Phase | Time | Status |
|-------|------|--------|
| Database Setup | 5 min | ⏳ |
| Backend Setup | 5 min | ⏳ |
| Backend Testing | 5 min | ⏳ |
| Frontend Verify | 3 min | ⏳ |
| Frontend Update | 20 min | ⏳ |
| E2E Testing | 10 min | ⏳ |
| **TOTAL** | **~48 min** | ⏳ |

---

## 🚀 Next Steps After Checklist

- [ ] All items checked ✅
- [ ] Everything working ✅
- [ ] **Now:** Commit to Git if using version control
- [ ] **Then:** Consider Phase 2 features (products, orders)
- [ ] **Later:** Deploy to production

---

## 📞 Emergency Contacts

### If Database Won't Connect
1. Start XAMPP MySQL
2. Create database: `mysql -u root -e "CREATE DATABASE choce_moments;"`
3. Check credentials in backend/.env
4. Restart backend

### If Frontend Errors
1. Check console errors (F12)
2. Verify backend running (http://localhost:5000/api/health)
3. Verify .env configuration
4. Clear localStorage: `localStorage.clear()`
5. Refresh page

### If Port Conflicts
1. Find process: `netstat -ano | findstr :5000`
2. Kill process: `taskkill /PID {PID} /F`
3. Restart backend

---

**Start Here:** Database Setup Phase 1  
**Status:** Ready to Begin ✅

Follow each phase in order. You'll be live within 1 hour! 🎉
