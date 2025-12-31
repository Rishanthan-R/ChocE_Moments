# ChocE Moments - Backend Server

Premium chocolate e-commerce backend API built with Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+ or v8.0+)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Create MySQL Database**
```sql
CREATE DATABASE choce_moments;
```

3. **Configure Environment Variables**
Create `.env` file in backend root:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=choce_moments

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_key_2025
JWT_REFRESH_EXPIRE=7d
```

4. **Start Development Server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📋 API Endpoints

### Authentication Routes

#### 1. Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0706878899",
  "address": "123 Main St, Colombo",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main St, Colombo",
    "role": "user",
    "createdAt": "2025-12-18T10:30:00Z"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main St, Colombo",
    "role": "user"
  }
}
```

#### 3. Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0706878899",
    "address": "123 Main St, Colombo",
    "role": "user",
    "createdAt": "2025-12-18T10:30:00Z"
  }
}
```

#### 4. Update Profile
```
PUT /api/auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "0706878800",
  "address": "456 Oak St, Colombo"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "john@example.com",
    "phone": "0706878800",
    "address": "456 Oak St, Colombo",
    "role": "user"
  }
}
```

#### 5. Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  address VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email)
);
```

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation and sanitization
- ✅ Error handling without exposing sensitive info

---

## 🧪 Testing with Postman

1. Import the endpoints above into Postman
2. Set `http://localhost:5000` as base URL
3. Test Sign Up first
4. Copy token from response
5. Use token in Authorization header for protected endpoints

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── models/
│   │   └── User.js              # User schema
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── validation.js        # Request validation
│   ├── utils/
│   │   └── generateToken.js     # JWT utilities
│   └── server.js                # Express app setup
├── .env                         # Environment variables
├── package.json
└── README.md
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
- Check MySQL is running
- Verify DB credentials in `.env`
- Ensure database `choce_moments` is created

### JWT Token Errors
- Make sure to include `Authorization: Bearer {token}` header
- Check token is not expired (15 min expiry)
- Verify JWT_SECRET in .env

### CORS Errors
- Check CLIENT_URL in .env matches frontend URL
- Restart server after changing .env

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| CLIENT_URL | Frontend URL | http://localhost:5173 |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | (empty) |
| DB_NAME | Database name | choce_moments |
| JWT_SECRET | JWT secret key | your_secret_key |
| JWT_EXPIRE | Token expiry | 15m |

---

## 🚀 Next Steps

1. Test all auth endpoints with Postman
2. Update frontend to use backend API
3. Replace localStorage auth with JWT tokens
4. Add products and orders endpoints
5. Deploy to production

---

## 📧 Support

For issues or questions, contact: chocemoments@gmail.com

---

**Made with ❤️ for ChocE Moments**
