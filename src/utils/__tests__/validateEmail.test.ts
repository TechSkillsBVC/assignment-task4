import { validateEmail, sanitizeEmail } from '../index';

// Provide light mocks so Jest never has to load the real native modules
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { manifest: {} },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'test' },
}));

jest.mock('react-native-maps', () => ({
  // we don't actually use LatLng in these tests, just stub it
  LatLng: {},
}));

describe('validateEmail', () => {
    describe('Valid email addresses', () => {
        it('should accept standard .com email', () => {
            expect(validateEmail('user@example.com')).toBe(true);
        });

        it('should accept .org email', () => {
            expect(validateEmail('user@example.org')).toBe(true);
        });

        it('should accept .net email', () => {
            expect(validateEmail('user@example.net')).toBe(true);
        });

        // BUG: These tests will FAIL with the current implementation
        it('should accept 2-character TLD like .io', () => {
            expect(validateEmail('luigi@example.io')).toBe(true);
        });

        it('should accept 4-character TLD like .info', () => {
            expect(validateEmail('john@company.info')).toBe(true);
        });

        it('should accept .edu email', () => {
            expect(validateEmail('student@university.edu')).toBe(true);
        });

        it('should accept multi-part TLD like .co.uk', () => {
            expect(validateEmail('user@example.co.uk')).toBe(true);
        });

        it('should accept .tech TLD', () => {
            expect(validateEmail('admin@startup.tech')).toBe(true);
        });

        it('should accept email with numbers', () => {
            expect(validateEmail('user123@example.com')).toBe(true);
        });

        it('should accept email with dots in username', () => {
            expect(validateEmail('first.last@example.com')).toBe(true);
        });

        it('should accept email with hyphens in username', () => {
            expect(validateEmail('first-last@example.com')).toBe(true);
        });

        it('should accept email with plus sign', () => {
            expect(validateEmail('user+tag@example.com')).toBe(true);
        });
    });

    describe('Invalid email addresses', () => {
        it('should reject empty string', () => {
            expect(validateEmail('')).toBe(false);
        });

        it('should reject email without @', () => {
            expect(validateEmail('userexample.com')).toBe(false);
        });

        it('should reject email without domain', () => {
            expect(validateEmail('user@')).toBe(false);
        });

        it('should reject email without username', () => {
            expect(validateEmail('@example.com')).toBe(false);
        });

        it('should reject email without TLD', () => {
            expect(validateEmail('user@example')).toBe(false);
        });

        it('should reject email with spaces', () => {
            expect(validateEmail('user @example.com')).toBe(false);
        });

        it('should reject email with multiple @', () => {
            expect(validateEmail('user@@example.com')).toBe(false);
        });
    });

    describe('Edge cases', () => {
        it('should handle emails with leading/trailing spaces after sanitization', () => {
            expect(validateEmail('  user@example.com  ')).toBe(true);
        });

        it('should handle uppercase emails after sanitization', () => {
            expect(validateEmail('USER@EXAMPLE.COM')).toBe(true);
        });

        it('should handle mixed case emails', () => {
            expect(validateEmail('User@Example.Com')).toBe(true);
        });
    });

    describe('Specific bug cases - Luigi and John', () => {
        it('should accept Luigi\'s email with .io TLD', () => {
            // This test documents the actual bug
            expect(validateEmail('luigi@example.io')).toBe(true);
        });

        it('should accept John\'s email with .info TLD', () => {
            // This test documents the actual bug
            expect(validateEmail('john@company.info')).toBe(true);
        });
    });
});

describe('sanitizeEmail', () => {
    it('should trim whitespace', () => {
        expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
    });

    it('should convert to lowercase', () => {
        expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    it('should trim and lowercase together', () => {
        expect(sanitizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
    });

    it('should handle already clean email', () => {
        expect(sanitizeEmail('user@example.com')).toBe('user@example.com');
    });
});