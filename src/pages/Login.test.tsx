import { Alert } from 'react-native';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login';
import { AuthenticationContext } from '../context/AuthenticationContext';

const mockNavigate = jest.fn();
const mockSetValue = jest.fn();

jest.mock('../services/api', () => ({
    authenticateUser: jest.fn(),
}));

jest.mock('../services/caching', () => ({
    getFromCache: jest.fn(() => Promise.reject('Not found')),
    setInCache: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useIsFocused: jest.fn(() => true),
}));

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: ({ children }: any) => children,
}));

jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
    KeyboardAwareScrollView: ({ children }: any) => children,
}));

jest.mock('react-native-loading-spinner-overlay', () => () => null);

jest.mock('../components/Spacer', () => () => null);

jest.mock('../context/AuthenticationContext', () => {
    const React = require('react');

    return {
        AuthenticationContext: React.createContext({
            value: undefined,
            setValue: mockSetValue,
        }),
    };
});

describe('Login Screen Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        require('../services/api').authenticateUser.mockResolvedValue({
            data: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    name: {
                        first: 'Test',
                        last: 'User',
                    },
                    mobile: '1234567890',
                },
                accessToken: 'test-access-token',
            },
        });
    });

 const renderLogin = () =>
    render(
        <AuthenticationContext.Provider
            value={{
                value: undefined as any,
                setValue: mockSetValue,
            }}
        >
            <Login
                navigation={{ navigate: mockNavigate } as any}
                route={{ key: 'Login', name: 'Login' } as any}
            />
        </AuthenticationContext.Provider>
    );
    test('should display email and password fields', () => {
        const { getByText } = renderLogin();

        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Password')).toBeTruthy();
    });

    test('should authenticate user and navigate to EventsMap after successful login', async () => {
        const { getByTestId } = renderLogin();

        fireEvent.changeText(
            getByTestId('email-input'),
            'test@example.com'
        );

        fireEvent.changeText(
            getByTestId('password-input'),
            'Test123456'
        );

        fireEvent.press(getByTestId('login-button'));

        const api = require('../services/api');

        await waitFor(() => {
            expect(api.authenticateUser).toHaveBeenCalledWith(
                'test@example.com',
                'Test123456'
            );
        });

        await waitFor(() => {
            expect(mockSetValue).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('EventsMap');
        });
    });
    test('should show an error when login credentials are incorrect', async () => {
    const api = require('../services/api');
    const alertSpy = jest.spyOn(Alert, 'alert');

    api.authenticateUser.mockRejectedValue({
        response: {
            data: 'Invalid email or password',
        },
    });

    const { getByTestId } = renderLogin();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Wrong123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
        expect(api.authenticateUser).toHaveBeenCalledWith(
            'test@example.com',
            'Wrong123'
        );
    });

    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
            'Authentication Error',
            'Invalid email or password',
            expect.any(Array)
        );
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
});
    test('should show a network error when internet connection is unavailable', async () => {
        const api = require('../services/api');
        const alertSpy = jest.spyOn(Alert, 'alert');

        api.authenticateUser.mockRejectedValue({
            request: {},
        });

        const { getByTestId } = renderLogin();

        fireEvent.changeText(
            getByTestId('email-input'),
            'test@example.com'
        );

        fireEvent.changeText(
            getByTestId('password-input'),
            'Test123456'
        );

        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(api.authenticateUser).toHaveBeenCalledWith(
                'test@example.com',
                'Test123456'
            );
        });

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Authentication Error',
                'Network Error. Please check your internet connection and try again.',
                expect.any(Array)
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});