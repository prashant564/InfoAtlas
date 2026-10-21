import {createContext, useContext} from 'react';

export enum Theme {
  System = 'System',
  Dark = 'Dark',
  Light = 'Light',
}

export type ThemeContextType = {
  /** The user's preference. */
  themeMode: Theme;
  setThemeMode: (Theme: Theme) => void;
  /** The preference resolved against the OS setting. */
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: Theme.System,
  setThemeMode: () => console.warn('no theme provider'),
  isDark: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export const parseThemeMode = (saved: string | null): Theme =>
  saved === Theme.Light || saved === Theme.Dark ? saved : Theme.System;

export const resolveIsDark = (
  themeMode: Theme,
  systemScheme: string | null | undefined,
): boolean =>
  themeMode === Theme.System
    ? systemScheme === 'dark'
    : themeMode === Theme.Dark;
