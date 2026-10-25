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
| EMAIL-01 | `ulla.ulriksen@example.com` | valid | — | — |
| EMAIL-02 | `luigi@carluccio.it`, `john@silva.com.br`, `volunteer@calgary.ca`, `x@domain.info`, `first+tag@gmail.com` | valid | — | — |
| EMAIL-03 | `''`, `plainaddress`, `user@`, `@example.com`, `user@example`, `user name@example.com` | invalid | — | — |
| TIME-01 | `formatAMPM` at 00:05, 09:30, 12:00 | `12:05 am`, `9:30 am`, `12:00 pm` | — | — |
| TIME-02 | `formatAMPM` at 13:07, 23:59 | `1:07 pm`, `11:59 pm` | — | — |
| TOKEN-01 | Token expiring in 1 hour / expired 1 hour ago | `false` / `true` | — | — |
| TOKEN-02 | Token with no `exp`, malformed token | `true`, without throwing | — | — |
| LOGIN-01 | Submit an invalid email | error shown, API not called | — | — |
| LOGIN-02 | Submit `luigi@carluccio.it` with a valid password | API called | — | — |
| LOGIN-03 | Server rejects the credentials | alert shows the server message | — | — |
| LOGIN-04 | Cached session, storage returns the user first | navigates to EventsMap | — | — |
| LOGIN-05 | Cached session, storage returns the token first | navigates to EventsMap | — | — |
| MAP-01 | Events map renders 4 events | footer reads `4 event(s) found` | — | — |
