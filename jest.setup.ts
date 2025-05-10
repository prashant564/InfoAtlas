// jest.setup.js

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// BootSplash mock
jest.mock('react-native-bootsplash', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

// Reanimated mock
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

// Silence useNativeDriver warning
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
