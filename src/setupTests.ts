import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
}));

// Mock expo-font
jest.mock('@expo-google-fonts/nunito', () => ({
    useFonts: () => [true],
    Nunito_400Regular: 'Nunito_400Regular',
    Nunito_600SemiBold: 'Nunito_600SemiBold',
    Nunito_700Bold: 'Nunito_700Bold',
    Nunito_800ExtraBold: 'Nunito_800ExtraBold',
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
    StatusBar: 'StatusBar',
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => ({
    __esModule: true,
    default: 'MapView',
    Marker: 'Marker',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
