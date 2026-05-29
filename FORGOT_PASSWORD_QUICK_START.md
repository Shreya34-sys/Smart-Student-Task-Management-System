# Quick Start: Forgot Password System

## 1️⃣ Configure Email (Gmail)

Add to `backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM="Smart Student Tasks <your-email@gmail.com>"
```

## 2️⃣ Install Dependencies

Backend already has these, but verify:
```bash
npm list bcryptjs nodemailer crypto
```

## 3️⃣ Start Services

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 4️⃣ Test the Flow

1. Go to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter registered email
4. Check email for reset link
5. Click link and enter new password
6. Log in with new password

## 📋 Files Changed/Created

**Backend:**
- ✅ `src/models/User.js` - Added token fields
- ✅ `src/controllers/authController.js` - Added handlers
- ✅ `src/routes/authRoutes.js` - Added routes
- ✅ `src/services/emailService.js` - Added email template
- ✅ `src/middleware/rateLimiter.js` - Added rate limiter

**Frontend:**
- ✅ `src/pages/ForgotPassword.jsx` - NEW
- ✅ `src/pages/ResetPassword.jsx` - NEW
- ✅ `src/pages/Login.jsx` - Updated with link
- ✅ `src/App.jsx` - Updated routes
- ✅ `src/api/api.js` - Updated API functions

## 🔒 Security Features

✅ Token hashing (crypto)
✅ 15-minute expiry
✅ Rate limiting (3/hour)
✅ User enumeration protection
✅ Bcrypt password hashing
✅ Password strength validation
✅ Beautiful HTML email template

## 🧪 Test Cases

```javascript
// Test 1: Valid reset
Email: user@example.com → Enter new password → Log in

// Test 2: Expired token
Wait 15+ minutes → Click old link → See error

// Test 3: Invalid token
Modify token in URL → See error

// Test 4: Mismatch passwords
Enter different confirm password → See error

// Test 5: Rate limit
Request 4 times in 1 hour → See error on 4th
```

## 📧 Email Configuration

### Gmail Setup (2 minutes)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Generate App Password (for "Mail")
4. Copy password → Use as EMAIL_PASS

### Test Mode
- Check backend logs for "Email skipped"
- Email service gracefully skips if SMTP not configured

## 🚀 Production Deploy

1. Set all env variables
2. Use strong JWT_SECRET (32+ chars)
3. Update CLIENT_URL to production domain
4. Test full flow before going live
5. Monitor email delivery logs

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check .env SMTP vars, verify app password |
| Token always invalid | Verify CLIENT_URL matches frontend URL |
| Rate limit hit | Wait 1 hour or check IP in logs |
| 404 on forgot-password | Restart frontend, hard refresh browser |

---

**Full Setup Guide:** See `FORGOT_PASSWORD_SETUP.md`
