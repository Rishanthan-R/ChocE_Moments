# 🚀 Backend Quick Start Guide

## 📦 What's Been Created

Your Node.js + Express + MySQL authentication backend is ready! Here's what you have:

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          ← MySQL connection setup
│   ├── models/
│   │   └── User.js              ← User table schema
│   ├── controllers/
│   │   └── authController.js    ← Auth logic (signup, login, etc)
│   ├── routes/
│   │   └── authRoutes.js        ← API endpoints
│   ├── middlewares/
│   │   ├── authMiddleware.js    ← JWT verification
│   │   └── validation.js        ← Input validation
│   ├── utils/
│   │   └── generateToken.js     ← JWT token helpers
│   └── server.js                ← Main Express app
├── .env                         ← Configuration
├── package.json                 ← Dependencies
└── ChocE_Moments_Auth_API.postman_collection.json
```

---

## ⚙️ Setup Steps (5 minutes)

### Step 1: Install MySQL
**READ THIS FIRST:** [MYSQL_SETUP.md](./MYSQL_SETUP.md)

Quick version:
- Download MySQL from https://dev.mysql.com/downloads/mysql/
- Install with default settings
- Make sure MySQL is running
- Create database: `CREATE DATABASE choce_moments;`

### Step 2: Configure .env (Already Done ✅)
File is at `backend/.env` with settings:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=choce_moments
```
**If MySQL has a password, update `DB_PASSWORD` in .env**

### Step 3: Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MySQL Database connected successfully
✅ Database synchronized

╔════════════════════════════════════════╗
║   ChocE Moments Backend Server         ║
╠════════════════════════════════════════╣
║   Port: 5000                           ║
║   Environment: development             ║
║   Status: ✅ Running                    ║
╚════════════════════════════════════════╝
```

---

## 🧪 Test API (Using Postman)

### Option 1: Import Postman Collection (Easiest)
1. Download and open Postman: https://www.postman.com/downloads/
2. Click **Import** → Select `ChocE_Moments_Auth_API.postman_collection.json`
3. Variables are set automatically (base_url, token)
4. Run requests in order

### Option 2: Manual Testing

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Sign Up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main St, Colombo",
    "password": "password123"
  }'
```

Response (copy the `token`):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Current User (with token):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ All Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/signup` | Create account | ❌ No |
| POST | `/api/auth/login` | Login | ❌ No |
| GET | `/api/auth/me` | Get profile | ✅ Yes |
| PUT | `/api/auth/update-profile` | Update profile | ✅ Yes |
| POST | `/api/auth/logout` | Logout | ✅ Yes |
| GET | `/api/health` | Server status | ❌ No |

---

## 🔄 How to Use Token

### Getting Token
1. Sign up or login
2. Copy the `token` from response

### Using Token
Add to header for protected endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Expiry
- Token expires in **15 minutes**
- Need to login again after expiry

---

## 📊 Database Structure

### Users Table (Auto-created)
```sql
id          INT (auto increment)
name        VARCHAR(100)
email       VARCHAR(100) UNIQUE
phone       VARCHAR(15)
address     VARCHAR(255)
password    VARCHAR(255) [hashed]
role        ENUM('user', 'admin')
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `connect ECONNREFUSED` | MySQL not running. Run `net start MySQL80` |
| `Access denied for user` | Check DB_USER and DB_PASSWORD in .env |
| `Unknown database` | Create database: `CREATE DATABASE choce_moments;` |
| `Port 5000 already in use` | Change PORT in .env |
| `Email already registered` | Use different email or delete user from DB |

---

## 🔐 Security Features

✅ Password hashing with bcryptjs (10 rounds)
✅ JWT token authentication
✅ Input validation on all endpoints
✅ CORS protection
✅ Helmet security headers
✅ Error handling (no sensitive info exposed)

---

## 📝 Next: Frontend Integration

Once backend is working, update your frontend to use the API:

1. Replace localStorage auth with API calls
2. Store JWT token in localStorage
3. Send token in Authorization header for protected endpoints
4. Handle token expiry and refresh

---

## 📂 Files Location

```
e:\Bussiness ideas\ChocE Moments\Website\ChocE_Moments\
├── backend/                     ← Your backend code
│   ├── src/                     ← Source files
│   ├── node_modules/            ← Dependencies
│   ├── .env                     ← Configuration
│   ├── package.json             ← Dependencies list
│   ├── README.md                ← Full documentation
│   ├── MYSQL_SETUP.md           ← MySQL setup guide
│   └── ChocE_Moments_Auth_API.postman_collection.json
└── frontend/                    ← Your frontend code
    └── (React app)
```

---

## 🚀 Commands

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Start production server
npm start
```

---

## 📞 Quick References

- **Server:** http://localhost:5000
- **Frontend:** http://localhost:5173
- **MySQL:** localhost:3306
- **Database:** choce_moments
- **Documentation:** README.md

---

**Status: ✅ Backend Ready!**

Next: Make sure MySQL is running, then test the API! 🎉

---

Questions? Check the full documentation:
- [README.md](./README.md) - Complete API docs
- [MYSQL_SETUP.md](./MYSQL_SETUP.md) - Database setup
- [src/](./src/) - Source code
