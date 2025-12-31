# 🧪 Complete Testing Guide

## Prerequisites
- Backend running: `npm run dev`
- MySQL running: `net start MySQL80`
- Postman installed (optional but recommended)

---

## Method 1: Postman (Easiest & Recommended)

### Import Collection
1. Open Postman
2. Click **Import** button
3. Select file: `ChocE_Moments_Auth_API.postman_collection.json`
4. Collection imported with all endpoints

### Set Variables
1. In Postman, select **Environment** or **Variables**
2. Set: `base_url` = `http://localhost:5000`
3. Token will auto-save after Login/Signup

### Run Tests in Order
```
1. Health Check        (GET)
   └─ Should return: {success: true}

2. Sign Up             (POST)
   └─ Creates user, returns token

3. Login               (POST)
   └─ Returns token (save this!)

4. Get Current User    (GET)
   └─ Uses token from #3

5. Update Profile      (PUT)
   └─ Uses token from #3

6. Logout              (POST)
   └─ Uses token from #3
```

---

## Method 2: cURL (Command Line)

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

---

### Test 2: Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "password": "password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "role": "user",
    "createdAt": "2025-12-18T10:30:00.000Z"
  }
}
```

**⚠️ Error: Duplicate Email (400)**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": {
    "email": "This email is already registered. Please use a different email or try logging in."
  }
}
```

**⚠️ Error: Validation Failed (400)**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "phone": "Phone must be 10-15 digits",
    "password": "Password must be at least 6 characters"
  }
}
```

---

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "role": "user"
  }
}
```

**⚠️ Error: Invalid Credentials (401)**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Test 4: Get Current User

```bash
# Replace TOKEN with actual token from Login response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

**Example with real token:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAzMDAxMDAwLCJleHAiOjE3MDMwMDE5MDB9.abc123..."
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "role": "user",
    "createdAt": "2025-12-18T10:30:00.000Z"
  }
}
```

**⚠️ Error: No Token (401)**
```json
{
  "success": false,
  "message": "Authorization token required"
}
```

**⚠️ Error: Invalid Token (401)**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### Test 5: Update Profile

```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "0706878800",
    "address": "456 Oak Street, Colombo, Sri Lanka"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "john@example.com",
    "phone": "0706878800",
    "address": "456 Oak Street, Colombo, Sri Lanka",
    "role": "user"
  }
}
```

---

### Test 6: Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Method 3: JavaScript Fetch (Browser Console)

### Sign Up
```javascript
fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0706878899',
    address: '123 Main Street, Colombo',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  console.log(data);
  localStorage.setItem('token', data.token);
})
```

### Login
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  console.log(data);
  localStorage.setItem('token', data.token);
})
```

### Get Profile
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## Test Checklist

### Validation Tests
- [ ] Sign up with invalid email format → 400
- [ ] Sign up with phone < 10 digits → 400
- [ ] Sign up with password < 6 chars → 400
- [ ] Sign up with short address → 400
- [ ] Sign up with duplicate email → 400

### Authentication Tests
- [ ] Login with correct credentials → 200
- [ ] Login with wrong password → 401
- [ ] Login with non-existent email → 401
- [ ] Get profile with valid token → 200
- [ ] Get profile with invalid token → 401
- [ ] Get profile without token → 401

### Profile Tests
- [ ] Update name → 200
- [ ] Update phone → 200
- [ ] Update address → 200
- [ ] Update with invalid phone → 400
- [ ] Update profile without token → 401

### Token Tests
- [ ] Token in Authorization header → Works
- [ ] Token as query parameter → Fails
- [ ] Malformed token → 401
- [ ] Expired token → 401 (after 15 min)

---

## Response Time Tests

```bash
# Time the request
time curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

**Expected:** < 100ms

---

## Database Verification

### Check Users Created
```bash
mysql -u root -e "SELECT id, name, email, role FROM choce_moments.users;"
```

Output:
```
+----+----------+------------------+------+
| id | name     | email            | role |
+----+----------+------------------+------+
|  1 | John Doe | john@example.com | user |
+----+----------+------------------+------+
```

### Check Password is Hashed
```bash
mysql -u root -e "SELECT email, password FROM choce_moments.users LIMIT 1;"
```

Output (password should be long hash):
```
+------------------+--------------------------------------------------------------+
| email            | password                                                     |
+------------------+--------------------------------------------------------------+
| john@example.com | $2a$10$4Zq8... (60+ characters, not plaintext)             |
+------------------+--------------------------------------------------------------+
```

---

## Performance Testing

### Single Request
```bash
curl -w "\n%{time_total}s\n" -X GET http://localhost:5000/api/health
```

### Multiple Requests
```bash
for i in {1..10}; do
  curl -s http://localhost:5000/api/health > /dev/null
  echo "Request $i completed"
done
```

---

## Security Testing

### Test 1: SQL Injection
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin\" OR \"1\"=\"1",
    "password": "anything"
  }'
```
Expected: Should fail safely (400 or 401, not SQL error)

### Test 2: XSS Prevention
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(\"xss\")</script>",
    "email": "test@example.com",
    "phone": "0706878899",
    "address": "123 Main St",
    "password": "password123"
  }'
```
Expected: Should sanitize/escape, no script execution

### Test 3: No Password Exposure
```bash
# Get user profile
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```
Expected: Response should NOT include password field

### Test 4: CORS Check
```javascript
// From different origin
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer TOKEN' }
})
```
Expected: Should work from frontend URL

---

## Error Scenario Testing

### Scenario 1: Lost Connection
```bash
# Stop MySQL
net stop MySQL80

# Try to login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```
Expected: 500 error (handled gracefully)

### Scenario 2: Invalid JSON
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{invalid json'
```
Expected: 400 error

### Scenario 3: Missing Content-Type
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"test@example.com","password":"pass"}'
```
Expected: May fail or accept (depends on server)

---

## Load Testing

### Using Apache Bench
```bash
# Install: choco install apache-bench

# Single request 100 times
ab -n 100 -c 10 http://localhost:5000/api/health
```

### Using curl with loop
```bash
time for i in {1..50}; do
  curl -s http://localhost:5000/api/health > /dev/null
done
```

---

## Full Test Scenario

### Complete User Journey
```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

# 1. Sign Up
echo "1. Signing up..."
SIGNUP=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"testuser@example.com",
    "phone":"0706878899",
    "address":"123 Main Street",
    "password":"password123"
  }')

echo $SIGNUP | jq .
TOKEN=$(echo $SIGNUP | jq -r '.token')
echo "Token: $TOKEN"

# 2. Get Profile
echo -e "\n2. Getting profile..."
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Update Profile
echo -e "\n3. Updating profile..."
curl -s -X PUT $BASE_URL/api/auth/update-profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}' | jq .

# 4. Logout
echo -e "\n4. Logging out..."
curl -s -X POST $BASE_URL/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n✅ All tests completed!"
```

---

## Expected Results Summary

| Test | Expected | Status |
|------|----------|--------|
| Health Check | 200 OK | ✅ |
| Sign Up Valid | 201 Created | ✅ |
| Sign Up Duplicate | 400 Bad Request | ✅ |
| Login Success | 200 OK | ✅ |
| Login Invalid | 401 Unauthorized | ✅ |
| Get Profile Valid | 200 OK | ✅ |
| Get Profile Invalid | 401 Unauthorized | ✅ |
| Update Profile | 200 OK | ✅ |
| Logout | 200 OK | ✅ |
| Password Hashed | Yes, bcrypt | ✅ |
| Token in DB | No, only in header | ✅ |

---

## Troubleshooting Failed Tests

| Error | Solution |
|-------|----------|
| `Connection refused` | Start backend: `npm run dev` |
| `CORS error` | Check CLIENT_URL in .env |
| `Database error` | Start MySQL: `net start MySQL80` |
| `Token invalid` | Copy full token, check expiry (15 min) |
| `Email already exists` | Use different email or clear DB |
| `400 Bad Request` | Check JSON format, required fields |
| `500 Server Error` | Check backend console for errors |

---

## Next Steps After Testing

1. ✅ All tests pass
2. Update frontend to use backend API
3. Replace localStorage auth with JWT
4. Add token to Authorization header
5. Handle token refresh logic
6. Deploy to production

---

**Status: Ready for Testing! 🚀**

Run tests and verify everything works perfectly!
