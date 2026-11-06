    import { validateEmail } from '../index';

    describe('validateEmail', () => {
        test.each([
            'bob.last@gmail.com',
            'luigi@carluccio.it',
            'john@silva.com.br',
            'student@school.ca',
            'bob@site.io',
            'bob@site.info',
            '  Luigi@Carluccio.IT  ',
        ])('accepts valid email: %s', (email) => {
            expect(validateEmail(email)).toBe(true);
        });

        test.each(['', 'bob', 'bob@', '@gmail.com', 'bob@gmail', 'bob@@gmail.com', 'bob gmail.com', 'bob@site.c'])(
            'rejects invalid email: "%s"',
            (email) => {
                expect(validateEmail(email)).toBe(false);
            }
        );
    });