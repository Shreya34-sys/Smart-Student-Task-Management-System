# Forgot Password System - Testing Checklist

## ✅ Pre-Testing Setup

- [ ] Backend running: `npm run dev` (from `backend/` directory)
- [ ] Frontend running: `npm run dev` (from `frontend/` directory)
- [ ] Gmail SMTP configured in `backend/.env`
- [ ] MongoDB connected and running
- [ ] Test user created (can use existing account)

---

## 🧪 Test Case 1: Happy Path - Complete Password Reset

**Objective:** Verify full forgot password flow works end-to-end

### Steps:
1. [ ] Navigate to http://localhost:5173/login
2. [ ] Click "Forgot password?" link
3. [ ] Enter valid registered email address
4. [ ] Click "Send reset link" button
5. [ ] See confirmation message: "Check your email"
6. [ ] Check email inbox for reset link
7. [ ] Click reset link (should redirect to reset page)
8. [ ] Enter new password (e.g., "NewPass123!")
9. [ ] Enter matching confirm password
10. [ ] Watch password strength indicator update in real-time
11. [ ] Verify all password requirements show as met (if password is strong)
12. [ ] Click "Reset password" button
13. [ ] See success message and auto-redirect to login
14. [ ] Log in with new password
15. [ ] Verify login successful

**Expected Results:**
- ✅ Email received within 1-2 seconds
- ✅ Reset link works immediately
- ✅ Password strength meter shows real-time feedback
- ✅ New password sets successfully
- ✅ Can log in with new password
- ✅ Old password no longer works

### Backend Logs to Check:
```
✅ Password reset email sent to user@example.com
✅ User logged in successfully with new password
✅ Activity log shows: forgot_password_requested and password_reset
```

---

## 🧪 Test Case 2: Error - Invalid Email

**Objective:** Verify system handles non-existent emails securely

### Steps:
1. [ ] Navigate to Forgot Password page
2. [ ] Enter non-existent email (e.g., "nonexistent@example.com")
3. [ ] Click "Send reset link"

**Expected Results:**
- ✅ Same message as valid email: "Check your email"
- ✅ No email sent (check inbox)
- ✅ Backend logs show attempt but no email delivery

**Why?** User enumeration protection - prevent attackers from harvesting email list.

---

## 🧪 Test Case 3: Error - Empty Email

**Objective:** Verify validation on empty input

### Steps:
1. [ ] Navigate to Forgot Password page
2. [ ] Leave email field empty
3. [ ] Click "Send reset link"

**Expected Results:**
- ✅ Browser validation prevents submission (required field)
- ✅ Or API returns: "Email is required"

---

## 🧪 Test Case 4: Error - Expired Token

**Objective:** Verify tokens expire after 15 minutes

### Steps:
1. [ ] Request password reset for valid email
2. [ ] Note the time (e.g., 2:00 PM)
3. [ ] Wait 15+ minutes
4. [ ] Click reset link from email
5. [ ] Try to reset password

**Expected Results:**
- ✅ See error: "Invalid or expired reset token"
- ✅ Cannot reset with expired token

**Note:** For faster testing, modify token expiry in code to 1 minute temporarily.

---

## 🧪 Test Case 5: Error - Invalid Token

**Objective:** Verify tampered tokens are rejected

### Steps:
1. [ ] Request password reset
2. [ ] Get reset link from email
3. [ ] Manually modify token in URL (change any character)
4. [ ] Try to navigate to modified URL
5. [ ] Try to reset password

**Expected Results:**
- ✅ See error: "Invalid or expired reset token"
- ✅ Cannot reset with invalid token

---

## 🧪 Test Case 6: Error - Password Mismatch

**Objective:** Verify password confirmation validation

### Steps:
1. [ ] Get valid reset link
2. [ ] Navigate to reset page
3. [ ] Enter password: "NewPass123!"
4. [ ] Enter different confirm password: "Different456!"
5. [ ] Watch real-time validation message
6. [ ] Click "Reset password"

**Expected Results:**
- ✅ Real-time message shows: "Passwords do not match" (in red)
- ✅ Button click shows error: "Passwords do not match"
- ✅ Password not reset

---

## 🧪 Test Case 7: Error - Password Too Short

**Objective:** Verify minimum password length validation

### Steps:
1. [ ] Get valid reset link
2. [ ] Enter password: "Pass" (only 4 characters)
3. [ ] Enter confirm password: "Pass"
4. [ ] Click "Reset password"

**Expected Results:**
- ✅ Strength meter shows "Very Weak" (red)
- ✅ Error message: "Password must be at least 6 characters long"
- ✅ Password not reset

---

## 🧪 Test Case 8: Error - Weak Password

**Objective:** Verify password strength recommendations

### Steps:
1. [ ] Get valid reset link
2. [ ] Enter password: "password" (no uppercase, numbers, special chars)
3. [ ] Watch password strength indicator

**Expected Results:**
- ✅ Strength meter shows "Weak" or "Fair" (orange/yellow)
- ✅ Requirements checklist shows unmet requirements (red X marks)
- [ ] Note: Frontend doesn't block weak passwords, but shows warning
- [ ] Backend doesn't enforce strength, only minimum length

---

## 🧪 Test Case 9: Strong Password

**Objective:** Verify strong password recognition

### Steps:
1. [ ] Get valid reset link
2. [ ] Enter password: "SecurePass123!@" (uppercase, lowercase, numbers, special)
3. [ ] Watch password strength indicator

**Expected Results:**
- ✅ Strength meter shows "Strong" (green)
- ✅ All requirements checked (green checkmarks)
- ✅ Password reset successfully

---

## 🧪 Test Case 10: Password Visibility Toggle

**Objective:** Verify password visibility toggle works

### Steps:
1. [ ] Navigate to reset password page
2. [ ] Enter password
3. [ ] Click eye icon next to password field
4. [ ] Verify password is visible (not dots)
5. [ ] Click eye icon again
6. [ ] Verify password is hidden (shown as dots)
7. [ ] Repeat for confirm password field

**Expected Results:**
- ✅ Password visibility toggles work correctly
- ✅ Both password fields toggle independently

---

## 🧪 Test Case 11: Rate Limiting - Forgot Password

**Objective:** Verify rate limiting prevents abuse

### Steps:
1. [ ] Request password reset for email #1
2. [ ] Request password reset for email #2
3. [ ] Request password reset for email #3
4. [ ] Request password reset for email #4

**Expected Results:**
- ✅ First 3 requests succeed
- ✅ 4th request shows error: "Too many password reset requests. Please try again in 1 hour."

**Note:** Rate limit is per IP, per hour. Test from same IP.

---

## 🧪 Test Case 12: UI/UX - Loading States

**Objective:** Verify UI shows loading states during requests

### Steps:
1. [ ] Navigate to Forgot Password page
2. [ ] Enter email and click "Send reset link"
3. [ ] Immediately observe button state

**Expected Results:**
- ✅ Button shows loading spinner
- ✅ Button disabled during request
- ✅ Spinner disappears after response

---

## 🧪 Test Case 13: Toast Notifications

**Objective:** Verify user feedback messages

### Steps:
1. [ ] Complete password reset successfully
2. [ ] Observe notification in top-right corner

**Expected Results:**
- ✅ Green success toast: "Password reset successfully!"
- ✅ Auto-dismisses after 3-5 seconds

### Error Notifications:
3. [ ] Try expired token
4. [ ] Observe notification

**Expected Results:**
- ✅ Red error toast with error message
- ✅ Stays visible until user dismisses or navigates

---

## 🧪 Test Case 14: Email Template

**Objective:** Verify email looks good and contains correct info

### Steps:
1. [ ] Request password reset
2. [ ] Check email client (Gmail, Outlook, etc.)
3. [ ] Verify email contents:

**Expected Email Should Include:**
- [ ] "Reset Your Password" subject line
- [ ] Smart Student Tasks branding (teal/blue gradient)
- [ ] "Reset Password" button (clickable)
- [ ] 15-minute expiry warning
- [ ] Security notice
- [ ] Footer with copyright

**Expected Results:**
- ✅ Email renders beautifully in multiple clients
- ✅ Button links to correct reset URL
- ✅ All information clearly displayed

---

## 🧪 Test Case 15: Browser Back Button

**Objective:** Verify navigation after successful reset

### Steps:
1. [ ] Complete password reset
2. [ ] Auto-redirect to login happens
3. [ ] Click browser back button
4. [ ] Try to go back to reset page

**Expected Results:**
- ✅ Reset page not accessible after successful reset
- ✅ Token invalid if trying to reuse same link

---

## 🧪 Test Case 16: Multiple Users

**Objective:** Verify system works for multiple users independently

### Steps:
1. [ ] Create/register 2 test users (user1@test.com, user2@test.com)
2. [ ] Request password reset for user1
3. [ ] Request password reset for user2
4. [ ] Verify each gets unique reset link
5. [ ] Reset password for user1 with link #1
6. [ ] Try using link #2 for user1 (should fail)
7. [ ] Reset password for user2 with link #2
8. [ ] Verify both users can log in

**Expected Results:**
- ✅ Each user gets unique token
- ✅ Tokens are not interchangeable
- ✅ Both users can reset independently

---

## 🧪 Test Case 17: Old Password Invalidated

**Objective:** Verify old password no longer works after reset

### Steps:
1. [ ] Note old password for test user
2. [ ] Request and complete password reset with new password
3. [ ] Try to log in with old password
4. [ ] Try to log in with new password

**Expected Results:**
- ✅ Old password login fails: "Invalid email or password"
- ✅ New password login succeeds

---

## 🧪 Test Case 18: Database - Token Storage

**Objective:** Verify tokens are stored securely in database

### Steps:
1. [ ] Request password reset
2. [ ] Check MongoDB: `db.users.findOne({email: "test@example.com"})`
3. [ ] Verify `resetPasswordToken` is hashed (NOT plaintext)
4. [ ] Verify `resetPasswordExpire` is set to 15 minutes from now

**Expected Results:**
- ✅ `resetPasswordToken`: SHA256 hash (64 hex chars), NOT the original token
- ✅ `resetPasswordExpire`: ISO timestamp ~15 minutes in future

**Example:**
```javascript
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "resetPasswordToken": "a1b2c3d4e5f6... (64 chars, hashed)",
  "resetPasswordExpire": ISODate("2024-05-29T14:35:00Z")
}
```

---

## 🧪 Test Case 19: Database - Token Cleared After Reset

**Objective:** Verify tokens cleared from DB after successful reset

### Steps:
1. [ ] Request password reset
2. [ ] Check MongoDB - see `resetPasswordToken` and `resetPasswordExpire`
3. [ ] Complete reset
4. [ ] Check MongoDB again

**Expected Results:**
- ✅ After reset, `resetPasswordToken` is undefined/null
- ✅ After reset, `resetPasswordExpire` is undefined/null
- ✅ Password hash changed (new bcrypt hash)

---

## 🧪 Test Case 20: Activity Logging

**Objective:** Verify password reset events are logged

### Steps:
1. [ ] Request password reset
2. [ ] Complete password reset
3. [ ] Check MongoDB: `db.activities.find({action: {$in: ["forgot_password_requested", "password_reset"]}})`

**Expected Results:**
- ✅ `forgot_password_requested` logged when reset requested
- ✅ `password_reset` logged when password reset successfully
- ✅ Timestamp correct
- ✅ Actor (userId) correct

---

## 📊 Summary Report

After running all tests, fill in:

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Happy Path | ✅ Pass / ❌ Fail | |
| 2 | Invalid Email | ✅ Pass / ❌ Fail | |
| 3 | Empty Email | ✅ Pass / ❌ Fail | |
| 4 | Expired Token | ✅ Pass / ❌ Fail | |
| 5 | Invalid Token | ✅ Pass / ❌ Fail | |
| 6 | Mismatch Passwords | ✅ Pass / ❌ Fail | |
| 7 | Short Password | ✅ Pass / ❌ Fail | |
| 8 | Weak Password | ✅ Pass / ❌ Fail | |
| 9 | Strong Password | ✅ Pass / ❌ Fail | |
| 10 | Visibility Toggle | ✅ Pass / ❌ Fail | |
| 11 | Rate Limiting | ✅ Pass / ❌ Fail | |
| 12 | Loading States | ✅ Pass / ❌ Fail | |
| 13 | Notifications | ✅ Pass / ❌ Fail | |
| 14 | Email Template | ✅ Pass / ❌ Fail | |
| 15 | Back Button | ✅ Pass / ❌ Fail | |
| 16 | Multiple Users | ✅ Pass / ❌ Fail | |
| 17 | Old Password Invalid | ✅ Pass / ❌ Fail | |
| 18 | Token Storage | ✅ Pass / ❌ Fail | |
| 19 | Token Cleared | ✅ Pass / ❌ Fail | |
| 20 | Activity Logging | ✅ Pass / ❌ Fail | |

**Overall Status:** ✅ PASS / ❌ FAIL (at least 18/20)

---

## 🐛 Debugging Tips

### Check Backend Logs
```bash
tail -f backend-dev.log          # Watch real-time logs
tail -f backend-dev.err.log      # Check errors
grep "reset" backend-dev.log     # Search for reset events
```

### Check Email Service
```bash
# If emails not sending, check if SMTP configured
grep -i "smtp\|email\|skipped" backend-dev.log

# Look for: "Password reset email sent" or "Email skipped"
```

### MongoDB Inspection
```javascript
// Check user tokens
db.users.findOne({email: "test@example.com"}, 
  {resetPasswordToken: 1, resetPasswordExpire: 1})

// Check activity logs
db.activities.find({action: /password|reset/}).sort({_id: -1}).limit(10)

// Clear all reset tokens (for testing)
db.users.updateMany({}, {$unset: {resetPasswordToken: 1, resetPasswordExpire: 1}})
```

### Browser Console Errors
- Press F12 → Console tab
- Look for red error messages
- Check Network tab for API responses

---

## ✅ Sign-Off

- **Tester Name:** _______________
- **Test Date:** _______________
- **Backend Version:** _______________
- **Frontend Version:** _______________
- **Overall Status:** ✅ PASS / ❌ NEEDS FIXES
- **Notes:** _______________

---

**Ready to deploy?** Verify all tests pass before pushing to production! 🚀
