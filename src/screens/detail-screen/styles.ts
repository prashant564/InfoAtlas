import {Platform} from 'react-native';

import {ThemeType} from '@themes/getTheme';

export const DetailScreenStyles = (theme: ThemeType) => {
  return {
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingBottom: 24,
    },
    mainContainer: {
      padding: 16,
      flex: 1,
      alignItems: 'flex-start' as 'flex-start',
    },
    headerContainer: {
      width: '100%' as '100%',
      paddingHorizontal: 16,
      marginTop: Platform.OS === 'android' ? 8 : 0,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center' as 'center',
    },
    rowWiseContainer: {
      width: '100%' as '100%',
      flexDirection: 'row' as 'row',
      marginBottom: 4,
    },
    rowContainer: {
      flexDirection: 'row' as 'row',
      flex: 1,
    },
    rowItemContainer: {
      flexDirection: 'row' as 'row',
      width: '100%' as '100%',
      alignItems: 'center' as 'center',
    },
    leftAlignItemContainer: {
      flex: 1,
      alignItems: 'fcente' as 'flex-start',
    },
    divider: {
      backgroundColor: theme.appColors.white__a5,
      marginVertical: 8,
      height: 1,
    },
    fullWidthContainer: {
      width: '100%' as '100%',
    },
    fullFlexContainer: {
      flex: 1,
    },
    bottomRowItemContainer: {
      flexDirection: 'row' as 'row',
      width: '100%' as '100%',
      alignItems: 'center' as 'center',
      marginBottom: Platform.OS === 'ios' ? 36 : 0,
    },
    surface: {
      padding: 16,
      borderRadius: 16,
      marginTop: 16,
    },
    flatListStyle: {
      marginTop: 8,
    },
  };
};
