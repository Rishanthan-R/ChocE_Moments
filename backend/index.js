import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Routers
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import verifyEmailRouter from "./routers/verifyEmailRouter.js";

// Security Middleware
import { generalLimiter, registrationLimiter, loginLimiter } from "./middleware/rateLimitMiddleware.js";
import { ipThrottle, trackRegistration } from "./middleware/ipThrottleMiddleware.js";
import { optionalCaptcha } from "./middleware/captchaMiddleware.js";
import { registrationValidation, loginValidation, handleValidationErrors, sanitizeInput } from "./middleware/validationMiddleware.js";

dotenv.config();

const app = express();

// Trust proxy for correct IP detection (important for rate limiting)
app.set('trust proxy', 1);

// Enable CORS for frontend
app.use(cors());

// Apply general rate limiter to all requests
app.use(generalLimiter);

// Request logging middleware with security info
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${ip}`);
    next();
});

// Body parser with size limits (prevent large payload attacks)
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size to 10KB
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize all input
app.use(sanitizeInput);

// JWT Authentication Middleware (unchanged)
app.use((req, res, next) => {
    const value = req.get('authorization');
    if (value != null) {
        const token = value.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err || decoded == null) {
                return res.status(403).json({
                    message: "Unauthorized"
                });
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
});

// Database connection
const connectionString = process.env.DATABASE_URL;

mongoose.connect(connectionString).then(() => {
    console.log("✅ Connected to database");
}).catch((error) => {
    console.error("❌ Failed to connect to the database:", error.message);
    console.error("Please check your DATABASE_URL in .env file");
});

// =====================================
// ROUTES WITH SECURITY MIDDLEWARE
// =====================================

// Health check endpoint (no rate limit)
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        security: {
            rateLimiting: 'enabled',
            captcha: process.env.RECAPTCHA_SECRET_KEY ? 'enabled' : 'disabled (development)',
            emailVerification: 'enabled'
        }
    });
});

// Email verification routes
app.use('/api/verify-email', verifyEmailRouter);

// User routes with enhanced security
// Registration: Rate limit + IP throttle + CAPTCHA + Validation
app.post('/api/users',
    registrationLimiter,        // Layer 1: Rate limiting (5/hour)
    ipThrottle,                 // Layer 2: IP throttling
    trackRegistration,          // Track registrations
    optionalCaptcha('register'), // Layer 3: CAPTCHA (optional in dev)
    registrationValidation,     // Layer 4: Input validation
    handleValidationErrors,     // Handle validation errors
    (await import('./controllers/userController.js')).createUser
);

// Login: Rate limit + CAPTCHA + Validation
app.post('/api/users/login',
    loginLimiter,               // Rate limiting (10/15min)
    optionalCaptcha('login'),   // Layer: CAPTCHA verification
    loginValidation,            // Input validation
    handleValidationErrors,     // Handle validation errors
    (await import('./controllers/userController.js')).loginUser
);


// Other user routes (protected by general rate limiter)
app.use('/api/users', userRouter);

// Product and Order routes
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// =====================================
// ERROR HANDLING
// =====================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json({
        status: 500,
        message: 'Internal server error'
    });
});

// =====================================
// SERVER STARTUP
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           🍫 ChocE Moments Backend Server                   ║
╠════════════════════════════════════════════════════════════╣
║  Server started on port ${PORT}                               ║
║                                                            ║
║  Security Features:                                        ║
║  ✅ Rate Limiting (General: 100/15min)                      ║
║  ✅ Registration Limit (5/hour per IP)                      ║
║  ✅ Login Limit (10/15min per IP)                           ║
║  ✅ IP Throttling & Blocking                                ║
║  ✅ CAPTCHA: ${process.env.RECAPTCHA_SECRET_KEY ? 'Enabled' : 'Disabled (set RECAPTCHA_SECRET_KEY)'}              ║
║  ✅ Input Validation & Sanitization                         ║
║  ✅ Email Verification                                      ║
║  ✅ Account Lockout (5 failed attempts)                     ║
╚════════════════════════════════════════════════════════════╝
    `);
});
