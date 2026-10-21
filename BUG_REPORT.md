# Bug Report - Login email validation rejects valid emails

## Summary

The Login screen's email validation (`validateEmail` in `src/utils/index.ts`)
rejects several categories of genuinely valid email addresses, blocking
volunteers from logging in even when their email is correctly formatted.

## Steps to reproduce

See `TEST_SCRIPT.md`. In short: enter `luigi@carluccio.it` in the Login
screen's email field and tab away. The field is flagged invalid, even though
the address is valid.

## Root cause

The original regex was:

```js
const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{3})+$/;
```

This has three problems:

1. `(\.\w{3})+` requires every dot-separated segment after the `@` to be
   **exactly** 3 characters. Real top-level domains are not always 3
   characters (`.it`, `.ca`, `.uk` are 2; `.info`, `.email` are longer), so
   this silently rejects a large share of real email addresses.
2. `\w` only matches letters, digits, and underscore, so a `+` in the local
   part (common for tagged addresses like `name+tag@example.com`) is
   rejected.
3. `\w` also matches digits in the TLD position, which is not meaningful for
   a real TLD, though this is a minor concern next to the two above.

## Fix

Replaced the regex with one that only requires a non-whitespace,
non-`@` local part, a non-whitespace, non-`@` domain, and a final
`.`-plus-2-or-more-letters TLD:

```js
const regex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
```

This accepts any TLD length of 2 or more letters, multi-level domains, and
`+` in the local part, while still rejecting addresses with no `@`, an empty
local part or domain, or whitespace in either part.

## Tests added

- `src/utils/index.test.ts`: 15 cases directly on `validateEmail` - 7 valid
  addresses that must be accepted (including the three the bug rejected) and
  8 invalid ones that must still be rejected.
- `src/pages/Login.test.tsx`: renders the real Login screen and exercises
  the same scenario through the actual email field and its blur handler, the
  same way a user would trigger it.

## Verified before the fix (confirms the bug)

```
src/utils/index.test.ts
  × accepts "luigi@carluccio.it"
  × accepts "john@silva.com.br"
  × accepts "user@example.info"
  × accepts "user+tag@example.com"
  (11 other cases passed)
Tests: 4 failed, 11 passed, 15 total

src/pages/Login.test.tsx
  × does not show "invalid email" for a valid email with a two-letter TLD
  √ shows "invalid email" for a genuinely malformed email
Tests: 1 failed, 1 passed, 2 total
```

## Verified after the fix

```
src/utils/index.test.ts: 15 passed, 15 total
src/pages/Login.test.tsx: 2 passed, 2 total
yarn test: Test Suites: 2 passed, 2 total. Tests: 17 passed, 17 total.
```

## Files changed

- `src/utils/index.ts` - fixed `validateEmail`.
- `src/pages/Login.tsx` - added `testID="email-input"` to the email field so
  it can be selected in tests; no behavior change.
- `src/utils/index.test.ts`, `src/pages/Login.test.tsx` - new tests.
- `jest.setup.ts`, `package.json` - test setup (jest-expo, AsyncStorage mock,
  gesture-handler setup, transformIgnorePatterns extended for axios).
