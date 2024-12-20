import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../types/navigation';
import Login from '../pages/Login';
import EventsMap from '../pages/EventsMap';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { User } from '../types/User';

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
    const [authenticatedUser, setAuthenticatedUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing authentication
        const checkAuth = async () => {
            try {
                const userData = await AsyncStorage.getItem('@user');
                if (userData) {
                    setAuthenticatedUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return null; // In a real app, show a loading spinner here
    }

    return (
        <AuthenticationContext.Provider 
            value={{
                value: authenticatedUser,
                setValue: async (newValue: User | undefined) => {
                    try {
                        if (newValue) {
                            await AsyncStorage.setItem('@user', JSON.stringify(newValue));
                        } else {
                            await AsyncStorage.removeItem('@user');
                        }
                        setAuthenticatedUser(newValue);
                    } catch (error) {
                        console.error('Error updating authentication:', error);
                    }
                }
            }}
        >
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: '#F2F3F5' },
                    }}
                    initialRouteName={authenticatedUser ? 'EventsMap' : 'Login'}
                >
                    {!authenticatedUser ? (
                        <Stack.Screen name="Login" component={Login} />
                    ) : (
                        <Stack.Screen name="EventsMap" component={EventsMap} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthenticationContext.Provider>
    );
}
