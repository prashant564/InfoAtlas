import {MAP_ASPECT_RATIO} from '@components';
import {ThemeType} from '@themes';

const myWorldStyles = (theme: ThemeType) => {
  return {
    statsCard: {
      padding: 16,
      borderRadius: 16,
      marginHorizontal: 8,
      marginBottom: 8,
    },
    statsHeadline: {
      flexDirection: 'row' as 'row',
      alignItems: 'baseline' as 'baseline',
    },
    statsHeadlineSuffix: {
      marginLeft: 8,
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      marginTop: 12,
      overflow: 'hidden' as 'hidden',
      backgroundColor: theme.colors.inactiveBackground,
    },
    progressFill: {
      height: '100%' as '100%',
      borderRadius: 4,
      backgroundColor: theme.colors.visited,
    },
    miniStatsRow: {
      flexDirection: 'row' as 'row',
      marginTop: 16,
    },
    miniStat: {
      flex: 1,
    },
    mapCard: {
      borderRadius: 16,
      marginHorizontal: 8,
      marginBottom: 8,
    },
    // Clips the map to the card's corners (Surface itself can't clip
    // without losing its shadow).
    mapCardContent: {
      borderRadius: 16,
      overflow: 'hidden' as 'hidden',
    },
    mapCardHeader: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    mapCardMap: {
      width: '100%' as '100%',
      aspectRatio: MAP_ASPECT_RATIO,
      marginBottom: 8,
    },
    tabsRow: {
      flexDirection: 'row' as 'row',
      marginHorizontal: 4,
      marginVertical: 8,
    },
    tabButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    emptyHint: {
      textAlign: 'center' as 'center',
      marginTop: 8,
      paddingHorizontal: 24,
    },
  };
};

export default myWorldStyles;
