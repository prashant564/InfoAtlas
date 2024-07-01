/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React, {useState} from 'react';
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Theme, useThemeContext} from '@utils/ThemeContext';

import {CombinedDarkTheme, CombinedDefaultTheme} from '@themes/theme';

import {If, Then, Else} from '@components/Conditionals';

import {SplashScreen} from '@screens';

import {navigationRef} from './index';
import primaryNavigator from './primary-navigator';

export type RootParamList = {
  PrimaryStack: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
      <Stack.Screen
        name="PrimaryStack"
        component={primaryNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const RootNavigator = (props: NavigationProps) => {
  const [ready, setReady] = useState(false);
  const {themeMode} = useThemeContext();
  const appTheme =
    themeMode === Theme.Light ? CombinedDefaultTheme : CombinedDarkTheme;

  return (
    <NavigationContainer
      {...props}
      theme={appTheme}
      onReady={() => {
        setReady(true);
      }}
      ref={navigationRef as NavigationContainerRefWithCurrent<{}>}>
      <If condition={ready}>
        <Then>
          <RootStack />
        </Then>
        <Else>
          <SplashScreen />
        </Else>
      </If>
    </NavigationContainer>
  );
};

RootNavigator.displayName = 'RootNavigator';
