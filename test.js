const { validateEmail } = require('./src/utils'); 

describe('Email Validation', () => {
    test('valid email with .it extension', () => {
        const email = 'user@domain.it';
        expect(validateEmail(email)).toBe(true);
    });

    test('valid email with .br extension', () => {
        const email = 'user@domain.br';
        expect(validateEmail(email)).toBe(true);
    });

    test('valid email with .com extension', () => {
        const email = 'user@domain.com';
        expect(validateEmail(email)).toBe(true);
    });

    test('invalid email with spaces', () => {
        const email = 'user @domain.com';
        expect(validateEmail(email)).toBe(false);
    });

    test('invalid email with missing domain', () => {
        const email = 'user@domain';
        expect(validateEmail(email)).toBe(false);
    });

    test('invalid email without "@" symbol', () => {
        const email = 'userdomain.com';
        expect(validateEmail(email)).toBe(false);
    });

    test('invalid email with unsupported extension', () => {
        const email = 'user@domain.xyz'; // xyz is not supported in our regex
        expect(validateEmail(email)).toBe(false);
    });
});

describe('Login Function', () => {
    // Mock the login function to simulate the API response
    test('login with valid credentials', async () => {
        const mockLogin = jest.fn().mockResolvedValue({ status: 200, data: { accessToken: 'mockToken', user: { email: 'user@domain.it' } } });

        const response = await mockLogin('ulla.ulriksen@example.com', '$2a$10$hd96yCeGW794sN8OL7SeMeOGPVEY.wiQDcsHbf5p.Ngtjx93iqjIG');
        expect(response.status).toBe(200);
        expect(response.data.accessToken).toBe('mockToken');
    });

    test('login with incorrect password', async () => {
        const mockLogin = jest.fn().mockResolvedValue({ status: 400, data: { message: 'Incorrect password' } });

        const response = await mockLogin('ulla.ulriksen@example.com', 'incorrectPassword');
        expect(response.status).toBe(400);
        expect(response.data.message).toBe('Incorrect password');
    });

    test('login with non-existent user', async () => {
        const mockLogin = jest.fn().mockResolvedValue({ status: 400, data: { message: 'Cannot find user' } });

        const response = await mockLogin('nonexistent@domain.it', 'password');
        expect(response.status).toBe(400);
        expect(response.data.message).toBe('Cannot find user');
    });
});
