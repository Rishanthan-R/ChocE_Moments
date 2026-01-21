import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests from this IP. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        console.log(`[RATE-LIMIT] IP ${req.ip} exceeded general rate limit`);
        res.status(429).json(options.message);
    }
});

// Strict registration rate limiter - 5 attempts per hour per IP
export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 registration attempts per hour
    message: {
        status: 429,
        message: 'Too many registration attempts. Please try again after 1 hour.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all requests, not just failed ones
    handler: (req, res, next, options) => {
        console.log(`[RATE-LIMIT] IP ${req.ip} exceeded registration rate limit - BLOCKED`);
        console.log(`[SECURITY] Potential bot attack detected from IP: ${req.ip}`);
        res.status(429).json(options.message);
    }
});

// Login rate limiter - 10 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login attempts per 15 minutes
    message: {
        status: 429,
        message: 'Too many login attempts. Please try again after 15 minutes.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
    handler: (req, res, next, options) => {
        console.log(`[RATE-LIMIT] IP ${req.ip} exceeded login rate limit`);
        res.status(429).json(options.message);
    }
});
