import { installGlobals } from '@testing-library/jest-native/extend-expect';
installGlobals();

jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));