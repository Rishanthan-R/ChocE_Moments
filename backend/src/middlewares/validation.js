import { body, validationResult } from 'express-validator';

// Validation rules for signup
export const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  body('address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Validation rules for login
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone must be 10-15 digits'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters')
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap = {};
    errors.array().forEach(error => {
      errorMap[error.param] = error.msg;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMap
    });
  }
  next();
};
