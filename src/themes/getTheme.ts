import {Theme, useThemeContext} from '@utils/ThemeContext';
import {CombinedDarkTheme, CombinedDefaultTheme} from './theme';

export const useAppTheme = () => {
  const {themeMode} = useThemeContext();
  const theme =
    themeMode === Theme.Light ? CombinedDefaultTheme : CombinedDarkTheme;
  return {
    theme,
  };
};

export type ThemeType = typeof CombinedDefaultTheme | typeof CombinedDarkTheme;
