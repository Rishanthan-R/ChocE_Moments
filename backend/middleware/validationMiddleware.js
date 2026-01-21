import { body, validationResult } from 'express-validator';

// List of known disposable email domains
const DISPOSABLE_DOMAINS = [
    'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'getnada.com', 'maildrop.cc', 'dispostable.com'
];

/**
 * Check if email uses a disposable/temporary email domain
 */
function isDisposableEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Validation rules for user registration
 */
export const registrationValidation = [
    // First Name validation
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

    // Last Name validation
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

    // Email validation
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email is too long')
        .custom((value) => {
            if (isDisposableEmail(value)) {
                throw new Error('Disposable email addresses are not allowed');
            }
            return true;
        }),

    // Password validation
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .not().matches(/\s/).withMessage('Password cannot contain spaces'),

    // Phone validation (optional but validated if present)
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10,15}$/).withMessage('Phone number must be 10-15 digits'),

    // Address validation (optional but validated if present)
    body('address')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage('Address must be 10-500 characters if provided')
];

/**
 * Validation rules for login
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

/**
 * Middleware to handle validation errors
 */
export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        console.log(`[VALIDATION] Failed validation from IP ${req.ip}:`, errorMessages);

        return res.status(400).json({
            status: 400,
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(req, res, next) {
    // Recursively sanitize string values in request body
    function sanitize(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove potential script tags and trim
                obj[key] = obj[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]+>/g, '')
                    .trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    }

    if (req.body && typeof req.body === 'object') {
        sanitize(req.body);
    }

    next();
}

export default {
    registrationValidation,
    loginValidation,
    handleValidationErrors,
    sanitizeInput
};
