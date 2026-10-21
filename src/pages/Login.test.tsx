import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Login from './Login';

// KeyboardAwareScrollView reaches into react-native internals that the test
// renderer doesn't provide; it's a plain ScrollView wrapper and doesn't
// affect the validation logic under test.
jest.mock('react-native-keyboard-aware-scroll-view', () => ({
    KeyboardAwareScrollView: require('react-native').ScrollView,
}));

const navigation = { navigate: jest.fn() } as any;

const renderLogin = () =>
    render(
        <NavigationContainer>
            <Login navigation={navigation} route={{} as any} />
        </NavigationContainer>
    );

describe('Login screen - email validation', () => {
    test('does not show "invalid email" for a valid email with a two-letter TLD', () => {
        const { getByTestId, queryByText } = renderLogin();

        const emailInput = getByTestId('email-input');
        fireEvent.changeText(emailInput, 'luigi@carluccio.it');
        fireEvent(emailInput, 'onEndEditing');

        expect(queryByText('invalid email')).toBeNull();
    });

    test('shows "invalid email" for a genuinely malformed email', () => {
        const { getByTestId, queryByText } = renderLogin();

        const emailInput = getByTestId('email-input');
        fireEvent.changeText(emailInput, 'not-an-email');
        fireEvent(emailInput, 'onEndEditing');

        expect(queryByText('invalid email')).not.toBeNull();
    });
});
