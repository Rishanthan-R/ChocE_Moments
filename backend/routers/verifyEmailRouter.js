import express from 'express';
import User from '../models/user.js';
import { generateVerificationToken, sendVerificationEmail } from '../services/emailService.js';

const verifyEmailRouter = express.Router();

/**
 * GET /api/verify-email/:token
 * Verify email using token from email link
 */
verifyEmailRouter.get('/:token', async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            status: 400,
            message: 'Verification token is required'
        });
    }

    try {
        // Find user with this token and token not expired
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            console.log(`[VERIFY-EMAIL] Invalid or expired token attempted: ${token.substring(0, 10)}...`);
            return res.status(400).json({
                status: 400,
                message: 'Invalid or expired verification token. Please request a new verification email.'
            });
        }

        // Update user as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        console.log(`[VERIFY-EMAIL] Email verified successfully for: ${user.email}`);

        // Redirect to frontend success page or return success JSON
        res.json({
            status: 200,
            message: 'Email verified successfully! You can now log in.',
            email: user.email
        });

    } catch (error) {
        console.error('[VERIFY-EMAIL] Error:', error);
        res.status(500).json({
            status: 500,
            message: 'Server error during verification. Please try again.'
        });
    }
});

/**
 * POST /api/verify-email/resend
 * Resend verification email
 */
verifyEmailRouter.post('/resend', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 400,
            message: 'Email is required'
        });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            // Don't reveal if email exists or not (security)
            return res.json({
                status: 200,
                message: 'If an account exists with this email, a verification link has been sent.'
            });
        }

        if (user.isEmailVerified) {
            return res.json({
                status: 200,
                message: 'Your email is already verified. You can log in.'
            });
        }

        // Generate new verification token
        const { token, expires } = generateVerificationToken();
        user.emailVerificationToken = token;
        user.emailVerificationExpires = expires;
        await user.save();

        // Send verification email
        const emailResult = await sendVerificationEmail(user, token);

        if (emailResult.success) {
            console.log(`[VERIFY-EMAIL] Resent verification email to: ${user.email}`);
        }

        res.json({
            status: 200,
            message: 'If an account exists with this email, a verification link has been sent.'
        });

    } catch (error) {
        console.error('[VERIFY-EMAIL] Resend error:', error);
        res.status(500).json({
            status: 500,
            message: 'Failed to resend verification email. Please try again.'
        });
    }
});

export default verifyEmailRouter;
