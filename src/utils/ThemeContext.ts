import {createContext, useContext} from 'react';

export enum Theme {
  Dark = 'Dark',
  Light = 'Light',
}

export type ThemeContextType = {
  themeMode: Theme;
  setThemeMode: (Theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: Theme.Dark,
  setThemeMode: () => console.warn('no theme provider'),
});

export const useThemeContext = () => useContext(ThemeContext);
