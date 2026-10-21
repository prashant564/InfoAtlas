import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingScreen from '@screens/settings-screen/settings.main';
import {Theme, ThemeContext} from '@utils/ThemeContext';

const renderSettings = (themeMode: Theme, setThemeMode = jest.fn()) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: {x: 0, y: 0, width: 390, height: 844},
        insets: {top: 0, left: 0, right: 0, bottom: 0},
      }}>
      <ThemeContext.Provider value={{themeMode, setThemeMode, isDark: false}}>
        <SettingScreen />
      </ThemeContext.Provider>
    </SafeAreaProvider>,
  );

describe('SettingScreen appearance', () => {
  test('offers System, Light and Dark and saves the choice', () => {
    const setThemeMode = jest.fn();
    renderSettings(Theme.System, setThemeMode);

    expect(screen.getByText('System')).toBeTruthy();
    expect(screen.getByText('Light')).toBeTruthy();

    fireEvent.press(screen.getByText('Dark'));
    expect(setThemeMode).toHaveBeenCalledWith(Theme.Dark);
  });

  test('marks the current mode as selected', () => {
    renderSettings(Theme.Light);
    expect(
      screen.getByRole('button', {name: /Light/, selected: true}),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {name: /System/, selected: false}),
    ).toBeTruthy();
  });
});
