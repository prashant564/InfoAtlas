import {colors, fontFamily} from './theme-main';
import {Palette, darkPalette, lightPalette} from './palette';

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

const buildTheme = (
  base: typeof mergedDefaultTheme,
  palette: Palette,
  dark: boolean,
) => ({
  ...base,
  dark,
  statusBarStyle: (dark ? 'light-content' : 'dark-content') as
    | 'light-content'
    | 'dark-content',
  colors: {
    ...base.colors,

    // Material 3 roles used by react-native-paper components
    primary: palette.primary,
    onPrimary: palette.onPrimary,
    primaryContainer: palette.primaryContainer,
    onPrimaryContainer: palette.onPrimaryContainer,
    secondary: palette.primary,
    onSecondary: palette.onPrimary,
    // Bottom tab active indicator
    secondaryContainer: palette.primaryContainer,
    onSecondaryContainer: palette.onPrimaryContainer,
    background: palette.background,
    onBackground: palette.text,
    surface: palette.surface,
    onSurface: palette.text,
    surfaceVariant: palette.surfaceMuted,
    onSurfaceVariant: palette.secondaryText,
    outline: palette.secondaryText,
    outlineVariant: palette.divider,
    error: palette.error,
    elevation: {
      level0: 'transparent',
      level1: palette.elevation[0],
      level2: palette.elevation[1],
      level3: palette.elevation[2],
      level4: palette.elevation[3],
      level5: palette.elevation[4],
    },

    // React Navigation
    card: palette.surface,
    text: palette.text,
    border: palette.divider,
    notification: palette.error,

    // App tokens
    secondaryText: palette.secondaryText,
    placeholder: palette.placeholder,
    divider: palette.divider,
    textInputBg: palette.surface,
    activeBackground: palette.primary,
    activeText: palette.onPrimary,
    inactiveBackground: palette.surfaceMuted,
    inactiveText: palette.primary,
    visited: palette.visited,
    visitedContainer: palette.visitedContainer,
    onVisitedContainer: palette.onVisitedContainer,
    wishlist: palette.wishlist,
    wishlistContainer: palette.wishlistContainer,
    onWishlistContainer: palette.onWishlistContainer,
    mapLand: palette.mapLand,
    skeletonBone: palette.skeletonBone,
    skeletonHighlight: palette.skeletonHighlight,
  },
  appColors: {
    ...colors,
  },
  fontFamily: {
    ...fontFamily,
  },
});

export const CombinedDefaultTheme = buildTheme(
  mergedDefaultTheme,
  lightPalette,
  false,
);

export const CombinedDarkTheme = buildTheme(mergedDarkTheme, darkPalette, true);
