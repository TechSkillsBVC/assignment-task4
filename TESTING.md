# Test Plan

Run the unit tests with `yarn test`.

## Scope

| Area | Under test |
| --- | --- |
| `src/utils/index.ts` | `validateEmail`, `formatAMPM`, `isTokenExpired` |
| `src/pages/Login.tsx` | Form validation, login request, automatic login with a cached session |
| `src/pages/EventsMap.tsx` | Event count shown in the footer |

## Test objects

Native modules (AsyncStorage, maps, icons) are mocked globally in `jest.setup.js`. The login API and the `navigation` prop are mocked in each test. Tokens are unsigned JWTs built in the test with a chosen `exp`.

## Test cases

| ID | Scenario | Expected | Before fix | After fix |
| --- | --- | --- | --- | --- |
| EMAIL-01 | `ulla.ulriksen@example.com` | valid | Pass | Pass |
| EMAIL-02 | `luigi@carluccio.it`, `john@silva.com.br`, `volunteer@calgary.ca`, `x@domain.info`, `first+tag@gmail.com` | valid | Fail | Pass |
| EMAIL-03 | `''`, `plainaddress`, `user@`, `@example.com`, `user@example`, `user name@example.com` | invalid | Pass | Pass |
| TIME-01 | `formatAMPM` at 00:05, 09:30, 12:00 | `12:05 am`, `9:30 am`, `12:00 pm` | Pass | Pass |
| TIME-02 | `formatAMPM` at 13:07, 23:59 | `1:07 pm`, `11:59 pm` | Fail | Pass |
| TOKEN-01 | Token expiring in 1 hour / expired 1 hour ago | `false` / `true` | Pass | Pass |
| TOKEN-02 | Token with no `exp`, malformed token | `true`, without throwing | Fail | Pass |
| LOGIN-01 | Submit an invalid email | error shown, API not called | Pass | Pass |
| LOGIN-02 | Submit `luigi@carluccio.it` with a valid password | API called | Fail | Pass |
| LOGIN-03 | Server rejects the credentials | alert shows the server message | Pass | Pass |
| LOGIN-04 | Cached session, storage returns the user first | navigates to EventsMap | Pass | Pass |
| LOGIN-05 | Cached session, storage returns the token first | navigates to EventsMap | Fail | Pass |
| MAP-01 | Events map renders 4 events | footer reads `4 event(s) found` | Fail | Pass |

## Test script

### BUG-1: Valid email addresses are rejected

1. Open the Login screen.
2. Enter the email `luigi@carluccio.it` and the password `password123`.
3. Press **Log in**.

- **Expected:** a login request is sent for `luigi@carluccio.it`.
- **Actual:** "invalid email" is shown and no login request is sent. The same happens for `john@silva.com.br`, `volunteer@calgary.ca`, `x@domain.info` and `first+tag@gmail.com`.
- **Cause:** the `validateEmail` pattern ends in `(\.\w{3})+$`, so every domain part must be exactly 3 characters, and `\w` in the local part does not include `+`.
- **Fix:** the domain ending accepts 2 or more characters (`\w{2,}`) and the local part accepts `+`.
- **After fix:** a login request is sent for `luigi@carluccio.it` and all five addresses are accepted.

### BUG-2: Afternoon times are shown in 24-hour format

1. Format the time 13:07 with `formatAMPM`.
2. Format the time 23:59 with `formatAMPM`.

- **Expected:** `1:07 pm` and `11:59 pm`.
- **Actual:** `13:07 pm` and `23:59 pm`.
- **Cause:** `hours % 12 ? hours : 12` returns the original 24-hour value instead of the result of the modulo.
- **Fix:** `hours % 12 || 12`.
- **After fix:** `1:07 pm` and `11:59 pm`.

### BUG-3: Invalid access tokens are not treated as expired

1. Check a token that has no `exp` claim with `isTokenExpired`.
2. Check the malformed token `not-a-jwt` with `isTokenExpired`.

- **Expected:** both return `true`.
- **Actual:** the token without `exp` returns `false` (treated as never expiring). The malformed token throws `InvalidTokenError`.
- **Cause:** `jwtDecode` throws on malformed input and the error is not caught. When `exp` is missing, `undefined * 1000` is `NaN` and `NaN < Date.now()` is `false`.
- **Fix:** decoding is wrapped in `try/catch` and returns `true` on error; a token without `exp` returns `true`.
- **After fix:** both return `true` without throwing.

### BUG-4: Returning user is not logged in automatically

1. Store a valid user and an unexpired access token in the cache.
2. Open the Login screen, with the cache returning the access token before the user.

- **Expected:** the app navigates to the events map.
- **Actual:** the app stays on the Login screen. When the cache returns the user first, navigation works.
- **Cause:** the effect that navigates only depends on `accessTokenIsValid`. If the user loads after the token, the effect has already run without a user and does not run again.
- **Fix:** the user (`authenticationContext?.value`) is added to the effect's dependencies.
- **After fix:** the app navigates to the events map in both load orders.

### BUG-5: Event count is not shown on the map

1. Open the events map screen with the 4 sample events.

- **Expected:** the footer reads `4 event(s) found`.
- **Actual:** the footer reads `X event(s) found`.
- **Cause:** the footer text is hardcoded.
- **Fix:** the footer renders `events.length`.
- **After fix:** the footer reads `4 event(s) found`.
