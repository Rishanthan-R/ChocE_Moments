# 📋 Quick Reference Card

## 🚀 Start Backend
```bash
cd backend
npm run dev
```
Server: http://localhost:5000

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Full API documentation |
| **QUICKSTART.md** | 5-minute setup |
| **MYSQL_SETUP.md** | Database installation |
| **TESTING_GUIDE.md** | All testing methods |
| **FLOW_DIAGRAMS.md** | Visual workflow diagrams |
| **IMPLEMENTATION_COMPLETE.md** | Summary of what's built |
| **ChocE_Moments_Auth_API.postman_collection.json** | Postman tests |

---

## 🔌 API Endpoints

### Public Routes
```
POST   /api/auth/signup         (Create account)
POST   /api/auth/login          (Login)
GET    /api/health              (Server check)
```

### Protected Routes (Require JWT Token)
```
GET    /api/auth/me             (Get profile)
PUT    /api/auth/update-profile (Update profile)
POST   /api/auth/logout         (Logout)
```

---

## 🔑 How to Use Token

### Get Token
1. Sign Up or Login
2. Copy `token` from response

### Use Token
```
Authorization: Bearer {token_here}
```

### Token Duration
- Valid for: **15 minutes**
- Then: Login again

---

## 📋 Request Examples

### Sign Up
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0706878899",
  "address": "123 Main St, Colombo",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile
```json
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

### Update Profile
```json
PUT /api/auth/update-profile
Headers: Authorization: Bearer {token}
{
  "name": "Jane Doe",
  "phone": "0706878800",
  "address": "456 Oak St, Colombo"
}
```

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| **Name** | 2-100 characters |
| **Email** | Valid format, unique |
| **Phone** | 10-15 digits only |
| **Address** | Minimum 10 characters |
| **Password** | Minimum 6 characters |

---

## 🐛 Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | MySQL not running | `net start MySQL80` |
| `Email already registered` | Email exists | Use different email |
| `Authorization token required` | No token in header | Add Bearer token |
| `Invalid or expired token` | Bad/expired token | Login again |
| `Port 5000 already in use` | Port conflict | Change PORT in .env |

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens (15 min expiry)
- ✅ Input validation
- ✅ CORS protection
- ✅ Helmet headers
- ✅ No passwords in responses

---

## 🗄️ Database

### Table: `users`
- id (auto increment)
- name
- email (unique)
- phone
- address
- password (hashed)
- role (user/admin)
- timestamps

### Create Database
```sql
CREATE DATABASE choce_moments;
```

---

## 🔄 Frontend Integration

Replace this (localStorage):
```javascript
localStorage.setItem('choce_user_data', userData)
localStorage.getItem('choce_user_data')
```

With this (JWT):
```javascript
localStorage.setItem('token', jwtToken)
headers: { 'Authorization': `Bearer ${token}` }
```

---

## 📊 Architecture

```
Frontend (React)
      ↓ (HTTP)
Backend (Express + Node.js)
      ↓ (SQL)
Database (MySQL)
```

---

## 🚀 Environment Variables

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=choce_moments

JWT_SECRET=your_secret_key
JWT_EXPIRE=15m
```

---

## 📱 Testing with Postman

1. Open Postman
2. Import: `ChocE_Moments_Auth_API.postman_collection.json`
3. Run requests in order
4. Token auto-saved

---

## 💾 File Structure

```
backend/
├── src/
│   ├── config/database.js
│   ├── models/User.js
│   ├── controllers/authController.js
│   ├── routes/authRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validation.js
│   ├── utils/generateToken.js
│   └── server.js
├── .env
├── package.json
└── docs/
```

---

## 🎯 Next Steps

- [ ] Start backend: `npm run dev`
- [ ] Test with Postman
- [ ] Update frontend API calls
- [ ] Replace localStorage auth
- [ ] Test end-to-end
- [ ] Deploy

---

## 📞 Quick Links

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MySQL: localhost:3306
- Docs: See files in backend/

---

## 🔗 Response Format

### Success Response
```json
{
  "success": true,
  "message": "...",
  "token": "...",
  "user": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "...",
  "errors": { ... }
}
```

---

## ⏱️ Response Times

- Health Check: < 10ms
- Sign Up: < 100ms
- Login: < 100ms
- Get Profile: < 50ms

---

**Everything you need to know on one page! 📄**

For detailed info, see the full documentation files.
