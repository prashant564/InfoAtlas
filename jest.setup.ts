// jest.setup.js

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Gesture handler mock
require('react-native-gesture-handler/jestSetup');

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

// Navigation mock for Jest: avoid loading native screen codegen components.
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');

  const MockScreen = ({children}: {children?: React.ReactNode}) =>
    React.createElement(React.Fragment, null, children);
  const MockNavigator = ({children}: {children?: React.ReactNode}) =>
    React.createElement(React.Fragment, null, children);

  return {
    createNativeStackNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});

// FlashList renders nothing in Jest without a layout pass.
require('@shopify/flash-list/jestSetup');
