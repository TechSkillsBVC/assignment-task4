/// <reference types="react" />
/// <reference types="react-native" />

declare module '@expo/react-native-action-sheet' {
    export const ActionSheetProvider: React.FC<{
        children: React.ReactNode;
    }>;
}

declare module '@expo-google-fonts/nunito' {
    export function useFonts(fonts: {
        Nunito_400Regular: any;
        Nunito_600SemiBold: any;
        Nunito_700Bold: any;
        Nunito_800ExtraBold: any;
    }): [boolean];

    export const Nunito_400Regular: any;
    export const Nunito_600SemiBold: any;
    export const Nunito_700Bold: any;
    export const Nunito_800ExtraBold: any;
}

declare module 'expo-status-bar' {
    export const StatusBar: React.FC<{
        animated?: boolean;
        translucent?: boolean;
        style?: 'auto' | 'inverted' | 'light' | 'dark';
    }>;
}

declare module '@react-navigation/native' {
    import type { ComponentType } from 'react';
    
    export interface NavigationContainerProps {
        children: React.ReactNode;
    }
    
    export const NavigationContainer: ComponentType<NavigationContainerProps>;
    export type RouteProp<T, K extends keyof T> = {
        key: string;
        name: K;
        params: T[K];
    };
}

declare module '@react-navigation/stack' {
    import type { ComponentType } from 'react';
    
    export type StackNavigationProp<T, K extends keyof T> = {
        navigate: (scene: K, params?: T[K]) => void;
        goBack: () => void;
    };

    export interface StackNavigatorProps {
        screenOptions?: {
            headerShown?: boolean;
            cardStyle?: {
                backgroundColor?: string;
            };
        };
        initialRouteName?: string;
        children: React.ReactNode;
    }

    export interface StackScreenProps {
        name: string;
        component: ComponentType<any>;
    }
    
    export function createStackNavigator<T = Record<string, object>>(): {
        Navigator: ComponentType<StackNavigatorProps>;
        Screen: ComponentType<StackScreenProps>;
    };
}

declare module '@react-native-async-storage/async-storage' {
    const AsyncStorage: {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        removeItem(key: string): Promise<void>;
        clear(): Promise<void>;
        getAllKeys(): Promise<string[]>;
    };
    export default AsyncStorage;
}

declare module '*.png' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}
