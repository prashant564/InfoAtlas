import {ThemeType} from '@themes';
import {Platform} from 'react-native';

export const SettingScreenStyles = (theme: ThemeType) => {
  return {
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      paddingTop: Platform.OS === 'android' ? 16 : 0,
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row' as 'row',
      alignItems: 'flex-start' as 'flex-start',
    },
    divider: {
      backgroundColor: theme.appColors.white__a5,
      marginVertical: 16,
      height: 1,
    },
  };
};
