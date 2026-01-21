import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@chocemoments.com';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Create transporter (reusable across requests)
let transporter = null;

function getTransporter() {
    if (!transporter) {
        // Check if email is configured
        if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
            console.warn('[EMAIL] SMTP credentials not configured - emails will be logged to console');
            return null;
        }
        transporter = nodemailer.createTransport(EMAIL_CONFIG);
    }
    return transporter;
}

/**
 * Generate a secure verification token
 * @returns {Object} Token data with token string and expiry date
 */
export function generateVerificationToken() {
    const token = uuidv4() + '-' + uuidv4(); // Extra long for security
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return { token, expires };
}

/**
 * Send verification email to user
 * @param {Object} user - User object with email, firstName
 * @param {string} token - Verification token
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendVerificationEmail(user, token) {
    const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

    const emailContent = {
        from: `"ChocE Moments" <${FROM_EMAIL}>`,
        to: user.email,
        subject: '🍫 Verify Your ChocE Moments Account',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #16302B 0%, #1e4038 100%); border-radius: 16px;">
                <div style="text-align: center; padding: 20px;">
                    <h1 style="color: #C7A07A; margin: 0; font-size: 28px;">🍫 ChocE Moments</h1>
                </div>
                
                <div style="background: rgba(253, 252, 232, 0.95); padding: 30px; border-radius: 12px; margin: 20px 0;">
                    <h2 style="color: #16302B; margin-top: 0;">Welcome, ${user.firstName}! 👋</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Thank you for creating an account with ChocE Moments! To complete your registration and start enjoying our delicious chocolates, please verify your email address.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background: #C7A07A; color: #16302B; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(199, 160, 122, 0.3);">
                            ✉️ Verify My Email
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        Or copy and paste this link into your browser:<br>
                        <a href="${verificationUrl}" style="color: #16302B; word-break: break-all;">${verificationUrl}</a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p style="color: #999; font-size: 12px; margin-bottom: 0;">
                        This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                    </p>
                </div>
                
                <div style="text-align: center; padding: 15px; color: #C7A07A; font-size: 12px;">
                    <p style="margin: 0;">© 2026 ChocE Moments. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
Welcome to ChocE Moments, ${user.firstName}!

Please verify your email address by clicking the link below:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

© 2026 ChocE Moments
        `
    };

    const transport = getTransporter();

    // If no transport configured, log to console (development mode)
    if (!transport) {
        console.log('[EMAIL] === SIMULATED EMAIL (No SMTP configured) ===');
        console.log(`[EMAIL] To: ${user.email}`);
        console.log(`[EMAIL] Subject: ${emailContent.subject}`);
        console.log(`[EMAIL] Verification URL: ${verificationUrl}`);
        console.log('[EMAIL] ============================================');
        return { success: true, simulated: true };
    }

    try {
        const info = await transport.sendMail(emailContent);
        console.log(`[EMAIL] Verification email sent to ${user.email} - MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL] Failed to send verification email:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 */
export async function sendPasswordResetEmail(user, token) {
    const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;

    const emailContent = {
        from: `"ChocE Moments" <${FROM_EMAIL}>`,
        to: user.email,
        subject: '🔐 Reset Your ChocE Moments Password',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #16302B 0%, #1e4038 100%); border-radius: 16px;">
                <div style="text-align: center; padding: 20px;">
                    <h1 style="color: #C7A07A; margin: 0; font-size: 28px;">🍫 ChocE Moments</h1>
                </div>
                
                <div style="background: rgba(253, 252, 232, 0.95); padding: 30px; border-radius: 12px; margin: 20px 0;">
                    <h2 style="color: #16302B; margin-top: 0;">Password Reset Request</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Hi ${user.firstName}, we received a request to reset your password. Click the button below to create a new password.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; background: #C7A07A; color: #16302B; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                            🔐 Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px;">
                        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                    </p>
                </div>
            </div>
        `,
        text: `Password Reset Request\n\nHi ${user.firstName}, click the link below to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.`
    };

    const transport = getTransporter();

    if (!transport) {
        console.log('[EMAIL] === SIMULATED PASSWORD RESET EMAIL ===');
        console.log(`[EMAIL] To: ${user.email}`);
        console.log(`[EMAIL] Reset URL: ${resetUrl}`);
        return { success: true, simulated: true };
    }

    try {
        const info = await transport.sendMail(emailContent);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[EMAIL] Password reset email failed:', error.message);
        return { success: false, error: error.message };
    }
}

export default {
    generateVerificationToken,
    sendVerificationEmail,
    sendPasswordResetEmail
};
