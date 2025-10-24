// jest-setup.ts

// Keep expo-constants from loading ESM/native stuff
jest.mock('expo-constants', () => {
  return {
    __esModule: true,
    default: { expoConfig: { extra: {} } },
    expoConfig: { extra: {} },
  };
});

// Provide ONLY what your utils need from react-native.
// DO NOT spread/return the real module — that’s what caused the native warnings.
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (objs: any) => objs.ios },
}));
