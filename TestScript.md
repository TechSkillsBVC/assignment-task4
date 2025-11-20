# Task 4 - Email Validation Bug Test Script

## Bug Description
Users Luigi and John cannot log into the application. The app returns "invalid email" error.

## Affected Users
- **Luigi Carluccio:** luigi@carluccio.it
- **John Silva:** john@silva.com.br

## Test Environment
- Device: Android Emulator
- Date: November 20, 2025

---

## Reproduction Steps

### Test 1: Luigi's Login (BEFORE FIX)
1. Open Voluntam app
2. Enter email: `luigi@carluccio.it`
3. Enter password: `password`
4. Click "Log in"
5. **Result:** ❌ "Invalid email" error displayed

### Test 2: John's Login (BEFORE FIX)
1. Open Voluntam app
2. Enter email: `john@silva.com.br`
3. Enter password: `password`
4. Click "Log in"
5. **Result:** ❌ "Invalid email" error displayed

### Test 3: Control Test (Ulla)
1. Open Voluntam app
2. Enter email: `ulla.ulriksen@example.com`
3. Enter password: `password`
4. Click "Log in"
5. **Result:** ✅ Successful login

---

## Root Cause
Email validation regex required exactly 3-character TLDs:
- Luigi's `.it` is 2 characters → REJECTED
- John's `.com.br` is multi-part → REJECTED

**Buggy Regex:** `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/`

---

## Solution
Updated regex to accept 2+ character TLDs and multi-part TLDs:

**Fixed Regex:** `/^[a-zA-Z0-9.!#$%&'*+\/=?^_\`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/`

---

## Verification Tests (AFTER FIX)

### Unit Tests (Jest)
```
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        0.798 s
```

**Key Tests:**
- ✅ Luigi's .it TLD: PASS
- ✅ John's .com.br TLD: PASS
- ✅ 2-character TLDs: PASS
- ✅ Multi-part TLDs: PASS
- ✅ Standard 3-char TLDs: PASS

### Manual Tests

#### Test 1: Luigi (AFTER FIX)
- Email: `luigi@carluccio.it`
- Password: `password`
- **Result:** ✅ SUCCESS - Logged in successfully

#### Test 2: John (AFTER FIX)
- Email: `john@silva.com.br`
- Password: `password`
- **Result:** ✅ SUCCESS - Logged in successfully

#### Test 3: Ulla (Regression Test)
- Email: `ulla.ulriksen@example.com`
- Password: `password`
- **Result:** ✅ SUCCESS 

---

## Conclusion
✅ Bug identified and reproduced
✅ Root cause found (TLD length restriction)
✅ Fix implemented and tested
✅ All unit tests passing (28/28)
✅ All manual tests passing (3/3)
✅ No regressions detected