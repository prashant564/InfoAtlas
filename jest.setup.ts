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
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Optional: Override `call` with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});
