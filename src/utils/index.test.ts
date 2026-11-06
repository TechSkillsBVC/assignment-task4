// Define a mock function to control what jwtDecode returns in each test
const mockJwtDecode = jest.fn();

jest.mock('expo-constants', () => ({}));
jest.mock('jwt-decode', () => ({
    __esModule: true,
    default: (token: string) => mockJwtDecode(token),
}));
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('react-native-maps', () => ({}));

import { validateEmail, formatAMPM, isTokenExpired,formatBytes } from './index';

describe('validateEmail unit tests', () => {
    it('accepts standard common email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });

    // Test case covering Luigi's issue: 2-character country-code TLD (.it)
    it('accepts 2-letter country code top-level domains (Luigi: luigi@carluccio.it)', () => {
        expect(validateEmail('luigi@carluccio.it')).toBe(true);
    });

    // Test case covering John's issue: multi-part country code TLD (.com.br)
    it('accepts multi-part domain extensions (John: john@silva.com.br)', () => {
        expect(validateEmail('john@silva.com.br')).toBe(true);
    });

    it('rejects invalid or malformed emails', () => {
        expect(validateEmail('plainaddress')).toBe(false);
        expect(validateEmail('missing@domain')).toBe(false);
        expect(validateEmail('@missinguser.com')).toBe(false);
    });
});

describe('formatAMPM unit tests', () => {
    it('formats afternoon hours correctly in 12-hour format (e.g. 1:30 pm instead of 13:30 pm)', () => {
        const afternoon = new Date('2026-11-05T13:30:00');
        expect(formatAMPM(afternoon)).toBe('1:30 pm');
    });

    it('formats midnight correctly as 12:xx am', () => {
        const midnight = new Date('2026-11-05T00:15:00');
        expect(formatAMPM(midnight)).toBe('12:15 am');
    });

    it('formats noon correctly as 12:xx pm', () => {
        const noon = new Date('2026-11-05T12:00:00');
        expect(formatAMPM(noon)).toBe('12:00 pm');
    });
});

describe('isTokenExpired unit tests', () => {
    beforeEach(() => {
        mockJwtDecode.mockReset();
    });

    it('returns false for a valid token with a future expiration timestamp', () => {
        // Token expires 1 hour in the future (in seconds)
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        mockJwtDecode.mockReturnValue({ exp: futureExp });

        expect(isTokenExpired('valid.active.token')).toBe(false);
    });

    it('returns true for a token with a past expiration timestamp', () => {
        // Token expired 1 hour ago
        const pastExp = Math.floor(Date.now() / 1000) - 3600;
        mockJwtDecode.mockReturnValue({ exp: pastExp });

        expect(isTokenExpired('valid.expired.token')).toBe(true);
    });

    it('returns true when token has no expiration (exp is undefined/missing)', () => {
        mockJwtDecode.mockReturnValue({});

        expect(isTokenExpired('token.without.exp')).toBe(true);
    });

    it('returns true safely when token string is empty or invalid (try/catch guard)', () => {
        mockJwtDecode.mockImplementation(() => {
            throw new Error('Invalid token specified');
        });

        expect(isTokenExpired('')).toBe(true);
        expect(isTokenExpired('malformed.junk.token')).toBe(true);
    });
});
describe('formatBytes unit tests', () => {
    it('returns "0 Bytes" for zero, negative numbers, or invalid input', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
        expect(formatBytes(-1024)).toBe('0 Bytes');
        expect(formatBytes(NaN as unknown as number)).toBe('0 Bytes');
    });

    it('formats plain bytes correctly without scaling', () => {
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('formats kilobytes and megabytes correctly', () => {
        expect(formatBytes(1024)).toBe('1 KB');
        expect(formatBytes(1048576)).toBe('1 MB');
    });

    it('respects decimal precision parameters', () => {
        expect(formatBytes(1536, 1)).toBe('1.5 KB');
        expect(formatBytes(1536, 0)).toBe('2 KB');
    });

    it('handles negative decimal precision gracefully by defaulting to 0', () => {
        expect(formatBytes(1536, -2)).toBe('2 KB');
    });
});