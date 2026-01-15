# Security Guide

## Environment Variables

This project uses environment variables to manage sensitive configuration settings such as database credentials and API keys.

### Security Best Practices

1.  **NEVER commit `.env` files to version control.**
    *   The `.gitignore` file is configured to exclude `.env` and `*.env` files.
    *   If you accidentally commit a `.env` file, remove it immediately from history:
        ```bash
        git rm --cached backend/.env
        ```
    *   Rotate any keys that were exposed.

2.  **Use `.env.example`**
    *   We provide a `.env.example` file in the `backend` directory.
    *   Copy this file to `.env` and fill in your actual values.
    *   Do not put real secrets in `.env.example`.

3.  **Production**
    *   In production environments, set environment variables using the hosting platform's configuration settings (e.g., Heroku Config Vars, Vercel Environment Variables, AWS Secrets Manager).

## Reporting Vulnerabilities

If you discover a security vulnerability within this project, please open an issue or contact the maintainers directly.
