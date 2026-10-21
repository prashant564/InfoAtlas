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
      paddingBottom: Platform.OS === 'ios' ? 52 : 16,
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
    rowItemContainer: {
      flexDirection: 'row' as 'row',
      width: '100%' as '100%',
      alignItems: 'center' as 'center',
    },
    fullWidthContainer: {
      width: '100%' as '100%',
    },
    surface: {
      padding: 16,
      borderRadius: 16,
      marginTop: 16,
    },
    flagEmojiCover: {
      height: 195,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
    flagEmojiText: {
      fontSize: 120,
      lineHeight: 150,
    },
    sectionTitle: {
      marginTop: 24,
      marginBottom: 8,
    },
    /**
     * Hero
     */
    heroNameBlock: {
      marginTop: 16,
    },
    pillRow: {
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
      marginTop: 8,
      marginHorizontal: -4,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      margin: 4,
      backgroundColor: theme.colors.inactiveBackground,
    },
    quickFactsRow: {
      flexDirection: 'row' as 'row',
      marginTop: 16,
      paddingVertical: 12,
      borderRadius: 16,
    },
    quickFact: {
      flex: 1,
      alignItems: 'center' as 'center',
      paddingHorizontal: 4,
    },
    quickFactDivider: {
      width: 1,
      backgroundColor: theme.appColors.white__a2,
    },
    /**
     * Right now
     */
    localTimeCard: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      marginTop: 16,
      padding: 16,
      borderRadius: 16,
    },
    localTimeTextBlock: {
      flex: 1,
      marginLeft: 8,
    },
    /**
     * Facts grid
     */
    factsCard: {
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderRadius: 16,
    },
    factCell: {
      width: '50%' as '50%',
      paddingTop: 16,
      paddingRight: 8,
    },
    flatListStyle: {
      marginTop: 8,
    },
  };
};
