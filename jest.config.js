module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
    transform: {
        '^.+\\.(js|ts|jsx|tsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/android/',
        '<rootDir>/ios/',
        '<rootDir>/e2e/',
        '<rootDir>/dist/',
    ],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '^react-native$': 'react-native-web',
    },
};
