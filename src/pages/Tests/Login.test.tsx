import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import Login from '../Login';
import * as api from '../../services/api';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { StackNavigationProp } from '@react-navigation/stack';

jest.mock('../../services/api');

const mockRoute = {
  key: 'routeKey',
  name: 'Login',
  params: {}, 
};

const mockProps = {
  navigation: {} as StackNavigationProp<any>,
  route: mockRoute,
};

const mockedApi = api as jest.Mocked<typeof api>;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

const mockNavigation = {
  navigate: jest.fn() as jest.MockedFunction<any>,
  dispatch: jest.fn() as jest.MockedFunction<any>,
  reset: jest.fn() as jest.MockedFunction<any>,
  goBack: jest.fn() as jest.MockedFunction<any>,
  isFocused: jest.fn(() => true) as jest.MockedFunction<any>,
  addListener: jest.fn() as jest.MockedFunction<any>,
  removeListener: jest.fn() as jest.MockedFunction<any>,
  setParams: jest.fn() as jest.MockedFunction<any>,
  canGoBack: jest.fn(() => true) as jest.MockedFunction<any>,
  getId: jest.fn(() => undefined) as jest.MockedFunction<any>,
  getState: jest.fn(() => ({ key: 'stateKey', index: 0, routes: [] })) as jest.MockedFunction<any>,
};

const mockAuthenticationContext = {
  value: null,
  setValue: jest.fn(),
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rendering is done without error', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthenticationContext.Provider value={mockAuthenticationContext}>
        <Login {...mockProps} />
      </AuthenticationContext.Provider>
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  test('displays error for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthenticationContext.Provider value={mockAuthenticationContext}>
        <Login {...mockProps} />
      </AuthenticationContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Invalid email')).toBeTruthy();
    });
  });

  test('displays error for invalid password', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthenticationContext.Provider value={mockAuthenticationContext}>
        <Login {...mockProps} />
      </AuthenticationContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Password'), '123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Invalid password')).toBeTruthy();
    });
  });

  test('calls authenticateUser when valid credentials used', async () => {
    mockedApi.authenticateUser.mockResolvedValue({
      data: {
        user: { id: 1, name: 'Test User' },
        accessToken: 'test-access-token',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthenticationContext.Provider value={mockAuthenticationContext}>
        <Login {...mockProps} />
      </AuthenticationContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockedApi.authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockAuthenticationContext.setValue).toHaveBeenCalledWith({
        id: 1,
        name: 'Test User',
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EventsMap');
    });
  });

  test('throws error on failed login attempt', async () => {
    mockedApi.authenticateUser.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthenticationContext.Provider value={mockAuthenticationContext}>
        <Login {...mockProps} />
      </AuthenticationContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
});
