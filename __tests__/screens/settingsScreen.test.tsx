import React from 'react';
import {Alert, Linking} from 'react-native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingScreen, {
  formatDataDate,
} from '@screens/settings-screen/settings.main';
import {useAppBoundStore} from '@store/mainStore';
import {Theme, ThemeContext} from '@utils/ThemeContext';

jest.mock('@utils/storageUtils', () => ({
  load: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}));

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

describe('SettingScreen', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    useAppBoundStore.setState({
      countriesDataVersion: 2,
      countriesDataUpdatedAt: '2026-10-21',
      travelEntries: {},
    });
  });

  describe('appearance', () => {
    test('offers System, Light and Dark and saves the choice', () => {
      const setThemeMode = jest.fn();
      renderSettings(Theme.System, setThemeMode);

      expect(screen.getByRole('radio', {name: 'System'})).toBeTruthy();
      fireEvent.press(screen.getByRole('radio', {name: 'Dark'}));
      expect(setThemeMode).toHaveBeenCalledWith(Theme.Dark);
    });

    test('marks the current mode as selected', () => {
      renderSettings(Theme.Light);
      expect(
        screen.getByRole('radio', {name: 'Light', checked: true}),
      ).toBeTruthy();
      expect(
        screen.getByRole('radio', {name: 'System', checked: false}),
      ).toBeTruthy();
    });
  });

  describe('your data', () => {
    test('shows the data version and reports the update check', async () => {
      const check = jest.fn().mockResolvedValue('up-to-date');
      useAppBoundStore.setState({__checkForCountriesUpdate: check});
      renderSettings(Theme.System);

      expect(screen.getByText(/Version 2 · Updated/)).toBeTruthy();

      fireEvent.press(screen.getByText('Check for country updates'));
      expect(await screen.findByText('Up to date')).toBeTruthy();
      expect(check).toHaveBeenCalledTimes(1);
    });

    test('says when the check fails', async () => {
      useAppBoundStore.setState({
        __checkForCountriesUpdate: jest.fn().mockResolvedValue('failed'),
      });
      renderSettings(Theme.System);

      fireEvent.press(screen.getByText('Check for country updates'));
      expect(await screen.findByText("Couldn't check")).toBeTruthy();
    });

    test('clears travel history only after confirming', async () => {
      useAppBoundStore.setState({
        travelEntries: {
          IND: {status: 'visited', updatedAt: '2026-01-01'},
          PER: {status: 'wishlist', updatedAt: '2026-01-01'},
        },
      });
      const alert = jest.spyOn(Alert, 'alert');
      renderSettings(Theme.System);

      expect(screen.getByText('1 visited · 1 on wishlist')).toBeTruthy();
      fireEvent.press(screen.getByText('Clear travel history'));

      expect(alert).toHaveBeenCalledTimes(1);
      expect(useAppBoundStore.getState().travelEntries).not.toEqual({});

      const buttons = alert.mock.calls[0][2]!;
      const clear = buttons.find(button => button.text === 'Clear')!;
      expect(clear.style).toBe('destructive');
      await act(async () => clear.onPress!());

      expect(useAppBoundStore.getState().travelEntries).toEqual({});
      await waitFor(() =>
        expect(screen.getByText('Nothing to clear yet')).toBeTruthy(),
      );
    });

    test('does not offer to clear an empty history', () => {
      const alert = jest.spyOn(Alert, 'alert');
      renderSettings(Theme.System);

      fireEvent.press(screen.getByText('Clear travel history'));
      expect(alert).not.toHaveBeenCalled();
    });
  });

  describe('about', () => {
    test('opens the legal pages', () => {
      const openURL = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValue(undefined);
      renderSettings(Theme.System);

      fireEvent.press(screen.getByText('Privacy Policy'));
      expect(openURL).toHaveBeenCalledWith(
        expect.stringContaining('privacy-policy'),
      );
    });

    test('hides store rows until the app is live', () => {
      renderSettings(Theme.System);
      expect(screen.queryByText('Rate InfoAtlas')).toBeNull();
    });

    test('shows the app version', () => {
      renderSettings(Theme.System);
      expect(screen.getByText(/^Version \d+\.\d+\.\d+$/)).toBeTruthy();
    });
  });
});

describe('formatDataDate', () => {
  test('formats a UTC day without shifting it', () => {
    expect(formatDataDate('2026-10-21')).toMatch(/21/);
    expect(formatDataDate('2026-10-21')).toMatch(/2026/);
  });

  test('handles missing or bad dates', () => {
    expect(formatDataDate(null)).toBeNull();
    expect(formatDataDate('soon')).toBeNull();
  });
});
