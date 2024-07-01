import {colors, fontFamily} from './theme-main';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  adaptNavigationTheme,
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperDefaultTheme,
} from 'react-native-paper';

import merge from 'deepmerge';

const {LightTheme: AdaptedNavDefaultTheme, DarkTheme: AdaptedNavDarkTheme} =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

const mergedDefaultTheme = merge(PaperDefaultTheme, AdaptedNavDefaultTheme);
const mergedDarkTheme = merge(PaperDarkTheme, AdaptedNavDarkTheme);

export const CombinedDefaultTheme = {
  ...mergedDefaultTheme,
  colors: {
    ...mergedDefaultTheme,
    background: colors.primary500,
    backdrop: colors.primary600,
    primary: colors.primary100,
    secondary: colors.primary200,
    text: 'white',
    placeholder: colors.white__a5,
    disabled: colors.primary400,
    surface: colors.primary400,
    secondaryText: colors.primaryDark100,
    textInputBg: colors.primary600,
    secondaryTextInputBg: colors.primary500,
    activeBackground: colors.primary100,
    inactiveBackground: colors.primary300,
    activeText: colors.white,
    inactiveText: colors.primaryDark100,

    // manually added
    elevation: {
      ...PaperDefaultTheme.colors.elevation,
      level1: colors.primary400, // surfaceContainerLow
      level2: colors.primary400, // surfaceContainer
      level3: colors.primary400, // surfaceContainerHigh
      level4: colors.primary400, // surfaceContainerHighest
      level5: colors.primary400, // surfaceContainerHighest
    },
    card: colors.primary400,
    border: colors.primary100,
    notification: colors.primary200,
  },
  appColors: {
    ...colors,
  },

  fontFamily: {
    ...fontFamily,
  },
};

export const CombinedDarkTheme = {
  ...mergedDarkTheme,
  colors: {
    ...mergedDarkTheme,
    background: '#1E1E1E',
    backdrop: colors.darkThemeAppGrey900,
    primary: colors.darkThemeGrey700,
    secondary: colors.darkThemeGrey900,
    text: 'white',
    placeholder: colors.white__a5,
    disabled: colors.primary400,
    surface: colors.darkThemeGrey700,
    secondaryText: colors.darkThemeGrey100,
    textInputBg: colors.darkThemeGrey700,
    secondaryTextInputBg: colors.darkThemeAppGrey900,
    activeBackground: colors.primary100,
    inactiveBackground: colors.darkThemeGrey700,
    activeText: colors.white,
    inactiveText: colors.primary100,

    // manually added
    elevation: {
      ...PaperDarkTheme.colors.elevation,
      level1: colors.darkThemeGrey700, // surfaceContainerLow
      level2: colors.darkThemeGrey700, // surfaceContainer
      level3: colors.darkThemeGrey700, // surfaceContainerHigh
      level4: colors.darkThemeGrey700, // surfaceContainerHighest
      level5: colors.darkThemeGrey700, // surfaceContainerHighest
    },
    card: colors.darkThemeGrey700,
    border: colors.primary100,
    notification: colors.darkThemeGrey900,
  },
  appColors: {
    ...colors,
  },
  fontFamily: {
    ...fontFamily,
  },
};
