import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// Security Headers
app.use(helmet());

// Logging Middleware (Merged from main)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// JSON parser (body-parser not needed in modern Express)
app.use(express.json({ limit: '10kb' })); // Body limit

// Data Sanitization against NoSQL Query Injection
// app.use(mongoSanitize());

// Data Sanitization against XSS
// app.use(xss());

// Enable CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

/* =========================
   JWT AUTH MIDDLEWARE
========================= */
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(); // allow public routes (signup/login)
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized" });
    }
});

/* =========================
   ROUTES
========================= */
// Health check endpoint (Merged from main)
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to database"))
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
