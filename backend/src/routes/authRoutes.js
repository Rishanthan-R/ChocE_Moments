import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  logout
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  handleValidationErrors
} from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/me', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, validateProfileUpdate, handleValidationErrors, updateProfile);
router.post('/logout', authMiddleware, logout);

export default router;
