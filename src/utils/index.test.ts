import { validateEmail } from './index';

describe('validateEmail', () => {
  test('accepts common valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user@example.co')).toBe(true);
    expect(validateEmail('luigi@carluccio.it')).toBe(true);
    expect(validateEmail('john@silva.com.br')).toBe(true);
  });

  test('accepts complex valid emails', () => {
    expect(validateEmail('first.last+tag@sub.domain.co.uk')).toBe(true);
  });

  test('rejects invalid emails', () => {
    expect(validateEmail('plainaddress')).toBe(false);
    expect(validateEmail('user@invalid')).toBe(false);
    expect(validateEmail('user@invalid.')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('user@@example.com')).toBe(false);
    expect(validateEmail('user@example.c')).toBe(false); // TLD too short
    expect(validateEmail('user@example.123')).toBe(false); // numeric TLDs are uncommon; keep simple rule
  });
});
