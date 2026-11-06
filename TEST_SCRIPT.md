   # Manual Test Script: Login email validation

   **Setup:** json-server running on port 3333, app open in Expo Go, on the Login screen.

   ## Test 1: Valid email with a 2-letter ending
   1. Type `test@school.ca` in Email.
   2. Type `secret123` in Password.
   3. Tap "Log in".
   - **Expected:** No "invalid email" message; the app goes to the map screen.
   - **Actual (before fix):** Red border and "invalid email" shown; stays on Login.

   ## Test 2: Valid email with a 3-letter ending (control)
   1. Type `bob.last@gmail.com` and a valid password for that user.
   2. Tap "Log in".
   - **Expected / Actual:** Goes to the map screen.

   ## Test 3: Truly invalid email
   1. Type `bob@gmail` (no ending) and any password.
   2. Tap "Log in".
   - **Expected / Actual:** "invalid email" shown; stays on Login.