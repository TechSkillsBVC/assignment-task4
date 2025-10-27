// import the function we want to test
import { validateEmail } from '../src/utils/index';

describe('validateEmail bug reproduction', () => {
  // checks that a normal .com email works
  it('accepts mario@test.com (control)', () => {
    expect(validateEmail('mario@test.com')).toBe(true);
  });

  // reproduces Luigi ().it)
  it('accepts luigi@carluccio.it', () => {
    expect(validateEmail('luigi@carluccio.it')).toBe(true);
  });

  // reproduces john issue (.com.br)
  it('accepts john@silva.com.br', () => {
    expect(validateEmail('john@silva.com.br')).toBe(true);
  });
});
