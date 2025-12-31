# 🏗️ Complete System Architecture

Visual overview of your entire authentication system.

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S COMPUTER (Windows)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              BROWSER (http://localhost:3000)             │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              React Frontend (Vite)                 │  │  │
│  │  │                                                     │  │  │
│  │  │  • AuthContext (Signup/Login/Logout logic)        │  │  │
│  │  │  • AuthModal (Login/Signup forms)                 │  │  │
│  │  │  • Dashboard (Product display)                     │  │  │
│  │  │  • Cart (Shopping cart)                            │  │  │
│  │  │                                                     │  │  │
│  │  │  LocalStorage:                                      │  │  │
│  │  │  ✓ token (JWT from backend)                        │  │  │
│  │  │  ✓ refreshToken (7-day token)                      │  │  │
│  │  │                                                     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              △                                  │
│                              │                                  │
│                     HTTP Requests/Responses                     │
│                  (Headers: Authorization: Bearer {token})      │
│                              │                                  │
│                              ▽                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Node.js Backend (http://localhost:5000)         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              Express.js Server                      │  │  │
│  │  │                                                     │  │  │
│  │  │  Routes:                                            │  │  │
│  │  │  • POST /api/auth/signup (validate → hash → save) │  │  │
│  │  │  • POST /api/auth/login (verify → generate token) │  │  │
│  │  │  • GET /api/auth/me (verify token → return user)  │  │  │
│  │  │  • PUT /api/auth/update-profile                    │  │  │
│  │  │  • POST /api/auth/logout                           │  │  │
│  │  │                                                     │  │  │
│  │  │  Middleware:                                        │  │  │
│  │  │  • Authentication (verifies JWT tokens)            │  │  │
│  │  │  • Validation (checks input data)                  │  │  │
│  │  │  • Error Handler (returns proper errors)           │  │  │
│  │  │  • CORS (allows frontend on localhost:3000)       │  │  │
│  │  │  • Helmet (sets security headers)                  │  │  │
│  │  │  • Morgan (logs all requests)                      │  │  │
│  │  │                                                     │  │  │
│  │  │  Controllers:                                       │  │  │
│  │  │  • Signup: Create user → Hash password → Token     │  │  │
│  │  │  • Login: Find user → Compare password → Token     │  │  │
│  │  │  • Profile: Get → Update → Validate               │  │  │
│  │  │                                                     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              △                                  │
│                              │                                  │
│                      SQL Queries (Sequelize ORM)               │
│                      Connection Pooling (5 connections)         │
│                              │                                  │
│                              ▽                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              XAMPP MySQL Database                         │  │
│  │         (Database: choce_moments)                        │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Table: users                                       │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │ id (INT, Primary Key)                        │  │  │  │
│  │  │  │ name (VARCHAR, 2-100 chars)                 │  │  │  │
│  │  │  │ email (VARCHAR, UNIQUE)                     │  │  │  │
│  │  │  │ phone (VARCHAR, 10-15 digits)               │  │  │  │
│  │  │  │ address (VARCHAR, 10+ chars)                │  │  │  │
│  │  │  │ password (VARCHAR, hashed with bcryptjs)    │  │  │  │
│  │  │  │ role (ENUM: user/admin)                     │  │  │  │
│  │  │  │ createdAt (TIMESTAMP)                       │  │  │  │
│  │  │  │ updatedAt (TIMESTAMP)                       │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIGNUP FLOW                                  │
├─────────────────────────────────────────────────────────────────┤

1. User enters data on frontend
   ├─ Name: "John Doe"
   ├─ Email: "john@example.com"
   ├─ Phone: "0706878899"
   ├─ Address: "123 Main St"
   └─ Password: "password123"

2. Frontend sends to backend
   POST /api/auth/signup
   Content-Type: application/json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "0706878899",
     "address": "123 Main St",
     "password": "password123"
   }

3. Backend validates input
   ✓ Email format valid
   ✓ Email not already used
   ✓ Phone 10-15 digits
   ✓ Password 6+ characters
   ✓ Name 2-100 characters
   ✓ Address 10+ characters

4. Backend hashes password
   password123 → $2b$10$...56charHashedPassword...

5. Backend saves to database
   INSERT INTO users (name, email, phone, address, password, role)
   VALUES ('John Doe', 'john@example.com', ...)

6. Backend generates JWT token
   {
     userId: 1,
     email: 'john@example.com',
     iat: 1234567890,
     exp: 1234567890 + 900 (15 minutes)
   }
   Encoded: eyJhbGc.eyJ1c2VyI...

7. Backend returns response
   {
     "success": true,
     "token": "eyJhbGc...",
     "refreshToken": "eyJh...",
     "user": {
       "id": 1,
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "0706878899",
       "address": "123 Main St",
       "role": "user"
     }
   }

8. Frontend stores token
   localStorage.setItem('token', 'eyJhbGc...')
   localStorage.setItem('refreshToken', 'eyJh...')

9. Frontend redirects to dashboard
   User is now logged in! ✅

└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                                   │
├─────────────────────────────────────────────────────────────────┤

1. User enters credentials
   ├─ Email: "john@example.com"
   └─ Password: "password123"

2. Frontend sends to backend
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }

3. Backend finds user by email
   SELECT * FROM users WHERE email = 'john@example.com'
   → Returns: {id: 1, name: '...', password: '$2b$10$...hash...'}

4. Backend compares password
   bcryptjs.compare('password123', '$2b$10$...hash...')
   → Match: true ✓

5. Backend generates new token
   {
     userId: 1,
     email: 'john@example.com',
     exp: now + 900 seconds
   }

6. Backend returns token
   {
     "success": true,
     "token": "eyJhbGc...",
     "user": {...}
   }

7. Frontend stores token
   localStorage.setItem('token', newToken)

8. User logged in! ✅

└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Protected Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ACCESSING PROTECTED ENDPOINT                         │
├─────────────────────────────────────────────────────────────────┤

1. Frontend makes request to protected endpoint
   GET /api/auth/me
   Headers: {
     "Authorization": "Bearer eyJhbGc..."
   }

2. Backend receives request
   ↓
   Authorization Middleware runs:
   ├─ Extract token from "Bearer eyJhbGc..."
   ├─ Verify JWT signature (matches JWT_SECRET)
   ├─ Check token not expired
   ├─ Decode token to get userId
   └─ Attach user to request.user

3. If token invalid/missing/expired
   → Return 401 Unauthorized
   → Frontend clears token from localStorage
   → Redirect to login

4. If token valid
   → Continue to controller
   → Return user data (no password)
   ↓
   {
     "success": true,
     "user": {
       "id": 1,
       "name": "John Doe",
       "email": "john@example.com",
       ...
     }
   }

5. Frontend receives protected data ✅

└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

```sql
┌─────────────────────────────────────────────────────────────────┐
│                    USERS TABLE                                    │
├─────────────────────────────────────────────────────────────────┤
│ Column      │ Type         │ Constraints  │ Purpose              │
├─────────────┼──────────────┼──────────────┼─────────────────────┤
│ id          │ INT          │ PK, AUTO_INC │ Unique identifier   │
│ name        │ VARCHAR(100) │ NOT NULL     │ User's name         │
│ email       │ VARCHAR(255) │ UNIQUE       │ Login identifier    │
│ phone       │ VARCHAR(15)  │ NOT NULL     │ Contact number      │
│ address     │ VARCHAR(255) │ NOT NULL     │ Shipping address    │
│ password    │ VARCHAR(255) │ NOT NULL     │ Hashed password     │
│ role        │ ENUM         │ DEFAULT user │ user or admin       │
│ createdAt   │ TIMESTAMP    │ DEFAULT NOW  │ Account creation    │
│ updatedAt   │ TIMESTAMP    │ DEFAULT NOW  │ Last update time    │
└─────────────────────────────────────────────────────────────────┘

Example Row:
┌────┬───────────┬──────────────────────┬──────────────┬──────────────────────┬──────────────────────────────────────────────┬──────┬─────────────┬─────────────┐
│ id │ name      │ email                │ phone        │ address              │ password                                     │ role │ createdAt   │ updatedAt   │
├────┼───────────┼──────────────────────┼──────────────┼──────────────────────┼──────────────────────────────────────────────┼──────┼─────────────┼─────────────┤
│ 1  │ John Doe  │ john@example.com     │ 0706878899   │ 123 Main St, Colombo │ $2b$10$...56charactersHashedPassword...    │ user │ 2024-01-15  │ 2024-01-15  │
└────┴───────────┴──────────────────────┴──────────────┴──────────────────────┴──────────────────────────────────────────────┴──────┴─────────────┴─────────────┘

Key Features:
✓ Email is UNIQUE - prevents duplicate accounts
✓ Password is hashed - never stored in plain text
✓ Role-based access - admin vs regular user
✓ Timestamps - track account creation/updates
```

---

## 🔐 JWT Token Structure

```
┌──────────────────────────────────────────────────────────────────┐
│         JWT TOKEN (Access Token - 15 minutes)                     │
├──────────────────────────────────────────────────────────────────┤

Encoded Token (what's stored):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1MzIxMjM0LCJleHAiOjE3MDUzMjEzMzR9.x7K9mL2pN4qR6sT8uV1wX2yZ3aB4cD5eF6gH7iJ8kL

Parts:
1. Header (Algorithm & Type)
   {
     "alg": "HS256",      // Algorithm (HMAC SHA-256)
     "typ": "JWT"         // Type
   }

2. Payload (Data)
   {
     "userId": 1,
     "email": "john@example.com",
     "role": "user",
     "iat": 1705321234,   // Issued at (timestamp)
     "exp": 1705321334    // Expires at (15 minutes later)
   }

3. Signature (Verification)
   HMACSHA256(
     base64url(header) + "." + base64url(payload),
     JWT_SECRET_KEY
   )

Verification Process:
1. Backend receives token
2. Extracts header & payload
3. Recalculates signature with JWT_SECRET
4. Compares signatures
5. If match → Token valid
6. If no match → Token forged/tampered
7. Check expiry: exp > current_timestamp
8. If expired → Invalid

Token Sent in Request:
Authorization: Bearer eyJhbGc...

Backend Extracts:
1. Get "Bearer " prefix
2. Extract token after space
3. Verify signature
4. Check expiry
5. Decode payload
6. Get userId from payload
7. Attach to request.user.id

┌──────────────────────────────────────────────────────────────────┐
│         JWT TOKEN (Refresh Token - 7 days)                        │
├──────────────────────────────────────────────────────────────────┤

Same structure but:
- Expires in 7 days (not 15 minutes)
- Used to get new access token when expired
- Not sent with every request
- Stored securely in localStorage

Future Feature:
POST /api/auth/refresh
Headers: { Authorization: 'Bearer refreshToken' }
Response: { token: newAccessToken }

```

---

## 📋 API Endpoints Summary

```
┌────────────────────────────────────────────────────────────────────┐
│                    PUBLIC ENDPOINTS (No Auth Required)             │
├────────────────────────────────────────────────────────────────────┤

1. POST /api/auth/signup
   ├─ Body: { name, email, phone, address, password }
   ├─ Validation: 
   │  ├─ Email format: valid@example.com
   │  ├─ Email unique: not already registered
   │  ├─ Phone: 10-15 digits
   │  ├─ Name: 2-100 characters
   │  ├─ Address: 10+ characters
   │  └─ Password: 6+ characters
   ├─ Response: { success, token, refreshToken, user }
   └─ Status: 201 (Created) or 400 (Bad Request)

2. POST /api/auth/login
   ├─ Body: { email, password }
   ├─ Validation:
   │  ├─ Email exists
   │  └─ Password matches (bcryptjs compare)
   ├─ Response: { success, token, refreshToken, user }
   └─ Status: 200 (OK) or 401 (Unauthorized)

3. GET /api/health
   ├─ Validation: None
   ├─ Response: { success: true, message: "Server is running" }
   └─ Status: 200 (OK)

┌────────────────────────────────────────────────────────────────────┐
│              PROTECTED ENDPOINTS (Auth Required)                   │
├────────────────────────────────────────────────────────────────────┤

1. GET /api/auth/me
   ├─ Auth: Bearer token required
   ├─ Returns: Current logged-in user
   ├─ Response: { success, user }
   └─ Status: 200 (OK) or 401 (Unauthorized)

2. PUT /api/auth/update-profile
   ├─ Auth: Bearer token required
   ├─ Body: { name?, phone?, address? }
   ├─ Validation: Same as signup (optional fields)
   ├─ Response: { success, user }
   └─ Status: 200 (OK) or 401 (Unauthorized)

3. POST /api/auth/logout
   ├─ Auth: Bearer token required
   ├─ Body: {}
   ├─ Action: Clear token on client (server just validates)
   ├─ Response: { success: true }
   └─ Status: 200 (OK) or 401 (Unauthorized)

Status Code Reference:
┌────┬────────────────────────────┐
│ 200│ OK - Request successful     │
│ 201│ Created - Resource created  │
│ 400│ Bad Request - Invalid input │
│ 401│ Unauthorized - Need token   │
│ 409│ Conflict - Email exists     │
│ 500│ Server Error - Backend issue│
└────┴────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
USER INTERACTION → FRONTEND → BACKEND → DATABASE → RESPONSE

Signup:
┌─────────────────────────────────────────────────────────────┐
│ User fills form                                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend validates locally                                  │
│ POST /api/auth/signup + body data                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend receives request                                    │
│ ├─ Validates all fields                                    │
│ ├─ Checks email not duplicate                              │
│ ├─ Hashes password with bcryptjs                           │
│ └─ Saves to database                                       │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Database: INSERT INTO users (...)                           │
│ ├─ id: 1 (auto-generated)                                  │
│ ├─ name: 'John Doe'                                        │
│ ├─ email: 'john@example.com'                               │
│ ├─ password: '$2b$10$...' (hashed)                         │
│ └─ role: 'user' (default)                                  │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend generates JWT token                                 │
│ {userId: 1, email: 'john@example.com', ...}               │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend sends response                                      │
│ {                                                           │
│   success: true,                                            │
│   token: 'eyJh...',                                         │
│   user: {id: 1, name: '...', email: '...', ...}           │
│ }                                                           │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend receives token                                     │
│ ├─ Stores in localStorage                                  │
│ ├─ Sets user state                                         │
│ ├─ Redirects to dashboard                                  │
│ └─ Adds Authorization header to future requests            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

```
┌──────────────────────────────────────────────────────────┐
│                  SECURITY IMPLEMENTATION                  │
├──────────────────────────────────────────────────────────┤

1. FRONTEND SECURITY
   ├─ Input validation before sending
   ├─ Token stored in localStorage (not cookies for simplicity)
   ├─ No sensitive data in localStorage
   └─ Clear token on logout

2. TRANSMISSION SECURITY
   ├─ HTTPS in production (HTTP in development)
   ├─ Authorization header: "Bearer {token}"
   ├─ CORS only allows localhost:3000 (or production domain)
   └─ Helmet headers secure browser

3. BACKEND VALIDATION
   ├─ Re-validate all inputs (never trust client)
   ├─ Check email format
   ├─ Check phone format
   ├─ Check string lengths
   ├─ SQL injection prevention (Sequelize ORM)
   └─ Rate limiting (future feature)

4. PASSWORD SECURITY
   ├─ Minimum 6 characters
   ├─ Hashed with bcryptjs (10 rounds)
   ├─ Hash takes ~100ms per password
   ├─ Even admin can't see plain password
   ├─ "Forgot password" would need email verification
   └─ Passwords never logged

5. TOKEN SECURITY
   ├─ Signed with JWT_SECRET
   ├─ Expires in 15 minutes
   ├─ Refresh token expires in 7 days
   ├─ Cannot be forged without secret
   ├─ Signature prevents tampering
   └─ Decoded only when needed

6. DATABASE SECURITY
   ├─ Unique email constraint prevents duplicates
   ├─ Connection pooling limits connections
   ├─ Passwords hashed before storage
   ├─ No sensitive data exposed in error messages
   ├─ Timestamps for audit trail
   └─ User role field for authorization

7. ERROR HANDLING
   ├─ Generic error messages to users
   ├─ Detailed errors only in server logs
   ├─ No database details in responses
   ├─ No file paths in responses
   ├─ No query details in responses
   └─ Proper HTTP status codes

8. LOGGING & MONITORING
   ├─ Morgan logs all requests
   ├─ Check backend terminal for:
   │  ├─ POST /api/auth/signup 201
   │  ├─ POST /api/auth/login 200
   │  ├─ GET /api/auth/me 200
   │  └─ POST /api/auth/signup 400 (validation error)
   └─ Logs don't contain passwords

```

---

## 📱 File Structure

```
ChocE_Moments/
├── backend/                          ← Your Node.js server
│   ├── src/
│   │   ├── server.js                ← Express app setup
│   │   ├── config/
│   │   │   └── database.js           ← MySQL connection
│   │   ├── models/
│   │   │   └── User.js               ← User schema
│   │   ├── controllers/
│   │   │   └── authController.js     ← Auth logic
│   │   ├── routes/
│   │   │   └── authRoutes.js         ← API endpoints
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     ← JWT verification
│   │   │   └── validation.js         ← Input validation
│   │   └── utils/
│   │       └── generateToken.js      ← JWT utilities
│   ├── .env                          ← Configuration
│   ├── package.json                  ← Dependencies
│   └── node_modules/                 ← 152 packages
│
├── frontend/                         ← Your React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthContext.tsx       ← UPDATE: Add backend calls
│   │   │   ├── AuthModal.tsx         ← UPDATE: Use API
│   │   │   ├── Cart.tsx              ← UPDATE: Send orders
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── COMPLETION_SUMMARY.md             ← Project overview
├── INTEGRATION_CHECKLIST.md          ← Your task list
└── ...

Backend Documentation:
├── QUICK_START.md                    ← Start here! (15 min)
├── FRONTEND_INTEGRATION.md           ← How to update React
├── XAMPP_SETUP.md                    ← MySQL setup
├── DATABASE_QUERIES.md               ← SQL commands
├── ARCHITECTURE.md                   ← This file
└── ... (13+ more files)
```

---

## ✅ Complete System Check

Before going live, verify:

- [ ] XAMPP MySQL running ✓
- [ ] Database `choce_moments` created ✓
- [ ] Backend running on :5000 ✓
- [ ] Frontend running on :3000 ✓
- [ ] Health check passes ✓
- [ ] Signup creates users ✓
- [ ] Login generates tokens ✓
- [ ] Token in localStorage ✓
- [ ] Protected routes work ✓
- [ ] No CORS errors ✓
- [ ] No auth errors ✓
- [ ] Database has hashed passwords ✓

All ✓? **You're production ready!** 🎉

---

**Next: Read QUICK_START.md to launch your system!**
