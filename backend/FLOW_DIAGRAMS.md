# 🔐 Authentication Flow Diagram

## Sign Up Flow
```
┌─────────────┐
│   FRONTEND  │
│  Sign Up    │
│   Form      │
└──────┬──────┘
       │ POST /api/auth/signup
       │ {name, email, phone, address, password}
       │
       ▼
┌──────────────────────┐
│  BACKEND - Server    │
│  Express.js          │
└──────┬───────────────┘
       │
       ├─► Validate Input (express-validator)
       │   ✓ Email format
       │   ✓ Phone 10 digits
       │   ✓ Address min 10 chars
       │   ✓ Password min 6 chars
       │
       ├─► Check Email Exists
       │   └─► Query MySQL
       │       ✗ If exists → Error 400
       │
       ├─► Hash Password (bcryptjs)
       │   └─► 10 rounds salt
       │
       ├─► Create User in DB
       │   └─► INSERT into users table
       │
       ├─► Generate JWT Token
       │   └─► jwt.sign({userId, email, role})
       │
       ▼
    Response 201
    {
      success: true,
      token: "eyJhbGc...",
      refreshToken: "eyJhbGc...",
      user: {id, name, email, phone, address, role}
    }
       │
       ◄─────────────────────────────────
       │
       ▼
┌─────────────┐
│   FRONTEND  │
│ Store Token │
│ localStorage│
└─────────────┘
```

---

## Login Flow
```
┌──────────────────┐
│   FRONTEND       │
│  Login Form      │
│  email + pwd     │
└────────┬─────────┘
         │ POST /api/auth/login
         │
         ▼
┌──────────────────────┐
│  BACKEND - Server    │
└────────┬─────────────┘
         │
         ├─► Validate Input
         │   ✓ Email format
         │   ✓ Password not empty
         │
         ├─► Find User by Email
         │   └─► SELECT * FROM users WHERE email=?
         │       ✗ If not found → Error 401
         │
         ├─► Compare Password
         │   └─► bcrypt.compare(pwd, hashedPwd)
         │       ✗ If no match → Error 401
         │
         ├─► Generate JWT Token
         │   └─► jwt.sign({userId, email, role})
         │
         ▼
    Response 200
    {
      success: true,
      token: "eyJhbGc...",
      user: {id, name, email, phone, address, role}
    }
         │
         ◄─────────────────────────────────
         │
         ▼
┌──────────────────────┐
│   FRONTEND           │
│ Store Token          │
│ localStorage.setItem │
│ Update User State    │
└──────────────────────┘
```

---

## Protected Request Flow (e.g., Get Profile)
```
┌──────────────────────┐
│   FRONTEND           │
│  GET /api/auth/me    │
│  + Authorization     │
│    Header            │
└────────┬─────────────┘
         │
         │ Headers: {
         │   Authorization: Bearer eyJhbGc...
         │ }
         │
         ▼
┌──────────────────────┐
│  BACKEND - Server    │
│  authMiddleware      │
└────────┬─────────────┘
         │
         ├─► Extract Token from Header
         │   └─► Authorization.split(' ')[1]
         │       ✗ If no token → Error 401
         │
         ├─► Verify Token (jwt.verify)
         │   └─► Check signature
         │   └─► Check expiry
         │       ✗ If invalid → Error 401
         │       ✗ If expired → Error 401
         │
         ├─► Decode Token
         │   └─► Get userId, email, role
         │       └─► req.user = decoded
         │
         ▼
    Continue to Controller
┌──────────────────────┐
│  authController      │
│  getProfile()        │
└────────┬─────────────┘
         │
         ├─► Find User by ID
         │   └─► SELECT * FROM users WHERE id=?
         │
         ├─► Remove Password Field
         │   └─► Exclude: ['password']
         │
         ▼
    Response 200
    {
      success: true,
      user: {id, name, email, phone, address, role}
    }
         │
         ◄─────────────────────────────────
         │
         ▼
┌──────────────────────┐
│   FRONTEND           │
│  Update User State   │
│  Display Profile     │
└──────────────────────┘
```

---

## Token Lifecycle
```
Time ────────────────────────────────────────────────►

Generation          Expiry             Refresh
─────────────────────────────────────────────────
│                   │                  │
▼                   ▼                  ▼
User Login      15 minutes      Must Login Again
                Expires         OR use RefreshToken
                
LOGIN ──────────────────────── (expired)
                  ├─ Valid Request ✅
                  ├─ Valid Request ✅
                  └─ Expired Request ❌
                      └─ Error 401
                      └─ Redirect to Login
```

---

## Database Schema Diagram
```
┌─────────────────────────────────────────────────┐
│              MySQL Database                     │
│          "choce_moments"                        │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │           TABLE: users                   │  │
│  ├──────────────────────────────────────────┤  │
│  │ ▪ id (INT) PRIMARY KEY AUTO_INCREMENT    │  │
│  │ ▪ name (VARCHAR 100) NOT NULL            │  │
│  │ ▪ email (VARCHAR 100) UNIQUE NOT NULL    │  │
│  │ ▪ phone (VARCHAR 15) NOT NULL            │  │
│  │ ▪ address (VARCHAR 255) NOT NULL         │  │
│  │ ▪ password (VARCHAR 255) HASHED          │  │
│  │ ▪ role (ENUM: user, admin) DEFAULT user │  │
│  │ ▪ createdAt (TIMESTAMP)                  │  │
│  │ ▪ updatedAt (TIMESTAMP)                  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Security Layers
```
┌─────────────────────────────────────────────┐
│         SECURITY IMPLEMENTATION             │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: Input Validation                  │
│  ├─ express-validator                       │
│  ├─ Check email format                      │
│  ├─ Check phone digits                      │
│  ├─ Sanitize inputs                         │
│  └─ Return 400 if invalid                   │
│                                             │
│  Layer 2: Password Security                 │
│  ├─ Bcryptjs (10 rounds)                    │
│  ├─ Never store plain password              │
│  ├─ Compare hashed on login                 │
│  └─ Constant time comparison                │
│                                             │
│  Layer 3: JWT Authentication                │
│  ├─ Generate on signup/login                │
│  ├─ Verify on protected routes              │
│  ├─ Check signature                         │
│  ├─ Check expiry (15 min)                   │
│  └─ Return 401 if invalid                   │
│                                             │
│  Layer 4: HTTP Security                     │
│  ├─ Helmet headers                          │
│  ├─ CORS restrictions                       │
│  ├─ No credentials in URLs                  │
│  └─ HTTPS in production                     │
│                                             │
│  Layer 5: Error Handling                    │
│  ├─ No stack traces in production           │
│  ├─ Generic error messages                  │
│  ├─ Log errors internally                   │
│  └─ Return 500 on server error              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Request/Response Cycle
```
┌──────────────────────────────────────────────────────┐
│              Complete Request Cycle                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. CLIENT REQUEST                                   │
│     POST /api/auth/login                             │
│     Headers: { Content-Type: application/json }      │
│     Body: { email, password }                        │
│                                                      │
│  2. EXPRESS MIDDLEWARE                               │
│     ├─ Parse JSON                                    │
│     ├─ Helmet security headers                       │
│     └─ CORS check                                    │
│                                                      │
│  3. VALIDATION MIDDLEWARE                            │
│     ├─ Check email format                            │
│     ├─ Check password not empty                      │
│     └─ Trim/normalize input                          │
│                                                      │
│  4. ROUTE HANDLER                                    │
│     ├─ Call authController.login()                   │
│     └─ Pass request data                             │
│                                                      │
│  5. CONTROLLER LOGIC                                 │
│     ├─ Query database                                │
│     ├─ Compare password                              │
│     ├─ Generate JWT                                  │
│     └─ Build response                                │
│                                                      │
│  6. SERVER RESPONSE                                  │
│     Status: 200 OK or 401 Unauthorized               │
│     Headers: { Content-Type: application/json }      │
│     Body: { success, token, user }                   │
│                                                      │
│  7. CLIENT RECEIVES                                  │
│     ├─ Parse response                                │
│     ├─ Store token                                   │
│     ├─ Update UI                                     │
│     └─ Redirect if success                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Error Handling Flow
```
┌──────────────────────────────────────────────┐
│         ERROR RESPONSE HANDLING              │
├──────────────────────────────────────────────┤
│                                              │
│  Validation Error (400)                      │
│  ├─ Email missing/invalid                    │
│  ├─ Phone not 10 digits                      │
│  └─ Response: {success: false, errors: {...}}│
│                                              │
│  Duplicate Email (400)                       │
│  ├─ Email already in database                │
│  └─ Response: {success: false, message: ...} │
│                                              │
│  Authentication Error (401)                  │
│  ├─ Wrong password                           │
│  ├─ Invalid/expired token                    │
│  └─ Response: {success: false, message: ...} │
│                                              │
│  Not Found Error (404)                       │
│  ├─ User not found                           │
│  └─ Response: {success: false, message: ...} │
│                                              │
│  Server Error (500)                          │
│  ├─ Database connection failed               │
│  ├─ Unexpected exception                     │
│  └─ Response: {success: false, message: ...} │
│                                              │
└──────────────────────────────────────────────┘
```

---

**Status: ✅ Complete Authentication System**

All flows implemented and ready for production!
