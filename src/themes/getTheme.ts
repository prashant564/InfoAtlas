import {useThemeContext} from '@utils/ThemeContext';
import {CombinedDarkTheme, CombinedDefaultTheme} from './theme';

export const useAppTheme = () => {
  const {isDark} = useThemeContext();
  const theme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;
  return {
    theme,
  };
};

export type ThemeType = typeof CombinedDefaultTheme | typeof CombinedDarkTheme;
