/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState, useRef} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import RNBootSplash from 'react-native-bootsplash';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import {ThemeContext, Theme} from '@utils/ThemeContext';
import {load, save} from '@utils/storageUtils';
import * as storage from '@utils/storageUtils';

import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  useNavigationPersistence,
} from '@navigation';

import {SplashScreen} from '@screens';

import {CombinedDarkTheme, CombinedDefaultTheme} from '@themes';

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

const App = () => {
  const openedOnce = useRef(false);
  const [appReadyStatus, setAppReadyStatus] = useState<-1 | 0 | 1>(0);
  const [appInitCallsError, setAppInitCallsError] = useState<-1 | 0 | 1>(-1);

  useBackButtonHandler(canExit);
  const {onNavigationStateChange} = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  );

  useEffect(() => {
    load('openedOnce').then(res => {
      if (res === 'true') {
        openedOnce.current = true;
      }
    });
  }, []);

  //   if (appReadyStatus === 1) {
  //     return <RootNavigator onStateChange={onNavigationStateChange} />;
  //   }

  //   return <SplashScreen />;
  return <RootNavigator onStateChange={onNavigationStateChange} />;
};

const ProvidedApp = () => {
  const [themeMode, setThemeMode] = useState(Theme.Dark);
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
