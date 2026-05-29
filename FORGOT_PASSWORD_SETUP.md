# Forgot Password & Reset Password System - Setup Guide

## Overview

This implementation provides a secure password recovery flow with:
- **JWT token-based reset links** - Cryptographically secure token generation
- **Email delivery** - Nodemailer integration with Gmail SMTP
- **15-minute expiration** - Automatic token expiry for security
- **Rate limiting** - Max 3 attempts per hour to prevent abuse
- **User enumeration protection** - Generic responses to prevent email harvesting
- **Strong password requirements** - Minimum length + character variety validation
- **Modern UI** - Beautiful, responsive pages with password strength indicator

---

## Backend Setup

### 1. Dependencies

Verify that all required packages are installed in `backend/`:

```bash
npm install bcryptjs nodemailer crypto
```

These should already be in `package.json`, but confirm with:
```bash
npm list bcryptjs nodemailer
```

### 2. Environment Variables

Update your `backend/.env` file with Gmail configuration:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM="Smart Student Tasks <your-email@gmail.com>"

# Frontend callback URL (must match exactly)
CLIENT_URL=http://localhost:5173

# For production:
# CLIENT_URL=https://yourdomain.com
```

### 3. Gmail App Password Setup (Recommended for Production)

**Why?** Gmail requires "App Passwords" for third-party apps (instead of using your real password).

**Steps:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already done
3. Go back to Security settings
4. Find **App passwords** (only appears if 2FA is enabled)
5. Select: Mail → Windows Computer (or your environment)
6. Copy the 16-character app password
7. Use this as `EMAIL_PASS` in `.env`

**For Development:** You can use a test Gmail account with 2FA enabled and app password.

### 4. Database Updates

The User model has been updated to include:
- `resetPasswordToken` - Hashed token (not stored in plain text!)
- `resetPasswordExpire` - Expiration timestamp (15 minutes from creation)

**No migration needed** - These fields are optional and created on first use.

### 5. Verify Backend Implementation

The following files have been updated:
- ✅ `backend/src/models/User.js` - Added token fields
- ✅ `backend/src/controllers/authController.js` - Added `forgotPassword()` and `resetPassword()` handlers
- ✅ `backend/src/routes/authRoutes.js` - Added `/forgot-password` and `/reset-password/:token` routes
- ✅ `backend/src/services/emailService.js` - Added `sendPasswordResetEmail()` with HTML template
- ✅ `backend/src/middleware/rateLimiter.js` - Added `forgotPasswordLimiter` (3/hour per IP)

---

## Frontend Setup

### 1. New Pages Created

- **`frontend/src/pages/ForgotPassword.jsx`**
  - Email input form
  - Confirmation screen after submission
  - Auto-redirect to login after 3 seconds

- **`frontend/src/pages/ResetPassword.jsx`**
  - Password & confirm password inputs
  - Real-time password strength indicator
  - Requirements checklist (length, uppercase, numbers, special chars)
  - Password visibility toggles
  - Match validation

### 2. Updated Files

- ✅ `frontend/src/pages/Login.jsx` - Added "Forgot password?" link
- ✅ `frontend/src/App.jsx` - Added `/forgot-password` and `/reset-password/:token` routes
- ✅ `frontend/src/api/api.js` - Added `forgotPassword()` and `resetPassword()` API calls

---

## API Endpoints

### POST `/api/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email is required"
}
```

**Security Notes:**
- Returns same response whether email exists or not (prevents user enumeration)
- Rate limited to 3 requests per hour per IP
- Token expires in 15 minutes

---

### POST `/api/auth/reset-password/:token`

**Request:**
```json
{
  "password": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Security Notes:**
- Token must match AND not be expired
- Password hashed with bcrypt before storage
- Token cleared immediately after successful reset
- Token fields remain hashed in DB for audit trail

---

## Security Features

### 1. Token Security
```javascript
// Generation: Random 32 bytes
const resetToken = crypto.randomBytes(32).toString("hex");

// Storage: SHA256 hash (plaintext never stored)
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
```

**Why?** If DB is compromised, reset tokens are useless (like password hashing).

### 2. Time-Based Expiry
- Token expires in **15 minutes**
- Checked on reset endpoint
- Expires automatically in DB (no cleanup needed)

### 3. Rate Limiting
- **Forgot password**: 3 requests per hour per IP
- **Login/Register**: 20 requests per 15 minutes per IP
- Prevents brute force and email enumeration

### 4. User Enumeration Prevention
```javascript
if (!user) {
  return res.status(200).json({
    success: true,
    message: "If an account exists with that email, a password reset link has been sent."
  });
}
```
- Same response whether email exists or not
- Attacker cannot harvest user emails
- Still logs the activity for audit

### 5. Password Strength Requirements
Validated on both frontend and backend:
- ✅ Minimum 6 characters
- ✅ Mix of uppercase and lowercase letters
- ✅ At least one number
- ✅ At least one special character (recommended)

Frontend shows real-time feedback with strength meter.

---

## Email Template

The reset email includes:

```
From: Smart Student Tasks <noreply@smarttasks.local>
Subject: Reset Your Password - Smart Student Tasks

[Beautiful HTML email with:]
- Smart Student Tasks branding (teal gradient)
- Password reset button (clickable link)
- Expiry warning (15 minutes)
- Security notice about unsolicited requests
- Fallback text link for email clients that don't support HTML
- Footer with copyright
```

**Example Reset Link:**
```
https://yourdomain.com/reset-password/a1b2c3d4e5f6g7h8...
```

---

## Testing the Implementation

### 1. Test Forgot Password Flow

```bash
# 1. Start backend (if not running)
cd backend && npm run dev

# 2. Start frontend (if not running)
cd frontend && npm run dev

# 3. Navigate to http://localhost:5173/login
# 4. Click "Forgot password?"
# 5. Enter registered email
# 6. Check email for reset link

# Note: If SMTP not configured, check backend logs:
# "Password reset email skipped for user@example.com"
```

### 2. Test Reset Password

```bash
# 1. Click link in email
# 2. You should see /reset-password/:token page
# 3. Enter new password and confirm
# 4. Check password strength meter updates
# 5. Click "Reset password"
# 6. Should redirect to login
# 7. Log in with new password
```

### 3. Test Error Cases

```bash
# Expired token (wait 15+ minutes)
# Invalid token (modify token in URL)
# Mismatched passwords
# Password too short
# Rate limit (3 requests in 1 hour)
```

### 4. Test User Enumeration Protection

```bash
# Request reset for non-existent email
# Should get same response as existing email
# Check backend logs for "forgot_password_requested"
```

---

## Production Checklist

- [ ] **Environment Variables Set**
  - [ ] `EMAIL_USER` configured
  - [ ] `EMAIL_PASS` (app password for Gmail)
  - [ ] `CLIENT_URL` points to production domain
  - [ ] `SMTP_HOST`, `SMTP_PORT` configured

- [ ] **Security**
  - [ ] JWT_SECRET is strong (32+ characters)
  - [ ] Rate limiters are active
  - [ ] Emails sent via secure TLS connection
  - [ ] HTTPS enforced (redirect HTTP to HTTPS)

- [ ] **Testing**
  - [ ] Send reset email works end-to-end
  - [ ] Link expires after 15 minutes
  - [ ] Old tokens invalid after password reset
  - [ ] Rate limiting prevents abuse
  - [ ] User enumeration protected

- [ ] **Monitoring**
  - [ ] Monitor email delivery failures
  - [ ] Track password reset activity logs
  - [ ] Alert on suspicious patterns (e.g., 3 resets in 1 hour)

- [ ] **Optional Enhancements**
  - [ ] Add reCAPTCHA to forgot password form
  - [ ] Send confirmation email after password reset
  - [ ] Add password reset history to account settings
  - [ ] Implement 2FA support

---

## Troubleshooting

### Email Not Sending

**Problem:** "Password reset email skipped" in logs

**Solutions:**
1. Check `.env` has all SMTP variables
2. Verify Gmail app password (not regular password)
3. Enable "Less secure apps" for test Gmail account
4. Check backend logs for exact error

### Token Always Invalid

**Problem:** "Invalid or expired reset token" immediately

**Solutions:**
1. Verify `CLIENT_URL` in backend matches frontend URL
2. Check token generation time vs. expiry
3. Ensure you're using exact link from email
4. Verify MongoDB is storing tokens correctly

### Rate Limit Exceeded

**Problem:** "Too many password reset requests"

**Solutions:**
1. Wait 1 hour for rate limit window to pass
2. Or reset all rate limiting middleware in development
3. Contact admin to manually reset limit (if needed)

### Frontend Pages Not Loading

**Problem:** 404 when visiting `/forgot-password`

**Solutions:**
1. Verify App.jsx has routes added (see Step 7)
2. Restart frontend dev server
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors

---

## API Integration Examples

### Frontend: Request Password Reset

```javascript
import { forgotPassword } from "../api/api";

const handleForgotPassword = async (email) => {
  try {
    const response = await forgotPassword({ email });
    console.log(response.message);
    // Show confirmation screen
  } catch (error) {
    console.error(error.message);
  }
};
```

### Frontend: Reset Password

```javascript
import { resetPassword } from "../api/api";

const handleReset = async (token, password, confirmPassword) => {
  try {
    const response = await resetPassword({
      token,
      password,
      confirmPassword
    });
    console.log(response.message);
    // Redirect to login
  } catch (error) {
    console.error(error.message);
  }
};
```

---

## File Structure Summary

```
backend/src/
├── models/User.js                 ✅ Added: resetPasswordToken, resetPasswordExpire
├── controllers/authController.js  ✅ Added: forgotPassword(), resetPassword()
├── routes/authRoutes.js           ✅ Added: /forgot-password, /reset-password/:token
├── services/emailService.js       ✅ Added: sendPasswordResetEmail()
└── middleware/rateLimiter.js      ✅ Added: forgotPasswordLimiter

frontend/src/
├── pages/
│   ├── ForgotPassword.jsx         ✅ NEW: Email form + confirmation
│   └── ResetPassword.jsx          ✅ NEW: Password form + strength meter
├── pages/Login.jsx                ✅ Updated: Added "Forgot password?" link
├── api/api.js                     ✅ Updated: Added API functions
└── App.jsx                        ✅ Updated: Added new routes

backend/.env                       ✅ Updated: Email configuration
```

---

## Next Steps

1. **Configure Gmail**
   - Set up app password for production
   - Test email delivery

2. **Deploy Backend**
   - Push code changes to repo
   - Update production `.env` with email credentials
   - Monitor logs for email failures

3. **Deploy Frontend**
   - Push code changes to repo
   - Update `CLIENT_URL` if domain changed
   - Test forgot password flow end-to-end

4. **Enhance (Optional)**
   - Add reCAPTCHA to prevent automation
   - Send "password changed" confirmation email
   - Add email verification on signup
   - Implement social login account linking

---

## Security Best Practices

✅ **Implemented:**
- Tokens hashed before storage
- Rate limiting on sensitive endpoints
- User enumeration protection
- Password strength validation
- Automatic token expiry
- Bcrypt password hashing
- Secure HTML email templates

✅ **Recommended for Production:**
- Add reCAPTCHA to forget password form
- Monitor failed reset attempts
- Require email verification on signup
- Add 2FA option to account settings
- Log all password changes
- Send reset confirmation email

---

## Support

For issues or questions:
1. Check logs: `backend-dev.log` and `backend-dev.err.log`
2. Verify all environment variables are set
3. Test with a test Gmail account first
4. Check email spam folder for test emails
