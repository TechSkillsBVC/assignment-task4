// login.test.js
const bcrypt = require('bcryptjs'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jwt
const { login } = require('./src/pages/Login'); // Adjust the import according to your login function file

// Mock bcrypt.compare and jwt.sign
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Dummy user data for the test
const fakeUser = {
  email: 'ulla.ulriksen@example.com',
  password: '$2a$10$hd96yCeGW794sN8OL7SeMeOGPVEY.wiQDcsHbf5p.Ngtjx93iqjIG', // Hashed password
};

describe('Login function', () => {
  it('should log in successfully if the password matches', async () => {
    // Mock bcrypt.compare to always return true
    bcrypt.compare.mockResolvedValue(true); // This simulates a correct password check
    // Mock jwt.sign to return a fake JWT token
    jwt.sign.mockImplementation((payload, secret, options, callback) => callback(null, 'fake-jwt-token'));

    const req = { body: { email: fakeUser.email, password: 'password123' } }; // Simulate login request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock response object

    // Run the login function
    await login(req, res, () => {});

    // Test the response: Check if status(200) is called and json contains accessToken
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: 'fake-jwt-token',
      user: expect.objectContaining({ email: fakeUser.email }),
    }));
  });

  it('should return an error if passwords do not match', async () => {
    // Mock bcrypt.compare to always return false
    bcrypt.compare.mockResolvedValue(false); // Simulate incorrect password check

    const req = { body: { email: fakeUser.email, password: 'wrongPassword' } }; // Simulate wrong password attempt
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock response object

    // Run the login function
    await login(req, res, () => {});

    // Test the response: Check if status(400) is called and the correct error message is returned
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Incorrect password');
  });
});
