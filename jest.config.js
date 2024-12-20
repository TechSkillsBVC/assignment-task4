module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.ts',
        '@testing-library/jest-native/extend-expect'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@types/(.*)$': '<rootDir>/src/types/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1'
    },
    testEnvironment: 'jsdom',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**'
    ],
    globals: {
        __DEV__: true
    },
    setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js']
};
