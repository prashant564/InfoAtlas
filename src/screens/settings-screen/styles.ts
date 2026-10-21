import {ThemeType} from '@themes';

export const ROW_ICON_SIZE = 18;

export const SettingScreenStyles = (theme: ThemeType) => {
  return {
    outerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    title: {
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 4,
    },
    /**
     * Sections
     */
    sectionTitle: {
      marginTop: 24,
      marginBottom: 8,
      marginLeft: 16,
    },
    sectionCard: {
      borderRadius: 16,
      overflow: 'hidden' as 'hidden',
      backgroundColor: theme.colors.surface,
    },
    sectionFooter: {
      marginTop: 8,
      marginHorizontal: 16,
    },
    /**
     * Rows
     */
    row: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      minHeight: 56,
      paddingLeft: 16,
    },
    rowIconTile: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      marginRight: 16,
    },
    // Holds everything right of the icon, so separators are inset like
    // iOS / Material lists.
    rowBody: {
      flex: 1,
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      alignSelf: 'stretch' as 'stretch',
      paddingVertical: 12,
      paddingRight: 16,
    },
    rowSeparator: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    rowText: {
      flex: 1,
    },
    rowTrailing: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      marginLeft: 12,
    },
    rowValue: {
      marginRight: 4,
    },
    /**
     * Theme picker
     */
    segmentedPadding: {
      padding: 12,
    },
    segmentedTrack: {
      flexDirection: 'row' as 'row',
      padding: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.inactiveBackground,
    },
    segment: {
      flex: 1,
      minHeight: 44,
      borderRadius: 9,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      paddingVertical: 6,
    },
    // Same pair as the bottom tab indicator; works in light and dark.
    segmentSelected: {
      backgroundColor: theme.colors.primaryContainer,
    },
    segmentLabel: {
      marginTop: 2,
    },
    /**
     * Footer
     */
    footer: {
      alignItems: 'center' as 'center',
      marginTop: 32,
    },
    footerLogo: {
      width: 56,
      height: 56,
      marginBottom: 8,
    },
  };
};
