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
| EMAIL-01 | `ulla.ulriksen@example.com` | valid | Pass | — |
| EMAIL-02 | `luigi@carluccio.it`, `john@silva.com.br`, `volunteer@calgary.ca`, `x@domain.info`, `first+tag@gmail.com` | valid | Fail | — |
| EMAIL-03 | `''`, `plainaddress`, `user@`, `@example.com`, `user@example`, `user name@example.com` | invalid | Pass | — |
| TIME-01 | `formatAMPM` at 00:05, 09:30, 12:00 | `12:05 am`, `9:30 am`, `12:00 pm` | Pass | — |
| TIME-02 | `formatAMPM` at 13:07, 23:59 | `1:07 pm`, `11:59 pm` | Fail | — |
| TOKEN-01 | Token expiring in 1 hour / expired 1 hour ago | `false` / `true` | Pass | — |
| TOKEN-02 | Token with no `exp`, malformed token | `true`, without throwing | Fail | — |
| LOGIN-01 | Submit an invalid email | error shown, API not called | Pass | — |
| LOGIN-02 | Submit `luigi@carluccio.it` with a valid password | API called | Fail | — |
| LOGIN-03 | Server rejects the credentials | alert shows the server message | Pass | — |
| LOGIN-04 | Cached session, storage returns the user first | navigates to EventsMap | Pass | — |
| LOGIN-05 | Cached session, storage returns the token first | navigates to EventsMap | Fail | — |
| MAP-01 | Events map renders 4 events | footer reads `4 event(s) found` | Fail | — |

## Test script

### BUG-1: Valid email addresses are rejected

1. Open the Login screen.
2. Enter the email `luigi@carluccio.it` and the password `password123`.
3. Press **Log in**.

**Expected:** a login request is sent for `luigi@carluccio.it`.
**Actual:** "invalid email" is shown and no login request is sent. The same happens for `john@silva.com.br`, `volunteer@calgary.ca`, `x@domain.info` and `first+tag@gmail.com`.

### BUG-2: Afternoon times are shown in 24-hour format

1. Format the time 13:07 with `formatAMPM`.
2. Format the time 23:59 with `formatAMPM`.

**Expected:** `1:07 pm` and `11:59 pm`.
**Actual:** `13:07 pm` and `23:59 pm`.

### BUG-3: Invalid access tokens are not treated as expired

1. Check a token that has no `exp` claim with `isTokenExpired`.
2. Check the malformed token `not-a-jwt` with `isTokenExpired`.

**Expected:** both return `true`.
**Actual:** the token without `exp` returns `false` (treated as never expiring). The malformed token throws `InvalidTokenError`.

### BUG-4: Returning user is not logged in automatically

1. Store a valid user and an unexpired access token in the cache.
2. Open the Login screen, with the cache returning the access token before the user.

**Expected:** the app navigates to the events map.
**Actual:** the app stays on the Login screen. When the cache returns the user first, navigation works.

### BUG-5: Event count is not shown on the map

1. Open the events map screen with the 4 sample events.

**Expected:** the footer reads `4 event(s) found`.
**Actual:** the footer reads `X event(s) found`.
