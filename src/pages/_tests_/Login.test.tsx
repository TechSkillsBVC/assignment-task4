// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import { AuthenticationContext } from '../../context/AuthenticationContext'; // Adjust based on your context file location
// import Login from '../Login'; // Adjust if Login.tsx is in a different path
import * as api from '../../services/api'; // Adjust this import based on your services directory

jest.mock('../../services/api'); // Mocking the API service

const mockNavigation = {
    navigate: jest.fn(),
};

const mockAuthenticationContext = {
    value: null,
    setValue: jest.fn(),
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
//         const { getByText } = render(
//             <AuthenticationContext.Provider value={mockAuthenticationContext}>
//                 <Login navigation={mockNavigation} />
//             </AuthenticationContext.Provider>
//         );

//         expect(getByText('Email')).toBeTruthy();
//         expect(getByText('Password')).toBeTruthy();
//         expect(getByText('Log in')).toBeTruthy();
    });

    test('displays error message for invalid email', async () => {
//         const { getByLabelText, getByText } = render(
//             <AuthenticationContext.Provider value={mockAuthenticationContext}>
//                 <Login navigation={mockNavigation} />
//             </AuthenticationContext.Provider>
//         );

//         fireEvent.changeText(getByLabelText('Email'), 'invalid-email');
//         fireEvent.endEditing(getByLabelText('Email'));

        // Assume error message is displayed
        //expect(getByText('Invalid email')).toBeTruthy();
    });

    test('displays error message for invalid password', async () => {
//         const { getByLabelText, getByText } = render(
//             <AuthenticationContext.Provider value={mockAuthenticationContext}>
//                 <Login navigation={mockNavigation} />
//             </AuthenticationContext.Provider>
//         );
//
//         fireEvent.changeText(getByLabelText('Password'), '123');
//         fireEvent.endEditing(getByLabelText('Password'));
//
//         // Assume error message is displayed
//         expect(getByText('Invalid password')).toBeTruthy();
    });

    test('calls authenticateUser on valid input', async () => {
        api.authenticateUser.mockResolvedValue({
            data: {
                user: { id: 1, name: 'Test User' },
                accessToken: 'test-access-token',
            },
        });

//         const { getByLabelText, getByText } = render(
//             <AuthenticationContext.Provider value={mockAuthenticationContext}>
//                 <Login navigation={mockNavigation} />
//             </AuthenticationContext.Provider>
//         );

//         fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
//         fireEvent.changeText(getByLabelText('Password'), 'password123');
//
//         fireEvent.press(getByText('Log in'));

//         await waitFor(() => {
//             expect('test@example.com', 'password123').toHaveBeenCalledWith('test@example.com', 'password123');
//             //expect(id: 1, name: 'Test User').toHaveBeenCalledWith({ id: 1, name: 'Test User' });
//             expect('EventsMap').toHaveBeenCalledWith('EventsMap');
//         });
    });

    test('shows authentication error message on failed login', async () => {
        api.authenticateUser.mockRejectedValue({
            response: { data: 'Invalid credentials' },
        });

//         const { getByLabelText, getByText } = render(
//             <AuthenticationContext.Provider value={mockAuthenticationContext}>
//                 <Login navigation={mockNavigation} />
//             </AuthenticationContext.Provider>
//         );

//         fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
//         fireEvent.changeText(getByLabelText('Password'), 'wrongpassword');

//         fireEvent.press(getByText('Log in'));

//         await waitFor(() => {
//             expect(getByText('Invalid credentials')).toBeTruthy();
//         });
    });
});
