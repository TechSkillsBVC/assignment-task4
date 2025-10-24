# Test Script – validateEmail Bug

## Goal
Reproduce and verify a bug in the email validator and confirm the fix with unit tests.

## Environment
- Node: 22.x
- Yarn: 1.22.x
- OS: Windows 10/11
- Project: Expo SDK 47 / React Native 0.70.5

## Steps to Reproduce (before fix)
1. Install dependencies:
   - `yarn`
2. Run tests:
   - `yarn test`
3. Expected:
   - The `validateEmail` tests fail because:
     - `user@example.co` (TLD of 2) is rejected.
     - `first.last+tag@sub.domain.co.uk` is rejected (no `+` allowed in local part).
     - `user@example.123` is accepted (regex allowed numeric TLD).
4. Actual (before fix):
   - Tests fail with the above cases.

## Root Cause
- In `src/utils/index.ts`, the regex:
  - forced TLDs to be exactly 3 characters: `(\.\w{3})+`
  - did not allow `+` in the local part
  - allowed digits in TLDs (via `\w`)

## Fix
- Replace the validator with:
  - `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`
  - Now local part allows `+`
  - Supports multi-level domains / subdomains
  - TLD must be letters only, length >= 2

## Steps to Verify (after fix)
1. Update the code as above.
2. Run `yarn test`.
3. Expected:
   - All tests pass (3/3).
4. Actual:
   - All tests passed.

## Notes
- This is a targeted validator for common email formats; it’s not meant to be a full RFC-5322 validator.
