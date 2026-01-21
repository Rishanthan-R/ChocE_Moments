import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the current directory
// Assuming this script is run from the 'backend' directory
dotenv.config();

console.log("--- Email Debug Script ---");
console.log("Current Directory:", process.cwd());
console.log("EMAIL_USER:", process.env.EMAIL_USER ? process.env.EMAIL_USER : "(Missing)");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****** (Set)" : "(Missing)");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function testEmail() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("ERROR: EMAIL_USER or EMAIL_PASS is missing in .env");
        return;
    }

    try {
        console.log("Attempting to send email to:", process.env.EMAIL_USER);
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from Debug Script',
            text: 'If you receive this, your email configuration works!'
        });
        console.log("Success! Email sent.");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("FAILED to send email.");
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
    }
}

testEmail();
