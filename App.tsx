/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import RNBootSplash from 'react-native-bootsplash';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import {ThemeContext, Theme} from '@utils/ThemeContext';
import {load, loadString, saveString} from '@utils/storageUtils';
import * as storage from '@utils/storageUtils';
import {THEME_MODE_KEY} from '@utils/constants';

import {useAppBoundStore} from '@store/mainStore';

import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  useNavigationPersistence,
} from '@navigation';

import {CombinedDarkTheme, CombinedDefaultTheme} from '@themes';

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

const App = () => {
  const openedOnce = useRef(false);

  const {__fetchAllCountriesDetails, __fetchAllFavCountriesDetails} =
    useAppBoundStore(state => ({
      __fetchAllCountriesDetails: state.__fetchAllCountriesDetails,
      __fetchAllFavCountriesDetails: state.__fetchAllFavCountriesDetails,
    }));

  useBackButtonHandler(canExit);
  const {onNavigationStateChange} = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  );

  useEffect(() => {
    RNBootSplash.hide({fade: true});

    __fetchAllCountriesDetails();
    __fetchAllFavCountriesDetails();

    load('openedOnce').then(res => {
      if (res === 'true') {
        openedOnce.current = true;
      }
    });
  }, [__fetchAllCountriesDetails, __fetchAllFavCountriesDetails]);

  return <RootNavigator onStateChange={onNavigationStateChange} />;
};

const ProvidedApp = () => {
  // null until the saved preference is read; the boot splash stays up meanwhile.
  const [themeMode, setThemeModeState] = useState<Theme | null>(null);

  useEffect(() => {
    loadString(THEME_MODE_KEY).then(saved => {
      setThemeModeState(saved === Theme.Light ? Theme.Light : Theme.Dark);
    });
  }, []);

  const setThemeMode = useCallback((mode: Theme) => {
    setThemeModeState(mode);
    saveString(THEME_MODE_KEY, mode);
  }, []);

  if (themeMode === null) {
    return null;
  }

  const appTheme =
    themeMode === Theme.Light ? CombinedDefaultTheme : CombinedDarkTheme;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeContext.Provider value={{themeMode, setThemeMode}}>
        <PaperProvider theme={appTheme}>
          <App />
        </PaperProvider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default ProvidedApp;
