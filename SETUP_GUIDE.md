# ChocE Moments - Setup Guide

This is a MERN (MongoDB, Express, React, Node.js) project for ChocE Moments, a premium handmade chocolate gifting platform.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - You can either:
   - Install MongoDB locally - [Download here](https://www.mongodb.com/try/download/community)
   - Use MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

3. **npm** (comes with Node.js) or **yarn**

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
# From the root directory
npm install
```

### Step 2: Set Up Backend Environment Variables

1. Navigate to the `backend` folder
2. Create a `.env` file (copy from `.env.example` if it exists, or create a new one)
3. Add the following variables:

```env
DATABASE_URL=mongodb://localhost:27017/choce_moments
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Important Notes:**
- **DATABASE_URL**: 
  - For local MongoDB: `mongodb://localhost:27017/choce_moments`
  - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/choce_moments`
- **JWT_SECRET**: Generate a random secret key. You can use:
  ```bash
  openssl rand -base64 32
  ```
  Or use any random string (at least 32 characters recommended)

### Step 3: Start MongoDB (if using local MongoDB)

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start it manually:
mongod
```

**macOS/Linux:**
```bash
# If installed via Homebrew:
brew services start mongodb-community
# Or:
mongod
```

**Note:** If you're using MongoDB Atlas, you don't need to start MongoDB locally.

### Step 4: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
Connected to database
Server started on port 5000
```

The backend server will run on `http://localhost:5000`

### Step 5: Start the Frontend Development Server

Open a **new terminal window** (keep the backend running), and from the root directory:

```bash
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

The frontend will run on `http://localhost:3000`

## 🎯 Running the Application

1. **Backend** should be running on `http://localhost:5000`
2. **Frontend** should be running on `http://localhost:3000`
3. Open your browser and go to `http://localhost:3000`

## 📁 Project Structure

```
ChocE_Moments/
├── backend/              # Backend API (Express + MongoDB)
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB models
│   ├── routers/         # API routes
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
├── frontend/            # Frontend (React + Vite)
│   ├── components/     # React components
│   ├── App.tsx         # Main app component
│   └── index.tsx       # Entry point
├── package.json        # Frontend dependencies
└── vite.config.ts      # Vite configuration
```

## 🔧 Troubleshooting

### Backend Issues

**Problem: "Failed to connect to the database"**
- Make sure MongoDB is running (if using local MongoDB)
- Check your `DATABASE_URL` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

**Problem: "Port 5000 already in use"**
- Change the `PORT` in `.env` file to a different port (e.g., 5001)
- Or stop the process using port 5000

**Problem: "Cannot find module"**
- Make sure you ran `npm install` in the `backend` folder
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Frontend Issues

**Problem: "Cannot connect to backend"**
- Make sure the backend server is running on port 5000
- Check the browser console for CORS errors
- Verify `API_BASE_URL` in `frontend/components/AuthContext.tsx` is `http://localhost:5000/api`

**Problem: "Port 3000 already in use"**
- Vite will automatically try the next available port
- Or change the port in `vite.config.ts`

**Problem: "Module not found"**
- Make sure you ran `npm install` in the root directory
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## 🧪 Testing the Connection

1. **Test Backend:**
   - Open `http://localhost:5000/api/products` in your browser
   - You should see a JSON response (might be empty array `[]`)

2. **Test Frontend:**
   - Open `http://localhost:3000`
   - Try to sign up or login
   - Check browser console (F12) for any errors

## 📝 API Endpoints

### User Endpoints
- `POST /api/users` - Create a new user (signup)
- `POST /api/users/login` - Login user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:productId` - Get product by ID
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:productId` - Update product (requires auth)
- `DELETE /api/products/:productId` - Delete product (requires auth)

### Order Endpoints
- `GET /api/orders` - Get all orders (requires auth)
- `POST /api/orders` - Create order (requires auth)

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
- When you login/signup, a token is stored in localStorage
- The token is sent with API requests in the `Authorization` header
- Format: `Bearer <token>`

## 📦 Dependencies

### Backend
- Express - Web framework
- Mongoose - MongoDB ODM
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-Origin Resource Sharing
- dotenv - Environment variables

### Frontend
- React - UI library
- Vite - Build tool
- TypeScript - Type safety

## 🆘 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure both servers are running
4. Check that MongoDB is running (if using local)

## 🎉 You're All Set!

Once both servers are running, you can:
- Browse products on the frontend
- Sign up for a new account
- Login with your credentials
- Add items to cart
- Place orders

Happy coding! 🍫

