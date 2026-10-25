import { formatAMPM, isTokenExpired, validateEmail } from '../src/utils';

// Builds an unsigned JWT with the given payload. Only the payload is read by isTokenExpired.
const createToken = (payload: object) => {
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
};

const nowInSeconds = () => Math.floor(Date.now() / 1000);

describe('validateEmail', () => {
    it('EMAIL-01 accepts a standard .com address', () => {
        expect(validateEmail('ulla.ulriksen@example.com')).toBe(true);
    });

    it.each(['luigi@carluccio.it', 'john@silva.com.br', 'volunteer@calgary.ca', 'x@domain.info', 'first+tag@gmail.com'])(
        'EMAIL-02 accepts %s',
        (email) => {
            expect(validateEmail(email)).toBe(true);
        }
    );

    it.each(['', 'plainaddress', 'user@', '@example.com', 'user@example', 'user name@example.com'])(
        'EMAIL-03 rejects "%s"',
        (email) => {
            expect(validateEmail(email)).toBe(false);
        }
    );
});

describe('formatAMPM', () => {
    // Creates a local date at the given 24-hour time ("HH:MM").
    const at = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return new Date(2023, 0, 1, hours, minutes);
    };

    it.each([
        ['00:05', '12:05 am'],
        ['09:30', '9:30 am'],
        ['12:00', '12:00 pm'],
    ])('TIME-01 formats %s as %s', (time, expected) => {
        expect(formatAMPM(at(time))).toBe(expected);
    });

    it.each([
        ['13:07', '1:07 pm'],
        ['23:59', '11:59 pm'],
    ])('TIME-02 formats %s as %s', (time, expected) => {
        expect(formatAMPM(at(time))).toBe(expected);
    });
});

describe('isTokenExpired', () => {
    it('TOKEN-01 returns false for a token that expires in the future', () => {
        expect(isTokenExpired(createToken({ exp: nowInSeconds() + 3600 }))).toBe(false);
    });

    it('TOKEN-01 returns true for a token that has expired', () => {
        expect(isTokenExpired(createToken({ exp: nowInSeconds() - 3600 }))).toBe(true);
    });

    it('TOKEN-02 returns true for a token without an expiry', () => {
        expect(isTokenExpired(createToken({ sub: 'EF-BZ00' }))).toBe(true);
    });

    it('TOKEN-02 returns true for a malformed token', () => {
        expect(isTokenExpired('not-a-jwt')).toBe(true);
    });
});
