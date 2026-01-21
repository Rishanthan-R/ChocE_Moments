import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateVerificationToken, sendVerificationEmail } from '../services/emailService.js';

dotenv.config();

/**
 * Create a new user (Registration)
 * Enhanced with email verification and security tracking
 */
export async function createUser(req, res) {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Get registration IP for security tracking
    const registrationIP = req.ip || req.connection.remoteAddress || 'unknown';

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            console.log(`[REGISTRATION] Duplicate email attempt: ${email} from IP: ${registrationIP}`);
            return res.status(409).json({
                status: 409,
                message: "An account with this email already exists"
            });
        }

        // Hash password
        const passwordHash = bcrypt.hashSync(password, 12); // Increased from 10 to 12 rounds

        // Generate email verification token
        const { token: verificationToken, expires: verificationExpires } = generateVerificationToken();

        // Create user data
        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: passwordHash,
            phone: phone || "NOT GIVEN",
            address: address || "",
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            registrationIP: registrationIP
        };

        const user = new User(userData);
        await user.save();

        // Send verification email
        const emailResult = await sendVerificationEmail(user, verificationToken);

        console.log(`[REGISTRATION] New user created: ${email} from IP: ${registrationIP}`);
        if (emailResult.simulated) {
            console.log(`[REGISTRATION] Verification token for ${email}: ${verificationToken}`);
        }

        res.status(201).json({
            status: 201,
            message: "Account created successfully! Please check your email to verify your account.",
            requiresVerification: true
        });

    } catch (error) {
        console.error(`[REGISTRATION] Error creating user: ${error.message}`);
        res.status(500).json({
            status: 500,
            message: "Failed to create account. Please try again."
        });
    }
}

/**
 * Login user
 * Enhanced with account lockout and security tracking
 */
export async function loginUser(req, res) {
    const { email, password } = req.body;
    const loginIP = req.ip || req.connection.remoteAddress || 'unknown';

    const genericErrorMessage = "Invalid email or password";

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log(`[LOGIN] Failed attempt - email not found: ${email} from IP: ${loginIP}`);
            return res.status(401).json({ message: genericErrorMessage });
        }

        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.accountLockedUntil - new Date()) / 1000 / 60);
            console.log(`[LOGIN] Locked account attempt: ${email} from IP: ${loginIP}`);
            return res.status(423).json({
                message: `Account temporarily locked. Try again in ${remainingMinutes} minutes.`,
                lockedUntil: user.accountLockedUntil
            });
        }

        // Verify password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            // Increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                await user.save();
                console.log(`[LOGIN] Account locked due to failed attempts: ${email}`);
                return res.status(423).json({
                    message: "Account locked due to too many failed attempts. Try again in 15 minutes."
                });
            }

            await user.save();
            console.log(`[LOGIN] Failed password attempt #${user.failedLoginAttempts}: ${email} from IP: ${loginIP}`);
            return res.status(401).json({ message: genericErrorMessage });
        }

        // Check if email is verified (optional - can be enforced)
        if (!user.isEmailVerified) {
            console.log(`[LOGIN] Unverified email attempt: ${email}`);
            // Allow login but flag it - you can make this stricter by returning 403
            // return res.status(403).json({
            //     message: "Please verify your email before logging in.",
            //     requiresVerification: true
            // });
        }

        // Check if user is blocked
        if (user.isBlocked) {
            console.log(`[LOGIN] Blocked user attempt: ${email}`);
            return res.status(403).json({
                message: "Your account has been suspended. Please contact support."
            });
        }

        // Successful login - reset failed attempts and update tracking
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = null;
        user.lastLoginIP = loginIP;
        user.lastLoginAt = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isBlocked: user.isBlocked,
                isEmailVerified: user.isEmailVerified,
                image: user.image
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Trigger n8n webhook (fire and forget) - unchanged from original
        const webhookPayload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        fetch('https://bpasindu.app.n8n.cloud/webhook-test/user-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
        }).catch(err => {
            console.error('[WEBHOOK] Failed to trigger login webhook:', err);
        });

        console.log(`[LOGIN] Successful login: ${email} from IP: ${loginIP}`);

        res.json({
            token: token,
            message: "Login successful",
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error(`[LOGIN] Error: ${error.message}`);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
}

export function isAdmin(req) {
    if (req.user == null) {
        return false;
    }
    return req.user.role === 'admin';
}