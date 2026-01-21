import dotenv from 'dotenv';

dotenv.config();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Minimum score threshold (0.0 - 1.0, higher is more likely human)
const MIN_SCORE = 0.5;

/**
 * Verify reCAPTCHA v3 token with Google's API
 * @param {string} token - The reCAPTCHA token from the client
 * @param {string} expectedAction - The expected action name (optional)
 * @returns {Promise<{success: boolean, score?: number, action?: string, error?: string}>}
 */
async function verifyRecaptcha(token, expectedAction = null) {
    if (!RECAPTCHA_SECRET_KEY) {
        console.warn('[CAPTCHA] RECAPTCHA_SECRET_KEY not configured - skipping verification in development');
        return { success: true, score: 1.0, action: 'development_bypass' };
    }

    if (!token) {
        return { success: false, error: 'No reCAPTCHA token provided' };
    }

    try {
        const params = new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY,
            response: token
        });

        const response = await fetch(RECAPTCHA_VERIFY_URL, {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (!data.success) {
            console.log(`[CAPTCHA] Verification failed: ${JSON.stringify(data['error-codes'])}`);
            return {
                success: false,
                error: 'reCAPTCHA verification failed',
                errorCodes: data['error-codes']
            };
        }

        // Check score threshold
        if (data.score < MIN_SCORE) {
            console.log(`[CAPTCHA] Low score detected: ${data.score} (threshold: ${MIN_SCORE})`);
            return {
                success: false,
                score: data.score,
                error: `Suspicious activity detected (score: ${data.score})`
            };
        }

        // Check action if specified
        if (expectedAction && data.action !== expectedAction) {
            console.log(`[CAPTCHA] Action mismatch: expected ${expectedAction}, got ${data.action}`);
            return {
                success: false,
                error: 'reCAPTCHA action mismatch'
            };
        }

        console.log(`[CAPTCHA] Verification successful - Score: ${data.score}, Action: ${data.action}`);
        return {
            success: true,
            score: data.score,
            action: data.action,
            hostname: data.hostname
        };

    } catch (error) {
        console.error('[CAPTCHA] Error verifying reCAPTCHA:', error);
        return {
            success: false,
            error: 'Failed to verify reCAPTCHA - server error'
        };
    }
}

/**
 * Middleware factory to verify reCAPTCHA on specific routes
 * @param {string} action - Expected action name for this route
 * @returns {Function} Express middleware
 */
export function verifyCaptcha(action = 'register') {
    return async (req, res, next) => {
        const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];

        const result = await verifyRecaptcha(token, action);

        if (!result.success) {
            console.log(`[CAPTCHA] Request blocked from IP ${req.ip}: ${result.error}`);
            return res.status(400).json({
                status: 400,
                message: result.error || 'CAPTCHA verification failed. Please try again.',
                captchaRequired: true
            });
        }

        // Attach captcha result to request for logging
        req.captchaResult = result;
        next();
    };
}

/**
 * Optional CAPTCHA middleware - only enforces if configured
 * Falls back to allowing request if RECAPTCHA_SECRET_KEY is not set
 */
export function optionalCaptcha(action = 'register') {
    return async (req, res, next) => {
        // Skip if not configured (development mode)
        if (!RECAPTCHA_SECRET_KEY) {
            console.log('[CAPTCHA] Skipping verification - not configured');
            return next();
        }

        const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];

        // If no token provided, continue but log warning
        if (!token) {
            console.warn(`[CAPTCHA] No token provided from IP ${req.ip} - allowing but flagged`);
            req.captchaSkipped = true;
            return next();
        }

        const result = await verifyRecaptcha(token, action);

        if (!result.success) {
            console.log(`[CAPTCHA] Failed verification from IP ${req.ip}: ${result.error}`);
            return res.status(400).json({
                status: 400,
                message: result.error || 'CAPTCHA verification failed. Please try again.',
                captchaRequired: true
            });
        }

        req.captchaResult = result;
        next();
    };
}

export default verifyCaptcha;
