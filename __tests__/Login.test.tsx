import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React, { useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { AuthenticationContext } from '../src/context/AuthenticationContext';
import Login from '../src/pages/Login';
import * as api from '../src/services/api';
import { User } from '../src/types/User';

jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
jest.mock('../src/services/api');

const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetItem = AsyncStorage.getItem as jest.Mock;

const user: User = {
    id: 'EF-BZ00',
    name: { first: 'Ulla', last: 'Ulriksen' },
    email: 'ulla.ulriksen@example.com',
    mobile: '(910) 862-3167',
};

const createToken = (payload: object) => {
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
};

// Renders Login inside an authentication context provider, as AppStack does.
const renderLogin = () => {
    const navigation = { navigate: jest.fn() };

    const Wrapper = () => {
        const [authenticatedUser, setAuthenticatedUser] = useState<User>();
        return (
            <AuthenticationContext.Provider value={{ value: authenticatedUser as User, setValue: setAuthenticatedUser }}>
                <Login navigation={navigation as any} route={{} as any} />
            </AuthenticationContext.Provider>
        );
    };

    render(<Wrapper />);
    return navigation;
};

const submitLogin = (email: string, password: string) => {
    const [emailInput, passwordInput] = screen.UNSAFE_getAllByType(TextInput);
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(passwordInput, password);
    fireEvent.press(screen.getByText('Log in'));
};

// Serves cached values from AsyncStorage, each resolving after the given delay in milliseconds.
const mockCache = (entries: Record<string, { value: unknown; delay: number }>) => {
    mockedGetItem.mockImplementation(
        (key: string) =>
            new Promise((resolve) =>
                setTimeout(() => resolve(entries[key] ? JSON.stringify(entries[key].value) : null), entries[key]?.delay ?? 0)
            )
    );
};

beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockResolvedValue(null);
});

describe('Login', () => {
    it('LOGIN-01 rejects an invalid email without calling the API', () => {
        renderLogin();
        submitLogin('plainaddress', 'password123');

        expect(screen.getByText('invalid email')).toBeTruthy();
        expect(mockedApi.authenticateUser).not.toHaveBeenCalled();
    });

    it('LOGIN-02 sends a login request for an email with a two-letter domain', () => {
        mockedApi.authenticateUser.mockReturnValue(new Promise(() => {}));
        renderLogin();
        submitLogin('luigi@carluccio.it', 'password123');

        expect(mockedApi.authenticateUser).toHaveBeenCalledWith('luigi@carluccio.it', 'password123');
    });

    it('LOGIN-03 shows the server error message when credentials are rejected', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        mockedApi.authenticateUser.mockRejectedValue({ response: { data: 'Incorrect password' } });
        renderLogin();
        submitLogin('ulla.ulriksen@example.com', 'wrongpassword');

        await waitFor(() =>
            expect(alertSpy).toHaveBeenCalledWith('Authentication Error', 'Incorrect password', expect.any(Array))
        );
    });

    describe('with a valid cached session', () => {
        const accessToken = createToken({ exp: Math.floor(Date.now() / 1000) + 3600 });

        it('LOGIN-04 navigates to EventsMap when the user is read from the cache first', async () => {
            mockCache({ userInfo: { value: user, delay: 0 }, accessToken: { value: accessToken, delay: 20 } });
            const navigation = renderLogin();

            await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('EventsMap'));
        });

        it('LOGIN-05 navigates to EventsMap when the token is read from the cache first', async () => {
            mockCache({ userInfo: { value: user, delay: 20 }, accessToken: { value: accessToken, delay: 0 } });
            const navigation = renderLogin();

            await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('EventsMap'));
        });
    });
});
