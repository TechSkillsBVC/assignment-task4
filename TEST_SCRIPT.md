# Test Script - Login email validation

## Business requirement

A volunteer must be able to log in with any genuinely valid email address,
regardless of country-specific domain endings (e.g. `.it`, `.ca`, `.com.br`)
or a plus-addressed local part (e.g. `name+tag@example.com`). The app should
only reject input that is actually not a valid email address.

## Environment

- `npx json-server --watch db.json --port 3333 --host <your_ip> -m ./node_modules/json-server-auth`
- `npx expo start`, opened in Expo Go (or the Expo Go web/dev client)
- Login screen, before entering any credentials

## Manual reproduction steps

1. Open the app. The Login screen is shown.
2. Tap the Email field and type `luigi@carluccio.it` (a real, valid email
   with a two-letter country-code TLD).
3. Tap outside the field (or tab to Password) to trigger validation.
4. **Expected:** no error is shown, since this is a valid email address.
5. **Actual (before the fix):** the field is outlined in red and "invalid
   email" is shown above it, incorrectly rejecting a valid address.
6. Repeat steps 2-3 with `john@silva.com.br` (multi-level domain) and
   `user+tag@example.com` (plus-addressing). Both are incorrectly rejected
   before the fix, for the same reason.
7. Repeat steps 2-3 with a deliberately malformed address, e.g. `not-an-email`.
   **Expected and actual, both before and after the fix:** "invalid email" is
   shown, since this one is genuinely invalid.

## Automated equivalent of this script

`src/pages/Login.test.tsx` renders the real Login screen (not a mock),
types `luigi@carluccio.it` into the real email field, blurs it the same way
a user's tap away from the field does, and asserts the error text's
presence/absence exactly as this manual script does. It was confirmed to
fail against the original code and pass against the fix (see `BUG_REPORT.md`
for both runs' output). `src/utils/index.test.ts` covers the same scenarios,
and more, at the function level.

## Results after the fix

- Steps 2-6: no error is shown for any of the three valid addresses.
- Step 7: "invalid email" is still shown for the malformed address.
- `yarn test` (`src/utils/index.test.ts` and `src/pages/Login.test.tsx`):
  17/17 tests pass.
