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
      flexDirection: 'row' as 'row',
      alignItems: 'flex-start' as 'flex-start',
    },
    divider: {
      backgroundColor: theme.appColors.white__a5,
      marginVertical: 16,
      height: 1,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      color: '#888' as '#888',
      fontWeight: 'bold' as 'bold',
      marginBottom: 10,
    },
    developerInfo: {
      marginBottom: 20,
    },
    developerDescription: {
      color: '#fff' as '#fff',
      marginBottom: 16,
    },
    linkText: {
      color: '#1E90FF' as '#1E90FF',
      fontSize: 16,
    },
  };
};
