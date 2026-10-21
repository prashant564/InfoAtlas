import {ThemeType} from '@themes';

const worldMapStyles = (theme: ThemeType) => {
  return {
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    legendRow: {
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    legendItem: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      marginHorizontal: 12,
    },
    legendSwatch: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    mapContainer: {
      flex: 1,
      marginHorizontal: 16,
      borderRadius: 16,
      overflow: 'hidden' as 'hidden',
      backgroundColor: theme.colors.surface,
    },
    zoomButtons: {
      position: 'absolute' as 'absolute',
      right: 4,
      bottom: 4,
    },
    zoomButton: {
      margin: 4,
    },
    bottomPanel: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 16,
      borderRadius: 16,
    },
    selectedHeader: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
    },
    selectedFlag: {
      fontSize: 32,
      lineHeight: 40,
      marginRight: 12,
    },
    selectedName: {
      flex: 1,
    },
    // Icon after the label.
    detailsButtonContent: {
      flexDirection: 'row-reverse' as 'row-reverse',
    },
    hint: {
      textAlign: 'center' as 'center',
    },
  };
};

export default worldMapStyles;
