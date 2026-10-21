import { validateEmail } from './index';

describe('validateEmail', () => {
    describe('valid emails that must be accepted', () => {
        const validEmails = [
            'user@example.com', // baseline, 3-letter TLD
            'luigi@carluccio.it', // 2-letter TLD (reported bug: a real volunteer's login email)
            'john@silva.com.br', // multi-level domain ending in a 2-letter TLD
            'user@example.info', // 4-letter TLD
            'user+tag@example.com', // plus-addressing in the local part
            'first.last@sub.example.com', // subdomain
            '  USER@EXAMPLE.COM  ', // surrounding whitespace and uppercase, should be sanitized
        ];

        test.each(validEmails)('accepts "%s"', (email) => {
            expect(validateEmail(email)).toBe(true);
        });
    });

    describe('invalid emails that must be rejected', () => {
        const invalidEmails = [
            '', // empty
            'notanemail', // no @ and no domain
            '@example.com', // no local part
            'user@', // no domain
            'user@.com', // empty domain label
            'user@com', // no dot / no TLD
            'user name@example.com', // space in the local part
            'user@exam ple.com', // space in the domain
        ];

        test.each(invalidEmails)('rejects "%s"', (email) => {
            expect(validateEmail(email)).toBe(false);
        });
    });
});
