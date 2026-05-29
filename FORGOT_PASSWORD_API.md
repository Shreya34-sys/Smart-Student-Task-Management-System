# Forgot Password System - API Documentation

## Overview

Complete REST API documentation for the password reset system endpoints and database schema.

---

## API Endpoints

### 1. Forgot Password Request

**Endpoint:** `POST /api/auth/forgot-password`

**Purpose:** Generate and send password reset link via email

**Rate Limit:** 3 requests per hour per IP

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Validation:**
- `email` (required): Valid email format

**Success Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**Error Responses:**

*Missing Email (400):*
```json
{
  "success": false,
  "message": "Email is required"
}
```

*Rate Limit (429):*
```json
{
  "success": false,
  "message": "Too many password reset requests. Please try again in 1 hour."
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Error sending password reset email. Please try again later."
}
```

**Backend Flow:**
```
1. Validate email provided
2. Find user by email in MongoDB
3. Generate 32-byte random token
4. Hash token with SHA256
5. Save hashed token + 15min expiry to DB
6. Send email with reset link (includes plaintext token)
7. Log activity: "forgot_password_requested"
8. Return generic response (user enumeration protection)
```

**Email Contains:**
```
Reset URL: {CLIENT_URL}/reset-password/{resetToken}
Example: http://localhost:5173/reset-password/a1b2c3d4e5f6g7h8...
```

**Security Notes:**
- ✅ Generic response prevents email harvesting
- ✅ Rate limited to prevent abuse
- ✅ Token hashed before storage
- ✅ 15-minute expiration prevents long-term attacks
- ✅ Activity logged for audit trail

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

### 2. Reset Password

**Endpoint:** `POST /api/auth/reset-password/:token`

**Purpose:** Verify token and update user password

**Rate Limit:** No rate limit (token already rate-limited)

**URL Parameters:**
- `token` (required): Reset token from email link (32-byte hex string)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Validation:**
- `password` (required): Minimum 6 characters
- `confirmPassword` (required): Must match `password`
- Both cannot be empty

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}
```

**Error Responses:**

*Missing Fields (400):*
```json
{
  "success": false,
  "message": "Password and confirm password are required"
}
```

*Passwords Don't Match (400):*
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

*Password Too Short (400):*
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

*Invalid/Expired Token (400):*
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Backend Flow:**
```
1. Extract token from URL parameter
2. Hash token with SHA256
3. Query database for user with:
   - Matching hashed token
   - resetPasswordExpire > current time (not expired)
4. Validate password requirements
5. Hash new password with bcrypt
6. Update user.password with hashed password
7. Clear resetPasswordToken field
8. Clear resetPasswordExpire field
9. Save user to database
10. Log activity: "password_reset"
11. Return success response
```

**Security Notes:**
- ✅ Token must exist AND not be expired
- ✅ Token hashed in database (never stored plaintext)
- ✅ New password hashed with bcrypt (12 rounds)
- ✅ Old password completely replaced (not kept in history)
- ✅ Token cleared immediately (single-use)
- ✅ Old session tokens remain valid (user can stay logged in if currently authenticated)

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/a1b2c3d4e5f6g7h8 \
  -H "Content-Type: application/json" \
  -d '{
    "password":"NewPass123!",
    "confirmPassword":"NewPass123!"
  }'
```

---

## Database Schema

### User Collection Updates

**New Fields Added:**

```javascript
{
  // ... existing fields ...
  
  resetPasswordToken: {
    type: String,
    select: false,           // Not included in queries by default
    sparse: true,            // Indexed for fast lookups
    // Value: SHA256 hash of 32-byte token (NOT plaintext)
    // Example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0"
    // Only set when password reset requested
    // Cleared after successful reset
  },
  
  resetPasswordExpire: {
    type: Date,
    select: false,           // Not included in queries by default
    sparse: true,            // Indexed for fast lookups
    // Value: Expiration timestamp (15 minutes from token creation)
    // Example: ISODate("2024-05-29T14:35:23.456Z")
    // Only set when password reset requested
    // Cleared after successful reset
  }
}
```

**Indexes Created:**
```javascript
// Automatic due to sparse: true
db.users.createIndex({resetPasswordToken: 1}, {sparse: true})
db.users.createIndex({resetPasswordExpire: 1}, {sparse: true})
```

**Example User Document with Reset Token:**
```javascript
{
  "_id": ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$12$...", // bcrypt hash
  "avatar": "https://...",
  "provider": "local",
  "role": "student",
  "teams": [],
  "createdAt": ISODate("2024-05-28T14:00:00.000Z"),
  "updatedAt": ISODate("2024-05-29T14:20:00.000Z"),
  // After forgot password request:
  "resetPasswordToken": "f7e6d5c4b3a2918070605040302010f8e7d6c5b4a39281706050403020100f",
  "resetPasswordExpire": ISODate("2024-05-29T14:35:00.000Z")
}
```

**After Password Reset:**
```javascript
{
  // ... other fields ...
  "password": "$2a$12$...", // NEW bcrypt hash (different from before)
  "updatedAt": ISODate("2024-05-29T14:32:00.000Z"),
  // Cleared:
  // resetPasswordToken: undefined
  // resetPasswordExpire: undefined
}
```

---

## Activity Logging

### Logged Events

#### 1. Forgot Password Requested

**Event:** `forgot_password_requested`

**Document:**
```javascript
{
  "_id": ObjectId("..."),
  "actor": ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),  // User requesting reset
  "action": "forgot_password_requested",
  "entityType": "user",
  "entityId": ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),
  "details": {},
  "createdAt": ISODate("2024-05-29T14:20:00.000Z")
}
```

#### 2. Password Reset

**Event:** `password_reset`

**Document:**
```javascript
{
  "_id": ObjectId("..."),
  "actor": ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),  // User resetting password
  "action": "password_reset",
  "entityType": "user",
  "entityId": ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),
  "details": {},
  "createdAt": ISODate("2024-05-29T14:32:00.000Z")
}
```

**Query Examples:**
```javascript
// Find all password reset requests
db.activities.find({action: "forgot_password_requested"})

// Find all password resets
db.activities.find({action: "password_reset"})

// Find events for specific user
db.activities.find({
  actor: ObjectId("5f1c2d3e4f5g6h7i8j9k0l1m"),
  action: {$in: ["forgot_password_requested", "password_reset"]}
})

// Count reset requests in last hour
db.activities.countDocuments({
  action: "forgot_password_requested",
  createdAt: {$gte: new Date(Date.now() - 3600000)}
})
```

---

## Token Generation & Validation

### Token Generation Process

```javascript
// 1. Generate random bytes
const resetToken = crypto.randomBytes(32).toString("hex");
// Result: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3"
// (64 character hex string)

// 2. Hash for storage
const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
// Result: (another 64 character hex string)

// 3. Send plaintext token in email
const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;

// 4. Store hashed token in DB
user.resetPasswordToken = hashedToken;

// 5. Verify on reset
const hashInput = crypto.createHash("sha256").update(token).digest("hex");
const user = await User.findOne({
  resetPasswordToken: hashInput,
  resetPasswordExpire: { $gt: new Date() }
});
```

**Why Two Different Strings?**
- Email contains: plaintext token (user clicks link with this)
- DB stores: hashed token (like password hashing)
- If DB compromised: hashed tokens are useless (attacker can't generate valid reset URLs)

---

## Password Validation

### Backend Validation

```javascript
// Backend enforces only:
if (password.length < 6) {
  throw new AppError("Password must be at least 6 characters long", 400);
}

// Password automatically hashed with bcrypt (12 rounds)
user.password = password;
// Result: "$2a$12$..." (60 character bcrypt hash)
```

### Frontend Validation (No Enforcement, UX Only)

```javascript
// Frontend shows requirements but allows submission:
const requirements = [
  { label: "At least 6 characters", met: password.length >= 6 },
  { label: "Mix of uppercase and lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  { label: "At least one number", met: /\d/.test(password) },
  { label: "At least one special character", met: /[^a-zA-Z\d]/.test(password) }
];
```

---

## Rate Limiting

### Forgot Password Rate Limiter

**Configuration:**
```javascript
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,              // 1 hour
  limit: 3,                              // 3 requests max
  message: {
    success: false,
    message: "Too many password reset requests. Please try again in 1 hour."
  }
});
```

**Behavior:**
- Tracks by IP address
- Resets after 1 hour window
- Returns 429 on 4th request
- Prevents abuse from automated attacks

**Example:**
```
Request 1 (14:00) - ✅ Accepted
Request 2 (14:05) - ✅ Accepted
Request 3 (14:10) - ✅ Accepted
Request 4 (14:15) - ❌ Rate limited (error response)
                    Wait until 15:00
Request 5 (15:01) - ✅ Accepted (window reset)
```

---

## Email Service

### Configuration

**Gmail SMTP:**
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,         // TLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS  // App password, not Gmail password
  }
});
```

### Reset Email Template

**Subject:** `Reset Your Password - Smart Student Tasks`

**To:** User's email address

**HTML Content Includes:**
```
- Smart Student Tasks branding (gradient header)
- "Reset Your Password" title
- Friendly message
- Prominent reset button
- 15-minute expiry warning
- Security notice ("If you didn't request...")
- Fallback text link
- Footer with copyright
```

**Fallback Plain Text:**
```
Click the link below to reset your password. This link expires in 15 minutes.
{resetUrl}
```

---

## Error Handling

### Common Error Cases

| Error | HTTP Status | Message | Cause |
|-------|-------------|---------|-------|
| Missing email | 400 | "Email is required" | No email in request |
| Rate limited | 429 | "Too many password reset requests..." | >3 in 1 hour |
| Email error | 500 | "Error sending password reset email..." | SMTP configuration |
| Missing password | 400 | "Password and confirm password required" | Empty fields |
| Passwords mismatch | 400 | "Passwords do not match" | Confirm ≠ Password |
| Password too short | 400 | "Password must be 6+ chars" | Length < 6 |
| Invalid token | 400 | "Invalid or expired reset token" | Token hashed wrong |
| Expired token | 400 | "Invalid or expired reset token" | Token > 15 min old |

### Error Response Format

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

## Monitoring & Debugging

### Useful Queries

**Failed Reset Attempts:**
```javascript
// Find expired token attempts
db.users.find({
  resetPasswordExpire: {$lt: new Date()},
  resetPasswordToken: {$exists: true}
})

// Find oldest reset tokens
db.users.find({
  resetPasswordToken: {$exists: true}
}).sort({resetPasswordExpire: 1}).limit(5)
```

**User Reset History:**
```javascript
// Last 10 password-related activities
db.activities.find({
  action: {$in: ["forgot_password_requested", "password_reset"]}
}).sort({createdAt: -1}).limit(10)
```

**Email Delivery Issues:**
```bash
# Check backend logs
grep "Email skipped\|sendMail error\|SMTP" backend-dev.log
```

---

## Testing Endpoints

### Unit Test Example (Node.js + Jest)

```javascript
describe("Password Reset API", () => {
  test("POST /forgot-password - valid email", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({email: "test@example.com"});
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /forgot-password - non-existent email", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({email: "nonexistent@example.com"});
    
    // Should return same response (user enumeration protection)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /reset-password/:token - valid reset", async () => {
    const response = await request(app)
      .post(`/api/auth/reset-password/${validToken}`)
      .send({
        password: "NewPass123!",
        confirmPassword: "NewPass123!"
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /reset-password/:token - expired token", async () => {
    const response = await request(app)
      .post(`/api/auth/reset-password/${expiredToken}`)
      .send({
        password: "NewPass123!",
        confirmPassword: "NewPass123!"
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Invalid or expired/);
  });
});
```

---

## Integration with Auth Flow

### Complete Login Flow with Password Reset

```
User visits app
    ↓
1. [Landing] User clicks login
    ↓
2. [Login] User enters credentials
    ↓
3a. [Success] → Dashboard
3b. [Error: Invalid credentials] → Stay on login
3c. [Error: Account locked/2FA] → Additional step
    ↓
4. [Forgot Password] User clicks "Forgot password?"
    ↓
5. [Forgot Password Page] User enters email
    ↓
6. [API: /forgot-password] Backend sends email
    ↓
7. [Email] User receives reset link
    ↓
8. [Reset Password Page] User clicks link from email
    ↓
9. [API: /reset-password/:token] Backend validates & updates password
    ↓
10. [Login] User logs in with new password
    ↓
11. [Dashboard] → Success
```

---

## Performance Considerations

### Database Indexes

```javascript
// Automatically created due to sparse: true
resetPasswordToken: 1  // For lookup during reset
resetPasswordExpire: 1  // For expiry checking
```

**Query Performance:**
- Forgot password: O(1) email lookup + O(1) token save = Fast
- Reset password: O(1) token lookup + O(1) password update = Fast

### Email Delivery

- Async operation (doesn't block request)
- Gracefully handles SMTP failures
- Falls back to logging if SMTP not configured
- Typical delivery: 1-5 seconds

### Rate Limiter

- In-memory tracking (fast)
- O(1) lookup by IP
- Redis optional for distributed deployments

---

## Security Checklist

✅ Tokens hashed before storage (SHA256)
✅ Tokens expire automatically (15 min)
✅ Rate limiting prevents brute force (3/hour)
✅ User enumeration protected (generic responses)
✅ Passwords hashed (bcrypt 12 rounds)
✅ HTTPS recommended for production
✅ SMTP uses TLS encryption
✅ Activity logged for audit
✅ Tokens cleared after use
✅ Email validation on backend

**Recommendations for Production:**
- Add reCAPTCHA to prevent automation
- Send confirmation email after password reset
- Implement 2FA for additional security
- Monitor failed reset attempts
- Log all sensitive operations

---

**Last Updated:** May 29, 2024
**Version:** 1.0
**Maintained By:** Development Team
