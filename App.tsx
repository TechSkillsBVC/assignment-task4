import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { View } from 'react-native';

import {
    useFonts,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import AppStack from './src/routes/AppStack';
import { StatusBar } from 'expo-status-bar';
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) {
        return <LoadingSpinner />;
    }

    return (
        <ErrorBoundary>
            <View style={{ flex: 1 }}>
                <StatusBar animated translucent style="dark" />
                <ActionSheetProvider>
                    <AppStack />
                </ActionSheetProvider>
            </View>
        </ErrorBoundary>
    );
}
