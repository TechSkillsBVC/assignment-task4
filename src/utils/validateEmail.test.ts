import { validateEmail } from './index';

describe('validateEmail - Custom and International TLD Bug Reproduction', () => {
  it('should successfully validate standard 3-letter TLD emails', () => {
    expect(validateEmail('ulla.ulriksen@example.com')).toBe(true);
  });

  it('should FAIL to validate Luigi\'s 2-letter TLD email (.it)', () => {
    const luigiEmail = 'luigi@carluccio.it';
    expect(validateEmail(luigiEmail)).toBe(true);
  });

  it('should FAIL to validate John\'s multi-part country TLD email (.com.br)', () => {
    const johnEmail = 'john@silva.com.br';
    expect(validateEmail(johnEmail)).toBe(true);
  });
});