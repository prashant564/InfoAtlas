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
    divider: {
      backgroundColor: theme.colors.divider,
      marginVertical: 16,
      height: 1,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      color: theme.colors.secondaryText,
      fontWeight: 'bold' as 'bold',
      letterSpacing: 0.8,
      marginBottom: 12,
    },
    optionsRow: {
      flexDirection: 'row' as 'row',
      marginHorizontal: -4,
    },
    optionButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 16,
      paddingVertical: 8,
    },
  };
};
