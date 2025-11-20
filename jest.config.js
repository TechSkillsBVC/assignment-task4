module.exports = {
  preset: 'react-native',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // IMPORTANT: allow Jest/Babel to transform expo-constants and expo-modules-core too
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|expo-constants|expo-modules-core|@expo|@unimodules|unimodules)/)',
  ],
};
