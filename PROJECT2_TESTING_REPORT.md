# VolunTeam Project 2
## Testing, End-to-End Testing, and Debugging Report

**Project:** VolunTeam  
**Course:** Mobile Application Development II  
**Institution:** Bow Valley College  
**GitHub Branch:** fix/login-email-validation  
**Pull Request:** #21  
**Pull Request URL:** https://github.com/TechSkillsBVC/assignment-task4/pull/21

---

# 1. Unit Testing

## 1.1 Areas Tested

The following application components and functions were selected for unit testing:

- Email validation utility.
- Login component.
- Login form validation.
- Authentication success and failure handling.
- Network error handling.

## 1.2 Test Environment

- React Native
- Expo SDK 47
- Jest
- Jest Expo
- React Native Testing Library

## 1.3 Test Cases

| Test Case | Expected Result |
|---|---|
| Validate a standard email address | Email is accepted |
| Validate Luigi Carluccio's email | Email is accepted |
| Validate John Silva's email | Email is accepted |
| Render Login screen | Login fields are displayed |
| Submit valid login credentials | Login succeeds |
| Submit incorrect credentials | Authentication error is displayed |
| Simulate network error | Network error is handled |

## 1.4 Bug Found During Unit Testing

Two users, Luigi Carluccio and John Silva, could not log in because their email addresses were rejected.

Emails:
- luigi@carluccio.it
- john@silva.com.br

The original email validation regular expression required a three-character domain extension.

The regular expression was updated to support domain extensions containing two or more characters.

## 1.5 Test Results

Command:

`yarn test --runInBand`

Results:

- Test Suites: 2 passed
- Tests: 21 passed
- Failed Tests: 0
- Snapshots: 0

All 21 unit tests passed successfully.

---

# 2. End-to-End Testing

## 2.1 Testing Objectives

The purpose of end-to-end testing was to verify the main application workflows, including authentication, event creation, form validation, map display, and network connectivity.

## 2.2 Testing Environment

- Android Emulator
- React Native / Expo
- JSON Server
- JSON Server Auth
- API running on port 3333

## 2.3 Login Testing

| Test Case | Expected Result | Actual Result |
|---|---|---|
| Login with valid credentials | User logs in successfully | PASS |
| Login with incorrect credentials | Authentication error appears | PASS |
| Login without internet connection | Network error appears | PASS |
| Login after restoring internet | Login works normally | PASS |

## 2.4 Event Creation Testing

| Test Case | Expected Result | Actual Result |
|---|---|---|
| Submit empty form | Validation error appears | PASS |
| Submit without event name | Validation error appears | PASS |
| Submit without description | Validation error appears | PASS |
| Volunteers Needed = 0 | Validation error appears | PASS |
| Volunteers Needed = -1 | Validation error appears | PASS |
| Volunteers Needed = abc | Validation error appears | PASS |
| Volunteers Needed = 1 | Event is created successfully | PASS |
| Submit valid event information | Success message appears | PASS |

## 2.5 Map Testing

| Test Case | Expected Result | Actual Result |
|---|---|---|
| Load events from API | Events are displayed | PASS |
| Display event markers | Markers appear on map | PASS |
| Select an event marker | Event title and description appear | PASS |
| Create a new event | New event appears on map | PASS |
| Disconnect internet | Network-dependent data is unavailable | PASS |
| Restore internet connection | Events load again | PASS |

## 2.6 End-to-End Findings

The tests confirmed that the main application workflows were functioning correctly.

The event creation form rejected invalid input and accepted valid event information.

Newly created events were successfully displayed on the map.

The application also handled network disconnection and reconnection.

---

# 3. Debugging and Root Cause Analysis

## 3.1 Issue 1: International Email Validation

**Problem:**

Two users received an Invalid email message when entering valid email addresses.

**Reproduction:**

1. Open the Login screen.
2. Enter `luigi@carluccio.it`.
3. Observe the email validation result.
4. Repeat with `john@silva.com.br`.

**Root Cause:**

The original regular expression only accepted three-character domain extensions.

**Fix:**

Updated the regular expression to accept domain extensions containing two or more characters.

**Verification:**

Added unit tests for both affected email addresses. Both tests passed.

## 3.2 Issue 2: Login Error Handling

**Problem:**

Network and authentication errors needed clearer handling.

**Root Cause:**

The previous error handling did not distinguish between server responses, network failures, and other errors.

**Fix:**

Improved the error handling logic to display appropriate messages for different error types.

**Verification:**

Tested incorrect credentials and network disconnection. Both scenarios were handled correctly.

## 3.3 Issue 3: Logout Navigation and Form State

**Problem:**

Login form information could remain when navigating back to the Login screen.

**Root Cause:**

The previous navigation behavior retained the existing navigation stack and screen state.

**Fix:**

Updated logout navigation to reset the navigation