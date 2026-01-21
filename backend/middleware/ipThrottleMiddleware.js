// In-memory store for IP tracking (use Redis in production for scalability)
const ipStore = new Map();

// Configuration
const CONFIG = {
    maxAttempts: 10, // Max failed attempts before blocking
    blockDuration: 60 * 60 * 1000, // 1 hour block duration
    cleanupInterval: 5 * 60 * 1000, // Clean old entries every 5 minutes
    suspiciousPatterns: [
        /^10\./,  // Private network ranges (shouldn't appear in production)
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    ]
};

// Track IP data
function getIpData(ip) {
    if (!ipStore.has(ip)) {
        ipStore.set(ip, {
            attempts: 0,
            firstAttempt: Date.now(),
            lastAttempt: Date.now(),
            blocked: false,
            blockedUntil: null,
            registrations: 0
        });
    }
    return ipStore.get(ip);
}

// Check if IP is suspicious (VPN/Proxy detection placeholder)
function isSuspiciousIP(ip) {
    // In production, integrate with services like IPQualityScore, MaxMind, etc.
    // For now, just log the IP for monitoring
    return false;
}

// Cleanup old entries to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    for (const [ip, data] of ipStore.entries()) {
        if (data.lastAttempt < oneHourAgo && !data.blocked) {
            ipStore.delete(ip);
        }
        // Unblock IPs whose block duration has expired
        if (data.blocked && data.blockedUntil && now > data.blockedUntil) {
            data.blocked = false;
            data.blockedUntil = null;
            data.attempts = 0;
            console.log(`[IP-THROTTLE] IP ${ip} unblocked after timeout`);
        }
    }
}, CONFIG.cleanupInterval);

// IP Throttle Middleware
export function ipThrottle(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const ipData = getIpData(ip);
    const now = Date.now();

    // Check if IP is blocked
    if (ipData.blocked) {
        if (ipData.blockedUntil && now > ipData.blockedUntil) {
            // Block expired, reset
            ipData.blocked = false;
            ipData.blockedUntil = null;
            ipData.attempts = 0;
        } else {
            const remainingTime = Math.ceil((ipData.blockedUntil - now) / 1000 / 60);
            console.log(`[IP-THROTTLE] Blocked IP ${ip} attempted access - ${remainingTime} minutes remaining`);
            return res.status(403).json({
                status: 403,
                message: `Your IP has been temporarily blocked due to suspicious activity. Try again in ${remainingTime} minutes.`,
                blockedUntil: ipData.blockedUntil
            });
        }
    }

    // Track attempt
    ipData.attempts++;
    ipData.lastAttempt = now;

    // Check for suspicious patterns
    if (isSuspiciousIP(ip)) {
        console.log(`[IP-THROTTLE] Suspicious IP detected: ${ip}`);
    }

    // Check attempt threshold
    if (ipData.attempts > CONFIG.maxAttempts) {
        ipData.blocked = true;
        ipData.blockedUntil = now + CONFIG.blockDuration;
        console.log(`[IP-THROTTLE] IP ${ip} BLOCKED - exceeded ${CONFIG.maxAttempts} attempts`);
        console.log(`[SECURITY-ALERT] Potential bot attack from IP: ${ip}`);

        return res.status(403).json({
            status: 403,
            message: 'Your IP has been temporarily blocked due to suspicious activity. Try again in 1 hour.',
            blockedUntil: ipData.blockedUntil
        });
    }

    // Attach IP data to request for logging purposes
    req.ipData = ipData;
    next();
}

// Middleware to track successful registrations
export function trackRegistration(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const ipData = getIpData(ip);

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json to detect successful registration
    res.json = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300 && data.message && data.message.includes('successfully')) {
            ipData.registrations++;
            console.log(`[IP-THROTTLE] IP ${ip} successful registration #${ipData.registrations}`);
        }
        return originalJson(data);
    };

    next();
}

// Export store for testing purposes
export function getIpStore() {
    return ipStore;
}

// Manual block IP (for admin use)
export function blockIP(ip, duration = CONFIG.blockDuration) {
    const ipData = getIpData(ip);
    ipData.blocked = true;
    ipData.blockedUntil = Date.now() + duration;
    console.log(`[IP-THROTTLE] IP ${ip} manually blocked for ${duration / 1000 / 60} minutes`);
}

// Unblock IP (for admin use)
export function unblockIP(ip) {
    const ipData = getIpData(ip);
    ipData.blocked = false;
    ipData.blockedUntil = null;
    ipData.attempts = 0;
    console.log(`[IP-THROTTLE] IP ${ip} manually unblocked`);
}
